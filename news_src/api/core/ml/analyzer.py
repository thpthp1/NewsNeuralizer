from .classifier import *
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.neural_network import MLPClassifier


def train(name, df, clf):
    acc_mean, acc_std, prec_mean, prec_std, \
        recall_mean, recall_std, roc_val = train_5fold(df, clf=clf, print_enabled=True)

    print(name)
    print('Accuracy: ', acc_mean, '+-', acc_std)
    print('Precision: ', prec_mean, '+-', prec_std)
    print('Recall: ', recall_mean, '+-', recall_std)
    print('ROC: ', roc_val)
    print('---------------')


#df = load_data()
#print('Preprocessing data...')
#preprocess_text(df)
#pickle.dump(df, open('preproc_data', 'wb'))

df = pickle.load(open('preproc_data', 'rb'))

train('Logistic Regression', LogisticRegression())
train('Naive Bayes', MultinomialNB())
train('Decision Tree', DecisionTreeClassifier()) # With gini
train('Adaboost', AdaBoostClassifier())
#train('Neural Network', df, MLPClassifier())
