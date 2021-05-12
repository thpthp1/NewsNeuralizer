from unittest import result
from django.contrib.auth.models import AnonymousUser, User
from django.test import RequestFactory, TestCase
import json

from newsplease import NewsPlease, NewsArticle
from typing import List, Set

from api.core.news_scrape import news_feed, FEED_JSON

class ScraperTest(TestCase):

    def setUp(self) -> None:
        self.feed_json = FEED_JSON
        self.sources_count = len([source["id"] for source in self.feed_json["sources"]])
        return super().setUp()

    def _get_article_key(self, articles: List[NewsArticle.NewsArticle], id: str) -> Set[str]:
        return set([article.__dict__[id] for article in articles])
    
    def test_scrape_sources(self) -> None:
        articles = news_feed()
        sources = self._get_article_key(articles, "source_domain")
        self.assertEqual(len(sources), self.sources_count)
