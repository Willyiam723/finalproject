from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post_user')
    content = models.CharField(max_length=6400)
    date_time = models.DateTimeField()
    like = models.ManyToManyField(User, blank=True, related_name='liking')
    # trade = models.ForeignKey(Trade, on_delete=models.CASCADE, related_name='trade_post')

    def serialize(self,user,trade):
        return {
            "id": self.id,
            "userid": self.user.id,
            "username": self.user.username,
            "content": self.content,
            "date_time": self.date_time,
            "num_like": self.like.count(),
            # "tradeid": self.trade.id,
            "already_like": not user.is_anonymous and self in user.liking.all(),
            "eligible_like": not user.is_anonymous
        }

    def __str__(self):
        return f"{self.user} posted {self.content} on {self.date_time} with {self.like.count()} likes"

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
    hqla = models.FloatField(default=2000)
    la = models.FloatField(default=7000)
    ila = models.FloatField(default=14000)
    cash_outflow = models.FloatField(default=6000)

    def serialize(self):
        return {
            "hqla": self.hqla,
            "la": self.la,
            "ila": self.ila,
            "cash_outflow": self.cash_outflow,
            "surplus": self.hqla.sum() + self.la.sum() + self.cash_outflow.sum()
        }

class Leverage(models.Model):
    secured_debt = models.FloatField(default=1000)
    unsecured_debt = models.FloatField(default=2000)
    synthetics = models.FloatField(default=3900)

    def serialize(self):
        return {
            "secured_debt": self.secured_debt,
            "unsecured_debt": self.unsecured_debt,
            "synthetics": self.synthetics,
            "leverage": self.secured_debt.sum() + self.unsecured_debt.sum() + self.synthetics.sum()
        }

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

    def serialize(self,user,post):
        return {
            "tradeid": self.id,
            "userid": self.user.id,
            "username": self.user.username,
            "transaction": self.transaction,
            "security": self.security,
            "amount": self.amount,
        }