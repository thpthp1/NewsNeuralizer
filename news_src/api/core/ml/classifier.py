import os
import ssl
import re
import pickle
from .performance import *
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


MODEL_NAME = os.path.join(os.path.dirname(__file__), 'news_model')


def load_dataset1():
    """
    1 = True, 0 = Fake
    Load in dataset 1
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


def load_dataset2():
    """
    1 = True, 0 = Fake
    Load in dataset 2
    """
    df = pd.read_csv('./data/news.csv')
    df[NEWS_COL] = df['title'] + ' ' + df['text']

    labels = []
    for i in range(df.shape[0]):
        if df.iloc[i]['label'] == 'FAKE':
            labels.append(0)
        else:
            labels.append(1)

    df[LABEL_COL] = labels
    df = df.drop(columns=['title', 'text'])
    df = df[[NEWS_COL, LABEL_COL]]    # reorder columns

    return df


def preprocess_text(df):
    """
    Preprocess datasets
    :param df: input dataset
    :return: preprocessed dataframe
    """
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
    pickle.dump(classifier, open(MODEL_NAME, 'wb'))


def load_model():
    return pickle.load(open(MODEL_NAME, 'rb'))


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

