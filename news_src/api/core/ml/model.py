from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import AdaBoostClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression


class NewsClassifier:
    """
    Trains and predicts whether a news article is fake or not
    """
    def __init__(self, clf=LogisticRegression()):
        self.cv = CountVectorizer()
        self.tfidf = TfidfTransformer(norm="l2")
        self.clf = clf

    def train(self, examples, labels):
        """
        Train model
        :param examples: pre-processed news
        :param labels: class labels
        """
        tf_idf_matrix = self.__vectorize(examples)  # rows are news, cols are words

        # Fit the classifier
        self.clf.fit(tf_idf_matrix, labels)

    def predict(self, new_examples):
        """
        Predicts a set of pre-processed news
        :param new_examples: novel examples
        :return: array of labels and confidence values
        """
        new_counts = self.cv.transform(new_examples)
        new_tfidf = self.tfidf.transform(new_counts)
        predictions = self.clf.predict_proba(new_tfidf)

        labels = []
        conf = []
        for prediction in predictions:
            if prediction[0] > prediction[1]:
                labels.append(0)
                conf.append(round(prediction[0], 3))
            else:
                labels.append(1)
                conf.append(round(prediction[1]))

        return labels, conf

    def __vectorize(self, examples):
        """
        Transform words into numbers (counts for each word)
        :param examples: input news articles
        :return: TF-IDF matrix
        """

        # Rows are news, cols are indices of unique words a[i][j]: frequency
        freq_matrix = self.cv.fit_transform(examples)

        # Give larger values (weigh up) for less frequent words
        self.tfidf.fit(freq_matrix)
        tf_idf_matrix = self.tfidf.fit_transform(freq_matrix)

        return tf_idf_matrix

