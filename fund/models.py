from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Trade(models.Model):
    CODE = (
        ("Buy", "Buy"),
        ("Sell", "Sell")
    )
    CLASSIFICATION = (
        ("HQLA", "HQLA"),
        ("LA", "LA"),
        ("ILA", "ILA"),
        ("Secured Debt", "Secured Debt"),
        ("Unsecured Debt", "Unsecured Debt"),
        ("Synthetics", "Synthetics")
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trade_user')
    transaction = models.CharField(max_length=50, choices=CODE)
    security = models.CharField(max_length=50, choices=CLASSIFICATION)
    amount = models.FloatField()

    def serialize(self, user):
        return {
            "tradeid": self.id,
            "userid": self.user.id,
            "transaction": self.transaction,
            "security": self.security,
            "amount": self.amount
        }

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post_user')
    content = models.CharField(max_length=6400)
    date_time = models.DateTimeField()
    like = models.ManyToManyField(User, blank=True, related_name='liking')
    trade = models.ManyToManyField(Trade, blank=True, related_name='trade_post')
    publish = models.BooleanField(default=False)

    def serialize(self,user,trade):
        return {
            "id": self.id,
            "userid": self.user.id,
            "username": self.user.username,
            "content": self.content,
            "date_time": self.date_time,
            "num_like": self.like.count(),
            "num_trade": self.trade.count(),
            # "trade_transaction": self.trade.transaction,
            # "trade_security": self.trade.security,
            # "trade_amount": self.trade.amount,
            "already_like": not user.is_anonymous and self in user.liking.all(),
            "eligible_like": not user.is_anonymous,
            "publish": self.publish
        }
    
    def trades_id_list(self):
        trades_str = ""
        for trade in self.trade.all():
            trades_str+=" "+ str(trade.id)
        return f"{trades_str},"

    def __str__(self):
        trades_str = ""
        for trade in self.trade.all():
            trades_str+=" "+ str(trade.id)
        return f"{self.user} posted {self.content} on {self.date_time} had trade ids: {trades_str}, with {self.like.count()} likes"

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follow_user')
    follower = models.ManyToManyField(User, blank=True, related_name='following')

    def serialize(self,user):
        return {
            "profile_id": self.user.id,
            "profile_username": self.user.username,
            "following": self.user.following.count(),
            "followers": self.follower.count(),
            "already_following": not user.is_anonymous and self in user.following.all(),
            "eligible_following": not user.is_anonymous and self.user != user
        }

    def __str__(self):
        follower_str = ""
        for follower in self.follower.all():
            follower_str+=" "+ str(follower)
        return f"total follower for {self.user.username}: {self.follower.count()} - {follower_str} is following {self.user.username}"

class Liquidity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liquidity_user')
    hqla = models.FloatField(default=2000)
    la = models.FloatField(default=7000)
    ila = models.FloatField(default=14000)
    cash_outflow = models.FloatField(default=6000)

    def serialize(self, user):
        return {
            "hqla": self.hqla,
            "la": self.la,
            "ila": self.ila,
            "cash_outflow": self.cash_outflow,
            "surplus": self.hqla + self.la - self.cash_outflow
        }

class Leverage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leverage_user')
    secured_debt = models.FloatField(default=1000)
    unsecured_debt = models.FloatField(default=2000)
    synthetics = models.FloatField(default=3900)

    def serialize(self, user):
        return {
            "secured_debt": self.secured_debt,
            "unsecured_debt": self.unsecured_debt,
            "synthetics": self.synthetics,
            "leverage": self.secured_debt + self.unsecured_debt + self.synthetics
        }

class CSV(models.Model):
    file_name = models.FileField(upload_to='csvs')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.file_name)
    