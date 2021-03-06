
from django.urls import path

from . import views

urlpatterns = [
    # API Routes
    path("shared", views.shared, name="shared"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create_post", views.create_post, name="create_post"),
    path("posts/<int:page>", views.load_posts, name="load_posts"),
    path("posts_published/<int:page>", views.load_posts_published, name="load_posts_published"),
    path("like", views.like_unlike, name="like"),
    path("main", views.main_page, name="main_page"),
    path("", views.scenarios, name="scenarios"),
    path("upload/", views.csv_upload_view, name="upload"),
    path("saved", views.saved, name="saved"),
    path("charts/<int:postid>", views.charts_post, name="charts_post"),
    path("charts/", views.charts, name="charts"),
    path("remove/<int:trade_id>", views.remove, name="remove"),
    path("remove_all/", views.remove_all, name="remove_all"),
    path("remove_from_post/<int:post_id>/<int:trade_id>", views.remove_from_post, name="remove_from_post"),
    path("clear_all_from_post/<int:post_id>", views.clear_all_from_post, name="clear_all_from_post")
]
