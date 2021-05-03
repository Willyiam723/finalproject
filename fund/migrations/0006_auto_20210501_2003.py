# Generated by Django 3.1.6 on 2021-05-02 00:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('fund', '0005_remove_trade_post'),
    ]

    operations = [
        migrations.AddField(
            model_name='leverage',
            name='user',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, related_name='leverage_user', to='fund.user'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='liquidity',
            name='user',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, related_name='liquidity_user', to='fund.user'),
            preserve_default=False,
        ),
    ]
