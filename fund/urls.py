
from django.urls import path

from . import views

urlpatterns = [
    path("shared", views.shared, name="shared"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("create_post", views.create_post, name="create_post"),
    path("posts/<int:filter>/<int:page>", views.load_posts, name="load_posts"),
    path("follow", views.follow_unfollow, name="follow"),
    path("profile/<int:userid>", views.load_profile, name="load_profile"),
    path("following_posts/<int:page>", views.load_following_posts, name="load_following_posts"),
    path("like", views.like_unlike, name="like"),
    path("main", views.main_page, name="main_page"),
    path("", views.scenarios, name="scenarios"),
    path("saved", views.saved, name="saved"),
    path("charts/", views.charts, name="charts"),
    path("remove/<int:trade_id>", views.remove, name="remove"),
    path("remove_all/", views.remove_all, name="remove_all")
]
