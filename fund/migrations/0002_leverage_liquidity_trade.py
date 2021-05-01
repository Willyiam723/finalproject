# Generated by Django 3.1.6 on 2021-04-28 22:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('fund', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Leverage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('secured_debt', models.FloatField()),
                ('unsecured_debt', models.FloatField()),
                ('synthetics', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Liquidity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hqla', models.FloatField()),
                ('la', models.FloatField()),
                ('ila', models.FloatField()),
                ('cash_outflow', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Trade',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transaction', models.CharField(choices=[('Buy', 'Buy'), ('Sell', 'Sell')], max_length=50)),
                ('security', models.CharField(max_length=50)),
                ('amount', models.FloatField()),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trade_post', to='fund.post')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trade_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
