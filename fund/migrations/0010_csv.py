# Generated by Django 3.1.6 on 2021-05-08 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fund', '0009_auto_20210503_1932'),
    ]

    operations = [
        migrations.CreateModel(
            name='CSV',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_name', models.FileField(upload_to='csvs')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
