from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import random
import json


def predict(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    if 'title' not in body or 'selftext' not in body:
        return JsonResponse({'error': 'Missing Parameters'})
    proba = random.random()
    result = {'prediction': proba > 0.5, 'proba': proba}
    return JsonResponse(result)