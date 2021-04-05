import ssl
import re
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


if __name__ == '__main__':
    df = load_data()
    #preprocess_data(df)

    # Train
    classifier, acc, prec, rec, auc_val = train_full(df)
    print('Trained :', acc, prec, rec, auc_val)
    #acc_mean, acc_std, prec_mean, prec_std, recall_mean, recall_std, auc_val = train_5fold(df, print_enabled=True)
    #print(acc_mean, prec_mean, recall_mean, auc_val)

    # Predict
    # input should be an array. Each element is a single news (title + body)
    str = open('new_news.txt', 'r').read()
    news = pd.DataFrame(data=[str], columns=[NEWS_COL])
    preprocess_text(news)
    labels, confs = classifier.predict(news[NEWS_COL])
    print(labels, confs)


