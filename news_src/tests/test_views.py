from django.contrib.auth.models import AnonymousUser, User
from django.test import RequestFactory, TestCase
import json

from api.views import predict_text, link_info, feed

class ViewTest(TestCase):

    def setUp(self) -> None:
        self.factory = RequestFactory()
        return super().setUp()
    
    def test_predict(self) -> None:
        request = self.factory.post('/api/predict', data={
            "title": "Cool",
            "selftext": "World",
            "extra_data": "None"
        })
        response = predict_text(request)
        data = json.loads(response.content)
        self.assertTrue(0 <= data["proba"] <= 1)
        self.assertEqual(response.status_code, 200)
    
    def test_predict_missing_title(self) -> None:
        request = self.factory.post('/api/predict', data={
            "t": "Cool",
            "selftext": "World"
        })
        response = predict_text(request)
        self.assertEqual(response.status_code, 400)
    
    def test_predict_missing_selftext(self) -> None:
        request = self.factory.post('/api/predict', data={
            "title": "Cool",
            "s": "World"
        })
        response = predict_text(request)
        self.assertEqual(response.status_code, 400)

    def test_feed(self) -> None:
        request = self.factory.get('/api/news-feed')
        response = feed(request)
        data = json.loads(response.content)
        self.assertGreater(data["count"], 0)
        self.assertTrue("feed" in data)
        self.assertEqual(response.status_code, 200)

    def test_link_info(self) -> None:
        request = self.factory.post('/api/link-info', data={
            "link": "https://www.cnn.com/2021/03/05/us/pennsylvania-town-surprises-ups-driver-trnd/index.html"
        })
        response = link_info(request)
        data = json.loads(response.content)
        self.assertTrue("title" in data)
        self.assertTrue("body" in data)
        self.assertEqual(response.status_code, 200)
    
    def test_link_info_bad_url(self) -> None:
        request = self.factory.post('/api/link-info', data={
            "link": "not a url"
        })
        response = link_info(request)
        data = json.loads(response.content)
        self.assertEqual(data["error"], 'Invalid URL input')
        self.assertEqual(response.status_code, 400)

    def test_link_info_bad_json(self) -> None:
        request = self.factory.post('/api/link-info', data={
            "wrong-link": "https://www.cnn.com/2021/03/05/us/pennsylvania-town-surprises-ups-driver-trnd/index.html"
        })
        response = link_info(request)
        data = json.loads(response.content)
        self.assertEqual(data["error"], 'Invalid URL input')
        self.assertEqual(response.status_code, 400)