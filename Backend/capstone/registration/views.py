# myapp/views.py
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Profile  # Import the Profile model


@csrf_exempt
@require_POST
def register(request):
    username = request.POST.get("username")
    password = request.POST.get("password")
    phone = request.POST.get("phone")

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username is already taken."}, status=400)

    user = User.objects.create_user(username=username, password=password)
    user.save()

    profile = Profile.objects.create(user=user, phone=phone)

    login(request, user)
    return JsonResponse({"message": "Registration successful."})


@csrf_exempt
@require_POST
def login_view(request):
    username = request.POST.get("username")
    password = request.POST.get("password")

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({"message": "Login successful."})
    else:
        return JsonResponse({"error": "Login failed."}, status=401)
