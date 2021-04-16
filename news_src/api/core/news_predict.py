from typing import Any, List, Tuple
from .ml.classifier import load_model, preprocess_text
from .ml.performance import NEWS_COL
import pandas as pd
import os
# MODEL = load_model()

# def import_function():
#     import sys
#     sys.path.append(os.path.dirname(BASE_DIR))
#     module = __import__('models.generator')  # import code
#     sys.path.pop()
#     return module

def news_predict(bodytext) -> Tuple[List[int], List[float]]:
    model = load_model()
    if type(bodytext) == str:
        news = pd.DataFrame(data=[bodytext], columns=[NEWS_COL])
    else:
        news = pd.DataFrame(data=bodytext, columns=[NEWS_COL])
    news.fillna('', inplace=True)
    preprocess_text(news)
    label, conf = model.predict(news)
    return label, conf