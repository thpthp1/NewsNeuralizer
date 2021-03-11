from json.decoder import JSONDecodeError
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import random
import json
import requests
import os
import datetime
import time
import logging
import newsplease

PAGES_LOOKUP = 3
REQUEST_WAIT_TIME = 0.5
loggger = logging.getLogger('app_api')
TIMEOUT = 5 * 60 

def predict(request):
    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        if 'title' not in body or 'selftext' not in body:
            return JsonResponse({'error': 'Missing Parameters'})
    except JSONDecodeError as e:
        return JsonResponse({'error': 'Parse body failure', 'msg': e.msg})
    proba = random.random()
    result = {'prediction': proba > 0.5, 'proba': proba}
    loggger.debug(result)
    return JsonResponse(result)

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

def link_info(request):
    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        if 'link' not in body:
            return JsonResponse({'error': 'Missing Parameters'})
    except JSONDecodeError as e:
        return JsonResponse({'error': 'Parse body failure', 'msg': e.msg})
    try:
        article = newsplease.NewsPlease.from_url(url=body['link'], timeout=TIMEOUT)
        return JsonResponse(
            {
                "title": article.title,
                "body": article.maintext
            })
    except Exception:
        return JsonResponse({'error': 'Timeout'})

