import ssl
import re
import pickle
from performance import *
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Check and install nltk packages
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

try:
    nltk.data.find('corpora/stopwords.zip')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('corpora/wordnet.zip')
except LookupError:
    nltk.download('wordnet') #, download_dir='../venv/nltk_data')

try:
    nltk.data.find('tokenizers/punkt.zip')
except LookupError:
    nltk.download('punkt')


FILE_NAME = 'news_model.sav'


def load_data():
    """
    1 = True, 0 = Fake
    Load in the true and fake news datasets
    """
    true = pd.read_csv('./data/true.csv')
    true[LABEL_COL] = np.ones(true.shape[0]).astype('int')
    fake = pd.read_csv('./data/fake.csv')
    fake[LABEL_COL] = np.zeros(fake.shape[0]).astype('int')
    df = pd.concat([true, fake], ignore_index=True)
    df[NEWS_COL] = df['title'] + ' ' + df['text']
    df = df.drop(columns=['title', 'text', 'subject', 'date'])
    df = df[[NEWS_COL, LABEL_COL]]    # reorder columns
    return df


def preprocess_text(df):
    wnl = WordNetLemmatizer()
    sw = stopwords.words('english')

    # clean with regex
    df[NEWS_COL] = df[NEWS_COL].apply(lambda x: re.sub(r'[^\w\s]', '', x))

    # tokenize words
    df[NEWS_COL] = df[NEWS_COL].apply(lambda x: nltk.word_tokenize(x))

    # remove stopwords
    df[NEWS_COL] = df[NEWS_COL].apply(lambda x: [w for w in x if not w in sw])

    # lemmatize document
    df[NEWS_COL] = df[NEWS_COL].apply(lambda x: ' '.join([wnl.lemmatize(w) for w in x]))


def save_model(classifier):
    pickle.dump(classifier, open(FILE_NAME, 'wb'))


def load_model():
    return pickle.load(open(FILE_NAME, 'rb'))


def predict(news_arr):
    """
    Predicts whether each news in news_arr is fake or not
    :param news_arr: array of news as strings
    :return: array of labels (1 = True, 0 fake), and probabilities
    """
    news = pd.DataFrame(data=news_arr, columns=[NEWS_COL])
    preprocess_text(news)
    cl = load_model()
    labels, confs = cl.predict(news[NEWS_COL])
    return labels, confs


if __name__ == '__main__':
    # df = load_data()
    # preprocess_text(df)
    df = pickle.load(open('preproc_data', 'rb'))
    classifier, acc, prec, rec, auc_val = train_full(df)
    save_model(classifier)

    # Train
    # classifier, acc, prec, rec, auc_val = train_full(df)
    # print('Trained :', acc, prec, rec, auc_val)
    # save_model(classifier)

    classifier = load_model()
    # Predict
    # input should be an array. Each element is a single news (title + body)
    str = open('true_n.txt', 'r').read()
    news = pd.DataFrame(data=[str], columns=[NEWS_COL])
    preprocess_text(news)
    labels, confs = classifier.predict(news[NEWS_COL])
    print(labels, confs)



