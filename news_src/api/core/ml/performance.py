import pandas as pd
import numpy as np
from copy import deepcopy
from .model import *

CONFIDENCE_LBL = 'CONFIDENCE'
NEWS_COL = 'combined'
LABEL_COL = 'label'


def train_full(df):
    true_classes = []
    conf_levels = []
    num_examples = df.shape[0]

    classifier, acc, prec, rec = train_test(df, df, true_classes, conf_levels)
    auc_val = auc(true_classes, conf_levels, num_examples)

    return classifier, acc, prec, rec, auc_val


def train_5fold(df, clf=LogisticRegression(), print_enabled=False):
    folds_list = create_folds(df)
    accuracy_list = []
    precision_list = []
    recall_list = []

    # ROC
    true_classes = []
    conf_levels = []
    num_examples = 0

    for i in range(len(folds_list)):
        if folds_list[i].empty:
            continue

        train, test = train_test_split(folds_list, i)
        num_examples += test.shape[0]

        if print_enabled:
            print('Predicting fold # ', i + 1)

        _, acc, prec, rec = train_test(train, test, true_classes, conf_levels, clf=clf)
        accuracy_list.append(acc)
        precision_list.append(prec)
        recall_list.append(rec)

    acc_mean = np.round(np.mean(accuracy_list), 3)
    prec_mean = np.round(np.mean(precision_list), 3)
    recall_mean = np.round(np.mean(recall_list), 3)

    acc_std = np.round(np.std(accuracy_list), 3)
    prec_std = np.round(np.std(precision_list), 3)
    recall_std = np.round(np.std(recall_list), 3)
    auc_val = auc(true_classes, conf_levels, num_examples)

    return acc_mean, acc_std, prec_mean, prec_std, recall_mean, recall_std, auc_val


def train_test(training_df, testing_df, true_classes, conf_levels, clf=LogisticRegression()):

    # Train classifier
    classifier = NewsClassifier(clf=clf) #NeuralNewsClassifier()
    classifier.train(training_df[NEWS_COL], training_df[LABEL_COL])

    # Test classifier
    test_examples = testing_df.shape[0]
    total_pos = testing_df[testing_df[LABEL_COL] == 1].shape[0]
    tp_plus_tn = 0
    true_pos = 0
    false_pos = 0

    labels, probs = classifier.predict(testing_df[NEWS_COL])

    for i in range(test_examples):
        true_cl = testing_df.iloc[i][LABEL_COL]
        predicted_cl = labels[i]

        true_classes.append(true_cl)
        conf_levels.append(probs[i])

        if true_cl == predicted_cl:
            tp_plus_tn += 1

        if true_cl and predicted_cl:
            true_pos += 1
        elif (true_cl == 0) and (predicted_cl == 1):
            false_pos += 1

    accuracy = np.round(tp_plus_tn / test_examples, 3)
    precision = 0.0 if (true_pos + false_pos) == 0 else np.round(true_pos / (true_pos + false_pos), 3)
    recall = 0.0 if total_pos == 0 else np.round(true_pos / total_pos, 3)

    return classifier, accuracy, precision, recall


def auc(true_classes, conf_levels, num_examples):
    """
    Calculates the area under the ROC curve
    :param true_classes:
    :param conf_levels:
    :param num_examples:
    :return:
    """
    roc_df = pd.DataFrame()
    roc_df[LABEL_COL] = true_classes
    roc_df[CONFIDENCE_LBL] = conf_levels
    roc_df.sort_values(CONFIDENCE_LBL, ascending=False, inplace=True, ignore_index=True)

    total_pos = roc_df[roc_df[LABEL_COL] == 1].shape[0]
    total_neg = num_examples - total_pos
    false_pos = 0
    true_pos = 0

    prev_fp = 0
    prev_tp = 0
    total_area = 0

    for i in range(num_examples):
        if roc_df[LABEL_COL][i]:
            true_pos += 1
        else:
            false_pos += 1

        cur_fp = false_pos / total_neg
        cur_tp = true_pos / total_pos
        total_area += trapezoid_area(a=prev_tp, b=cur_tp, h=(cur_fp - prev_fp))
        prev_fp = cur_fp
        prev_tp = cur_tp

    return np.round(total_area, 3)


def trapezoid_area(a=0, b=0, h=0):
    return ((a + b) * h) / 2


def create_folds(df, random_seed=12345):
    """
    5-fold stratified cross validation:
    Since we want an equal number of true and false examples in each data set,
    start by creating two dataframes to separate true and false class labels.
    Shuffle these dataframes and then split each into 5 smaller subarrays.
    Then, take true[i] and concatenate with false[i] to create folds
    """
    np.random.seed(random_seed)

    folds = []
    false = df[df[LABEL_COL] == 0]
    true = df[df[LABEL_COL] == 1]

    # shuffle the indexes for a random selection
    f_idxs = np.array(range(false.shape[0]))
    t_idxs = np.array(range(true.shape[0]))
    np.random.shuffle(f_idxs)
    np.random.shuffle(t_idxs)

    # chunk examples into 5 equal length subarrays
    false_div = np.array_split(f_idxs, 5)
    true_div = np.array_split(t_idxs, 5)

    # concat true and false subarrays to make folds
    for i in range(5):
        f_append = false.iloc[false_div[i]]
        t_append = true.iloc[true_div[i]]
        folds.append(pd.concat([f_append, t_append]))

    return folds


def train_test_split(folds, test_i):
    """
    Given the five folds, this algorithm concatenates 4 of the folds together
    for training and uses the other for testing
    """
    folds_cpy = deepcopy(folds)
    test = folds_cpy.pop(test_i)
    train = pd.concat(folds_cpy)

    return train, test
