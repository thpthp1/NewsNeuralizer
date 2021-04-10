import os
import requests
import json
from bs4 import BeautifulSoup
import re
from pprint import pprint
import logging
from multiprocessing import Pool
import newsplease
from newsplease import NewsArticle
from requests.sessions import session
from typing import List, Tuple

loggger = logging.getLogger('app_api')

PROC_COUNT = 3

with open(os.path.join(os.path.dirname(__file__), "feed-config.json"), "rb") as f:
    FEED_JSON = json.load(f)

def _article(link: str):
    article = newsplease.NewsPlease.from_url(url=link)
    # print(article.title)
    # print(article.source_domain)
    return article

def news_feed() -> List[NewsArticle.NewsArticle]:
    articles = []
    links = []
    for source in FEED_JSON["sources"]:
        response = requests.get(source["url"])
        rss = BeautifulSoup(response.content, "xml")
        link_pattern = re.compile(source["find"]["href"])
        links += [link.text for link in rss.find_all(source["find"]["element"]) 
                        if link_pattern.match(link.text)]
    #print(links)
    with Pool(processes=PROC_COUNT) as pool:
        articles = pool.map(_article, links)
    return articles