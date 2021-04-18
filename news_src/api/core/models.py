from django.db import models
from django.db.models.fields import BooleanField, CharField, DateTimeCheckMixin, DateTimeField, FloatField, IntegerField, TextField, TimeField, URLField

class News(models.Model):
    id = IntegerField(primary_key=True)
    text = TextField()
    url = URLField(unique=True)
    image = URLField()
    date_publish = DateTimeField()
    source_domain = CharField(max_length=50)