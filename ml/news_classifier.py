from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.linear_model import PassiveAggressiveClassifier


class NewsClassifier:
    def __init__(self):
        self.cv = CountVectorizer()
        self.tfidf = TfidfTransformer(norm="l2")
        self.clf = LogisticRegression()

    def train(self, examples, labels):
        """
        Train model
        :param examples: pre-processed news
        :param labels: class labels
        """
        tf_idf_matrix = self.__vectorize(examples)  # rows are news, cols are words

        # Fit the classifier
        #x_train, x_test, y_train, y_test = train_test_split(tf_idf_matrix,
                                                            #df[LABEL_COL], random_state=0)
        self.clf.fit(tf_idf_matrix, labels)

    def predict(self, new_examples):
        """
        Predicts a set of pre-processed news
        :param new_examples:
        :return:
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
        # Transform words into numbers (counts for each word)
        # Rows are rows, cols are indices of unique words a[i][j]: frequency
        freq_matrix = self.cv.fit_transform(examples)

        # Give larger values (weigh up) for less frequent words
        self.tfidf.fit(freq_matrix)
        tf_idf_matrix = self.tfidf.fit_transform(freq_matrix)

        return tf_idf_matrix

