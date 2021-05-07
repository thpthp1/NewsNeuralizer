from workers import task
from .core.news_scrape import news_feed
from datetime import datetime
import timeit

HOURLY = 60 * 60
@task(schedule=HOURLY)
def update_news():
    print(f"Running scraper at: {datetime.now().isoformat()}")
    feed = news_feed()
    print(f"Finish running feed at {datetime.now().isoformat()}")
    print(f"Scraped: {len(feed)} articles")