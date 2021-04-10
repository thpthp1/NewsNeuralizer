from rest_framework import serializers

class PredictionInputSerializer(serializers.Serializer):
    title = serializers.CharField(required=True)
    selftext = serializers.CharField(required=True)

class LinkScrapeSerializer(serializers.Serializer):
    link = serializers.URLField(required=True)