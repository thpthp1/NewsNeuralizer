# Generated by Django 3.1.7 on 2021-05-12 14:59

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('text', models.TextField()),
                ('title', models.TextField(default='')),
                ('url', models.URLField(unique=True)),
                ('image', models.URLField(null=True)),
                ('date_publish', models.DateTimeField(null=True)),
                ('source_domain', models.CharField(max_length=50)),
            ],
        ),
    ]
