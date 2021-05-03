from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import JsonResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.paginator import Paginator
import json, datetime
from django.forms import inlineformset_factory
from django.db.models import Sum, Case, When


from .models import User, Post, Profile, Liquidity, Leverage, Trade

assets = ['HQLA', 'LA', 'ILA']
debts = ['Secured Debt', 'Unsecured Debt', 'Synthetics']

def main_page(request):
    return render(request, "fund/main_page.html")

def scenarios(request):
    # Check if additional trade form is asked
    add_trade_form = request.GET.get("add")
    if add_trade_form is None:
        TradeFormSet = inlineformset_factory(User, Trade, fields=("transaction", "security", "amount"), max_num=2)
    else:
        TradeFormSet = inlineformset_factory(User, Trade, fields=("transaction", "security", "amount"), extra=int(add_trade_form)+1)
    userid = request.user.id
    if userid:
        user = User.objects.get(id=userid)
        extrade = Trade.objects.filter(user=user)
    else:
        extrade = []
    formset_empty = TradeFormSet()

    # Return message if request is sent via "POST" for creating a new trade
    if request.method == "POST":
        # Create the trade
        formset = TradeFormSet(request.POST, instance=user)
        print(formset)
        if formset.is_valid():
            formset.save()
        return redirect("scenarios")
        # return render(request, "fund/scenarios.html", {
        #     "formset_empty":formset_empty,
        #     "extrade":extrade
        #     })
    
    else:
        return render(request, "fund/scenarios.html", {
            "formset_empty":formset_empty,
            "extrade":extrade
            })
    # return render(request, "fund/scenarios.html")

def remove(request, trade_id):
    TradeFormSet = inlineformset_factory(User, Trade, fields=("transaction", "security", "amount"), max_num=2)
    userid = request.user.id
    if userid:
        user = User.objects.get(id=userid)
        extrade = Trade.objects.filter(user=user)
    else:
        extrade = []
    formset_empty = TradeFormSet()

    print(request)
    print(trade_id)
    user = User.objects.get(id=request.user.id)

    # Get trade information
    trade_remove = Trade.objects.get(id=trade_id)
    print(trade_remove)

    trade_remove.delete()
    
    return redirect("scenarios")

def remove_all(request):
    TradeFormSet = inlineformset_factory(User, Trade, fields=("transaction", "security", "amount"), max_num=2)
    userid = request.user.id
    if userid:
        user = User.objects.get(id=userid)
        extrade = Trade.objects.filter(user=user)
    else:
        extrade = []
    formset_empty = TradeFormSet()

    print(request)
    user = User.objects.get(id=request.user.id)

    # Get trade information
    trade_remove = Trade.objects.filter(user=user).all()
    print(trade_remove)

    trade_remove.delete()
    
    return redirect("scenarios")

def saved(request):
    return render(request, "fund/saved.html")

