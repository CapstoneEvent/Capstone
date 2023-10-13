from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.serializers import AuthTokenSerializer
from .decorators import require_authenticated_and_valid_token as valid_token
from .serializers import UserRegistrationSerializer, UserProfileUpdateSerializer, PasswordChangeSerializer
from knox.auth import AuthToken


@api_view(["GET"])
def test(request):
    data = {"status": True, "message": "Testing API", "data": None}
    return Response(data)


@api_view(["POST"])
def login_api(request):
    serializer = AuthTokenSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data["user"]

    _, token = AuthToken.objects.create(user)

    data = {"status": True, "message": "Login Successfull", "data": {"token": token}}
    return Response(data, status=200)

@valid_token
@api_view(["GET"])
def get_user_data(request):
    user = request.user
    profile = user.profile
    data = {
        "status": True,
        "message": "Authenticated user info",
        "data": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "phone": profile.phone,
        },
    }

    return Response(data, status=200)


@api_view(["POST"])
def registration_api(request):
    serializer = UserRegistrationSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        _, token = AuthToken.objects.create(user)

        data = {
            "status": True,
            "message": "Registration Successful",
            "data": {"user_id": user.id, "token": token},
        }
        return Response(data, status=201)

    errors = serializer.errors
    data = {
        "status": False,
        "message": "Registration Failed",
        "data": {"errors": errors},
    }
    return Response(data, status=400)

@api_view(["PUT"])
@valid_token
def update_profile(request):
    user = request.user
    serializer = UserProfileUpdateSerializer(user, data=request.data)

    if serializer.is_valid():
        serializer.save()
        data = {
            "status": True,
            "message": "Profile Updated Successfully",
        }
        return Response(data, status=200)

    errors = serializer.errors
    data = {
        "status": False,
        "message": "Profile Update Failed",
        "data": {"errors": errors},
    }
    return Response(data, status=400)

@api_view(["PUT"])
@valid_token
def change_password(request):
    user = request.user
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})

    if serializer.is_valid():
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        data = {
            "status": True,
            "message": "Password changed successfully",
        }
        return Response(data, status=200)

    errors = serializer.errors
    data = {
        "status": False,
        "message": "Password change failed",
        "data": {"errors": errors},
    }
    return Response(data, status=400)