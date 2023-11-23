from django.urls import path
from . import views

urlpatterns = [
    path("", views.test),
    path('users/', views.user_list_create),
    path('users/<int:id>/', views.user_detail),
]
