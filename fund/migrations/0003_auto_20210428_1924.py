# Generated by Django 3.1.6 on 2021-04-28 23:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fund', '0002_leverage_liquidity_trade'),
    ]

    operations = [
        migrations.AlterField(
            model_name='leverage',
            name='secured_debt',
            field=models.FloatField(default=1000),
        ),
        migrations.AlterField(
            model_name='leverage',
            name='synthetics',
            field=models.FloatField(default=3900),
        ),
        migrations.AlterField(
            model_name='leverage',
            name='unsecured_debt',
            field=models.FloatField(default=2000),
        ),
        migrations.AlterField(
            model_name='liquidity',
            name='cash_outflow',
            field=models.FloatField(default=6000),
        ),
        migrations.AlterField(
            model_name='liquidity',
            name='hqla',
            field=models.FloatField(default=2000),
        ),
        migrations.AlterField(
            model_name='liquidity',
            name='ila',
            field=models.FloatField(default=14000),
        ),
        migrations.AlterField(
            model_name='liquidity',
            name='la',
            field=models.FloatField(default=7000),
        ),
    ]
