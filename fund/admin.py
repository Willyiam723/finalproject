from django.contrib import admin
from .models import User, Post, Profile, Liquidity, Leverage, Trade

# Register your models here.
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Profile)
admin.site.register(Liquidity)
admin.site.register(Leverage)
admin.site.register(Trade)