import os
from django.db import models
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
import django
django.setup()
from .models import News
from datetime import datetime

loggger = logging.getLogger('app_api')

PROC_COUNT = 3

with open(os.path.join(os.path.dirname(__file__), "feed-config.json"), "rb") as f:
    FEED_JSON = json.load(f)

def _article(link: str):
    if News.objects.filter(url=link).exists():
        news = News.objects.get(url=link)
        article = newsplease.NewsPlease()
        article.maintext = news.text
        article.url = news.url
        article.image_url = news.image
        article.date_publish = news.date_publish
        article.source_domain = news.source_domain
    else:
        article = newsplease.NewsPlease.from_url(url=link)
        if article.maintext is None:
            return
        news = News(text=article.maintext, 
                    url=article.url,
                    image=article.image_url,
                    date_publish=article.date_publish,
                    source_domain=article.source_domain)
        news.save()
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
    with Pool(processes=PROC_COUNT) as pool:
        articles = pool.map(_article, links)
        articles = [article for article in articles if article is not None and article.maintext is not None]
    return articles