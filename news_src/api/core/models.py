from django.db import models
from django.db.models.fields import BooleanField, CharField, FloatField, IntegerField, TextField, TimeField, URLField

class News(models.Model):
    id = IntegerField(primary_key=True)
    text = TextField()
    url = URLField(unique=True)
    image = URLField()
    date_publish = TimeField()
    source_domain = CharField(max_length=50)