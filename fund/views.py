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
import csv
from .models import User, Post, Liquidity, Leverage, Trade, CSV

# Ensure assets and debts are available for functions to have access
assets = ['HQLA', 'LA', 'ILA']
debts = ['Secured Debt', 'Unsecured Debt', 'Synthetics']

def main_page(request):
    return render(request, "fund/main_page.html")

# Render information for senarios view
def scenarios(request):
    # Check if additional trade form slot is asked
    add_trade_form = request.GET.get("add")
    # Check if requesting for a specific post
    postid = request.GET.get("postid")
    # Add trade form slot if asked
    if add_trade_form is None:
        TradeFormSet = inlineformset_factory(User, Trade, fields=("transaction", "security", "amount"), can_delete = False, max_num=2)
    else:
        TradeFormSet = inlineformset_factory(User, Trade, fields=("transaction", "security", "amount"), can_delete = False, extra=int(add_trade_form)+1)
    # Get user information
    userid = request.user.id
    if userid:
        user = User.objects.get(id=userid)
        # Get post information
        if postid:
            post = Post.objects.get(id=postid)
            if post.publish == True:
                post.publish = "Unpublish"
            elif post.publish == False:
                post.publish = "Publish"
            # Label save scenario button when user is the creator of the post
            if post.user == user:
                save_post = "Save Scenario Description"
            else:
                save_post = "Save as New Secenario"
            # Get all trades from the post
            extrade = post.trade.all()
        # Otherwise get all trades created by the user
        else:
            extrade = Trade.objects.filter(user=user)
    else:
        extrade = []
    # Get new trade form for user to input
    formset_empty = TradeFormSet()
    if (postid is None) or (userid is None):
        post = []
        save_post = "Save Scenario"

    # Return if request is sent via "POST" for creating a new trade from entering trade formset
    if request.method == "POST":
        # Create the trade
        formset = TradeFormSet(request.POST, instance=user)
        if formset.is_valid():
            formset.save()
            # Add trades created to the post
            trades = Trade.objects.filter(user=user)
            # Track the trades just created
            trades = trades.order_by("-id")[:int(request.POST['trade_user-TOTAL_FORMS'])]
            if postid:
                for trade in trades:
                    post.trade.add(trade)
                return redirect('/?postid={}'.format(postid))
        return redirect("scenarios")

    # Return information for senarios view
    else:
        return render(request, "fund/scenarios.html", {
            "formset_empty":formset_empty,
            "extrade":extrade,
            "post":post,
            "save_post": save_post
            })

# Load csv dropzone file into database
def csv_upload_view(request):
    print('file is being sent')

    if request.method == 'POST':
        csv_file = request.FILES.get('file')
        # Create CSV object
        sample = CSV.objects.create(file_name=csv_file)
        postid = request.POST.get("postid")
        userid = request.user.id
        user = User.objects.get(id=userid)
        # Ensure only creator of the post can add trades to the post, ask user to save as a scenario to add trades
        if postid:
            post = Post.objects.get(id=postid)
            if post.user != user:
                return JsonResponse({"message": "Failed! You are not the creator of this scenario. Please save as a new scenario before submitting trades.", "flag": False})

        with open(sample.file_name.path, 'r') as f:
            trades = csv.reader(f)
            trades.__next__()
            cum_amount = 0
            # Form control check to ensure buy amount and sell amount nets off
            for trade in trades:
                if trade[0] == "Buy":
                    cum_amount += float(trade[2])
                elif trade[0] == "Sell":
                    cum_amount -= float(trade[2])
            if round(cum_amount,0) != 0:
                return JsonResponse({"message": "Failed! Please ensure buy and sell amount nets off.", "flag": False})
            else:
                with open(sample.file_name.path, 'r') as f:
                    trades = csv.reader(f)
                    trades.__next__()
                    # Creat and add trades to post if user is editing a post
                    if postid:
                        post = Post.objects.get(id=postid)
                        for trade in trades:
                            trade_entry = Trade.objects.create(user=user,transaction=trade[0],security=trade[1],amount=trade[2])
                            trade_entry.save
                            post.trade.add(trade_entry)
                        return JsonResponse({"message": "Trades uploaded successfully.", "flag": True})
                    # Just create trades if user is not editing a post
                    elif postid == "":
                        for trade in trades:
                            trade_entry = Trade.objects.create(user=user,transaction=trade[0],security=trade[1],amount=trade[2])
                            trade_entry.save
                        return JsonResponse({"message": "Trades uploaded successfully.", "flag": True})
                    else:
                        return JsonResponse({"message": "Failed! Please ensure required fields are entered in csv file correctly", "flag": False})
    return JsonResponse({"message": "POST request required.", "flag": False}, status = 400)

# Function to delete a single trade from database
def remove(request, trade_id):
    TradeFormSet = inlineformset_factory(User, Trade, fields=("transaction", "security", "amount"), max_num=2)
    userid = request.user.id
    if userid:
        user = User.objects.get(id=userid)
        extrade = Trade.objects.filter(user=user)
    else:
        extrade = []
    formset_empty = TradeFormSet()
    user = User.objects.get(id=request.user.id)

    # Get trade information
    trade_remove = Trade.objects.get(id=trade_id)
    trade_remove.delete()
    
    return redirect("scenarios")

