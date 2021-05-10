from json.decoder import JSONDecodeError
from .serializers import LinkScrapeSerializer, PredictionInputSerializer
from django.http import JsonResponse
from typing import List
from django.shortcuts import render
import random
import json
import requests
import os
import datetime
import time
import logging
import newsplease
from rest_framework import status
from rest_framework.decorators import api_view
from multiprocessing import Pool

from .core.news_scrape import PROC_COUNT, news_feed
from .core.news_predict import news_predict
from .core.ml.classifier import predict
from newsplease import NewsArticle
from .tasks import update_news

PAGES_LOOKUP = 3
REQUEST_WAIT_TIME = 0.5
loggger = logging.getLogger('django')
TIMEOUT = 5 * 60 
PROC_COUNT = 3


@api_view(['POST'])
def predict_text(request):
    input_ser = PredictionInputSerializer(data=request.data)
    if not input_ser.is_valid():
        return JsonResponse({'error': 'Missing Parameters'}, status=status.HTTP_400_BAD_REQUEST)
    labels, confs = predict([input_ser.validated_data["title"] + " " + input_ser.validated_data["selftext"]])
    result = {'prediction': "Fake" if labels[0] == 0 else "True", 'proba': confs[0]}
    loggger.info(f"Prediction: {result}")
    return JsonResponse(result)

@api_view(['GET'])
def feed(request):
    articles = news_feed()
    return_feed = _return_feed(articles)
    return JsonResponse({"count": len(return_feed), "feed": return_feed})


def _return_feed(news_feed: List[NewsArticle.NewsArticle]):
    return_feed = []
    labels, confs = predict([article.title + " " + article.maintext for article in news_feed])
    for article, label, conf in zip(news_feed, labels, confs):
        return_feed.append(
            {
                "title": article.title,
                "text": article.maintext,
                "url": article.url,
                "image": article.image_url,
                "date_publish": article.date_publish,
                "source_domain": article.source_domain,
                'prediction': "Fake" if label == 0 else "True",
                'proba': conf
            })
    return return_feed

@api_view(['POST'])
def link_info(request):
    link_ser = LinkScrapeSerializer(data=request.data)
    if not link_ser.is_valid():
        return JsonResponse({'error': 'Invalid URL input'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        body = link_ser.validated_data
        article = newsplease.NewsPlease.from_url(url=body['link'], timeout=TIMEOUT)
        return JsonResponse(
            {
                "title": article.title,
                "body": article.maintext
            })
    except Exception:
        return JsonResponse({'error': 'Timeout'}, status=status.HTTP_504_GATEWAY_TIMEOUT)

