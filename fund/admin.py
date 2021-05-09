from django.contrib import admin
from .models import User, Post, Liquidity, Leverage, Trade, CSV

# Register your models here.
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Liquidity)
admin.site.register(Leverage)
admin.site.register(Trade)
admin.site.register(CSV)