# Function to delete all trades created by the user
def remove_all(request):
    TradeFormSet = inlineformset_factory(User, Trade, fields=("transaction", "security", "amount"), max_num=2)
    userid = request.user.id
    if userid:
        user = User.objects.get(id=userid)
        extrade = Trade.objects.filter(user=user).all()
    else:
        extrade = []
    formset_empty = TradeFormSet()
    user = User.objects.get(id=request.user.id)

    # Get trade information
    trade_remove = Trade.objects.filter(user=user).all()
    trade_remove.delete()
    
    return redirect("scenarios")

# Function to delete a single trade from an existing post
def remove_from_post(request, post_id, trade_id):

    # Get post and trade information
    post = Post.objects.get(id=post_id)
    trade = Trade.objects.get(id=trade_id)
    
    # remove the trade from post
    post.trade.remove(trade)

    return redirect('/?postid={}'.format(post_id))

# Function to delete all trades from an existing post
def clear_all_from_post(request, post_id):
    
    # Get post information
    post = Post.objects.get(id=post_id)
    trades = Trade.objects.all()
    
    # remove the trade from post
    for trade in trades:
        post.trade.remove(trade)
    
    return redirect('/?postid={}'.format(post_id))

# Render saved view
def saved(request):
    return render(request, "fund/saved.html")

# Render shared view
def shared(request):
    return render(request, "fund/shared.html")

# Render login view
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

# Render logout view
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))

# Render registration view
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
        trade_ids = data.get("trade_ids", "")
        content = data.get("content", "")
        date_time = timezone.now()
        user = request.user.id
        post = Post(
            content=content,
            date_time=date_time,
            user_id=user
        )
        post.save()

        # Add trades
        for trade_id in trade_ids:
            trade = Trade.objects.get(id=trade_id)
            post.trade.add(trade)

        return JsonResponse({"message": "Post published successfully.", "post": post.serialize(request.user, trade)})

    # Return if request is sent via "PUT" for updating an existing post
    elif request.method == "PUT":
        # Update the post
        data = json.loads(request.body)
        post_id = int(data["post_id"])
        publish_post = data["publish_post"]
        content = data["scenario_content"]
        post = Post.objects.get(id=post_id)
        
        # Enable back-end check to ensure user is updating his/her own scenario post
        if post.user_id != request.user.id:
            return HttpResponse(status = 401)
        if publish_post != "":
            # Update publish status
            if (publish_post == "Publish") & (post.publish == False):
                post.publish = True
            elif (publish_post == "Unpublish") & (post.publish == True):
                post.publish = False
            else:
                return JsonResponse({"error": "Database not synchronized with web display."}, status = 400)

            # Save post and render updated publishing status
            post.save()
            if publish_post == "Publish":
                publish_post = "Unpublish"
            else:
                publish_post = "Publish"
            return JsonResponse({"message": "Post updated successfully.", "publish_post": publish_post})
        else:
            # Update existing post content and date_time
            post.content = content
            post.date_time = timezone.now()
            post.save()
            return JsonResponse({"message": "Post updated successfully."})
    else:
        return JsonResponse({"error": "POST or PUT requests required."}, status = 400)

# Function to load posts belong to the user
def load_posts(request, page):

    posts = Post.objects.filter(user_id=request.user.id)

    # Return posts in reverse chronologial order in terms of time posted
    posts = posts.order_by("-date_time").all()

    return paginator(request, posts, page)

# Function to load published posts
def load_posts_published(request, page):

    posts = Post.objects.filter(publish=True)

    # Return posts in reverse chronologial order in terms of time posted
    posts = posts.order_by("-date_time").all()

    return paginator(request, posts, page)

# Function to paginate posts
def paginator(request, posts, page):
    # Show 5 posts per page
    paginator = Paginator(posts, 5)

    # Get current page number
    page_number = page
    page_obj = paginator.get_page(page_number)

    # # Get trades information for the post
    trade = Trade.objects.filter(user=request.user).all()

    # Return post information
    return JsonResponse({
        "posts": [post.serialize(request.user, trade) for post in page_obj],
        "num_pages": paginator.num_pages
        }
        ,safe=False)
   
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
    trade = Trade.objects.filter(user=request.user)
    
    # Like the post if not yet liked, or unlike the post if already liking
    if post in user.liking.all():
        post.like.remove(user)
        print(f"{user} is already liking {post.user.username} therefore unliked")
    else:
        post.like.add(user)
        print(f"{user} is not yet liking {post.user.username} but now liked")

    # Return post information
    return JsonResponse(post.serialize(request.user, trade))

# Function to load charts info
def charts(request):

    user = User.objects.get(id=request.user.id)
    # Get liquidity information
    liquidity = Liquidity.objects.get(user=user)

    # Get leverage information
    leverage = Leverage.objects.get(user=user)

    # Get trade information
    trade = Trade.objects.filter(user=user).all()

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
        "trades": [trade for trade in trade]
        }
        ,safe=False)


# Function to load charts info for a specific post
def charts_post(request, postid):

    user = User.objects.get(id=request.user.id)
    # Get liquidity information
    liquidity = Liquidity.objects.get(user=user)

    # Get leverage information
    leverage = Leverage.objects.get(user=user)

    # Get post information
    post = Post.objects.get(id=postid)

    # Get trade information
    trade = post.trade.all()

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
        "trades": [trade for trade in trade]
        }
        ,safe=False)

