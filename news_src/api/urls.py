from django.urls import path
from . import views

urlpatterns = [
    path('predict', views.predict),
    path('news-feed', views.feed),
    path('link-info', views.link_info)
]