def shared(request):
    return render(request, "fund/shared.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("scenarios"))
        else:
            return render(request, "fund/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "fund/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "fund/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "fund/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        liquidity = Liquidity.objects.create(user=user)
        leverage = Leverage.objects.create(user=user)
        liquidity.save()
        leverage.save()
        return HttpResponseRedirect(reverse("scenarios"))
    else:
        return render(request, "fund/register.html")

# Function to create or update a post
@login_required
def create_post(request):

    # Return message if request is sent via "POST" for creating a new post
    if request.method == "POST":
        # Create the post
        data = json.loads(request.body)
        content = data.get("content", "")
        date_time = timezone.now()
        user = request.user.id
        post = Post(
            content=content,
            date_time=date_time,
            user_id=user
        )
        post.save()
        return JsonResponse({"message": "Post published successfully."})
    # Return true if request is sent via "PUT" for updating an existing post
    elif request.method == "PUT":
        # Update the post
        data = json.loads(request.body)
        post_id = int(data["id"])
        content = data["content"]
        post = Post.objects.get(id=post_id)
        
        # Enable back-end double check to ensure user is editing his/her own post
        if post.user_id != request.user.id:
            return HttpResponse(status = 401)
        post.content = content
        post.save()
        return JsonResponse({"result": True}, status = 200)
    else:
        return JsonResponse({"error": "POST or PUT requests required."}, status = 400)

# Function to load all posts
def load_posts(request, filter, page):

    filter = int(filter)
    # Get all post information
    if filter == 0:
        posts = Post.objects.all()
    else:
        posts = Post.objects.filter(user_id=filter)

    # Return posts in reverse chronologial order in terms of time posted
    posts = posts.order_by("-date_time").all()

    return paginator(request, posts, page)

# Function to load following posts
def load_following_posts(request, page):

    following_user = User.objects.filter(id__in=request.user.following.all()).all()
    # Get post information
    posts = Post.objects.filter(user__in=following_user).all()

    # Return posts in reverse chronologial order in terms of time posted
    posts = posts.order_by("-date_time").all()

    return paginator(request, posts, page)

# Function to paginate posts
def paginator(request, posts, page):
    # Show 10 posts per page
    paginator = Paginator(posts, 10)

    # Get current page number
    page_number = page
    page_obj = paginator.get_page(page_number)

    # Return post information
    return JsonResponse({
        "posts": [post.serialize(request.user) for post in page_obj],
        "num_pages": paginator.num_pages
        }
        ,safe=False)

# Function to load profile page
def load_profile(request, userid):

    # Get all profile information
    try:
        profile = Profile.objects.get(pk=userid)
    except:
        user = User.objects.get(pk=userid)
        profile = Profile.objects.create(user=user)

    # Return profile information
    return JsonResponse(profile.serialize(request.user))

# Function to allow signed-in users to follow or unfollow another user 
# If the user is already followed, the function will unfollow the user
@login_required
def follow_unfollow(request):
    # Follow or unfollow must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Get relevant data
    data = json.loads(request.body)
    follow_id = data.get("follow_id", "")
    user_id = request.user.id

    # Get profile and user information
    profile = Profile.objects.get(id=follow_id)
    user = User.objects.get(id=user_id)

    # Follow the profile if not yet following, or unfollow the profile if already following
    if profile in user.following.all():
        profile.follower.remove(user)
        print(f"{user} is already following {profile.user.username} therefore unfollowed")
    else:
        profile.follower.add(user)
        print(f"{user} is not yet following {profile.user.username} but now added")

    # Return profile information
    return JsonResponse(profile.serialize(request.user))
   
# Function to allow signed-in users to like or unlike a post
# If the already liked a post, the function will unlike the post
@login_required
def like_unlike(request):
    # Like or unlike must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Get relevant information
    data = json.loads(request.body)
    post_id = data["post_id"]
    user_id = request.user.id

    # Get post and user information
    post = Post.objects.get(id=post_id)
    user = User.objects.get(id=user_id)
    
    # Like the post if not yet liked, or unlike the post if already liking
    if post in user.liking.all():
        post.like.remove(user)
        print(f"{user} is already liking {post.user.username} therefore unliked")
    else:
        post.like.add(user)
        print(f"{user} is not yet liking {post.user.username} but now liked")

    # Return post information
    return JsonResponse(post.serialize(request.user))

# Function to create or update a trade set
@login_required
def create_trade(request):
    TradeFormSet = inlineformset_factory(User, Trade, fields=("transaction", "security", "amount"))
    userid = request.user.id
    user = User.objects.get(id=userid)
    formset = TradeFormSet(instance=user)

    # Return message if request is sent via "POST" for creating a new post
    if request.method == "POST":
        # Create the post
        formset = TradeFormSet(request.POST, instance=user)
        formset.save()
        return render(request, "fund/scenarios.html")
    # Return true if request is sent via "PUT" for updating an existing post
    # elif request.method == "PUT":
    #     # Update the post
    #     data = json.loads(request.body)
    #     post_id = int(data["id"])
    #     content = data["content"]
    #     post = Post.objects.get(id=post_id)
        
    #     # Enable back-end double check to ensure user is editing his/her own post
    #     if post.user_id != request.user.id:
    #         return HttpResponse(status = 401)
    #     post.content = content
    #     post.save()
    #     return JsonResponse({"result": True}, status = 200)
    else:
        return render(request, "fund/scenarios.html", {
            "formset":formset
            })

# Function to load chart 1 info
def charts(request):

    user = User.objects.get(id=request.user.id)
    # Get liquidity information
    liquidity = Liquidity.objects.get(user=user)

    # Get leverage information
    leverage = Leverage.objects.get(user=user)

    # Get trade information
    trade = Trade.objects.filter(user=user).all()
    # result = trade.annotate(
    #     amount=Case(
    #         When(transaction='Buy', then=("amount")),
    #         When(transaction='Sell', then=-("amount"))
    #     ),
    # ).values_list('transaction','security','amount')

    # Flag correct signs for asset and leverage items
    trade = trade.values('security','transaction').order_by('security','transaction').annotate(amount=Sum('amount'))

    for result in trade:
        if result['security'] in assets:
            if result['transaction'] == 'Buy':
                result['amount'] = result['amount'] * 1
            elif result['transaction'] == 'Sell':
                result['amount'] = result['amount'] * -1
        elif result['security'] in debts:
            if result['transaction'] == 'Buy':
                result['amount'] = result['amount'] * -1
            elif result['transaction'] == 'Sell':
                result['amount'] = result['amount'] * 1

    # Return all info in JSON
    return JsonResponse({
        "liquidity": liquidity.serialize(request.user),
        "leverage": leverage.serialize(request.user),
        # "posts": [post.serialize(request.user) for post in page_obj]
        "trades": [trade for trade in trade]
        }
        ,safe=False)