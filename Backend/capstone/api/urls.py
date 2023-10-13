from django.urls import path
from . import views

urlpatterns = [
    path("", views.test),
    path("login", views.login_api),
    path("user", views.get_user_data),
    path("register", views.registration_api),
    path("profile_update", views.update_profile),
    path("change_password", views.change_password),
]
