from classifier import *
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import AdaBoostClassifier


def dataset_analysis(df):
    print('Total examples:', df.shape[0])
    print('Total fake:', df[df[LABEL_COL] == 0].shape[0])
    print('Total real:', df[df[LABEL_COL] == 1].shape[0])


def train(name, df, clf):
    acc_mean, acc_std, prec_mean, prec_std, \
        recall_mean, recall_std, roc_val = train_5fold(df, clf=clf, print_enabled=True)

    print(name)
    print('Accuracy: ', acc_mean, '+-', acc_std)
    print('Precision: ', prec_mean, '+-', prec_std)
    print('Recall: ', recall_mean, '+-', recall_std)
    print('ROC: ', roc_val)
    print('---------------')


df1 = load_dataset1()
df2 = load_dataset2()
df = pd.concat([df1, df2], ignore_index=True)


# print('Preprocessing data...')
# preprocess_text(df)
# pickle.dump(df, open('preproc_data_all', 'wb'))
df = pickle.load(open('preproc_data_all', 'rb'))

train('Logistic Regression', df, LogisticRegression())
train('Naive Bayes', df, MultinomialNB())
train('Decision Tree', df, DecisionTreeClassifier())  # With gini
train('Adaboost', df, AdaBoostClassifier())

