from json.decoder import JSONDecodeError
from .serializers import LinkScrapeSerializer, PredictionInputSerializer
from django.http import JsonResponse
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


PAGES_LOOKUP = 3
REQUEST_WAIT_TIME = 0.5
loggger = logging.getLogger('app_api')
TIMEOUT = 5 * 60 

@api_view(['GET', 'POST'])
def predict(request):
    input_ser = PredictionInputSerializer(data=request.data)
    if not input_ser.is_valid():
        return JsonResponse({'error': 'Missing Parameters'}, status=status.HTTP_400_BAD_REQUEST)
    proba = random.random()
    result = {'prediction': proba > 0.5, 'proba': proba}
    loggger.debug(result)
    return JsonResponse(result)

@api_view(['GET', 'POST'])
def feed(request):
    today = datetime.datetime.now()
    yesterday = today - datetime.timedelta(days=1)
    return_feed = []
    for page in range(1, PAGES_LOOKUP+1):
        r = requests.get(f"https://newsapi.org/v2/everything?sources=cnn,fox-news,axios\
                            &from={yesterday.isoformat()}&to={today.isoformat}&\
                            language=en&page={page}&apiKey={os.environ['NEWS_API_KEY']}")
        news_feed = r.json()
        if not r.ok or news_feed["status"] != 'ok':
            return JsonResponse({'error': 'External Service Error'})
        __build_return_feed(news_feed, return_feed)
        time.sleep(REQUEST_WAIT_TIME)
    return JsonResponse({"count": len(return_feed), "feed": return_feed})

def __build_return_feed(news_feed, return_feed):
    for articles in news_feed['articles']:
        #dummy prediction
        proba = random.random()
        return_feed.append(
            {
                "text": articles["content"] if articles["content"] is not None else articles["title"],
                "url": articles["url"],
                'prediction': proba > 0.5, 
                'proba': proba
            }
        )

@api_view(['GET', 'POST'])
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

