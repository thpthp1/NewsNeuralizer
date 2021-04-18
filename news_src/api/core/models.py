from django.db import models
from django.db.models.fields import BooleanField, CharField, DateTimeField, FloatField, IntegerField, TextField, TimeField, URLField

class News(models.Model):
    id = IntegerField(primary_key=True)
    text = TextField()
    title = TextField(default="")
    url = URLField(unique=True)
    image = URLField(null=True)
    date_publish = DateTimeField(null=True)
    source_domain = CharField(max_length=50)