from rest_framework import serializers
from event.models import Event
from sponsor.models import Sponsor
from booking.models import Booking
from registration.models import Profile
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']

    def get_profile(self, obj):
        profile = Profile.objects.get(user=obj)
        return {
            "phone": profile.phone,
            "status": profile.status,
            "verified_at": profile.verified_at
        }

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'phone', 'status', 'verified_at']

class UserWithProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create(**validated_data)
        Profile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        profile.phone = profile_data.get('phone', profile.phone)
        profile.status = profile_data.get('status', profile.status)
        profile.verified_at = profile_data.get('verified_at', profile.verified_at)
        profile.save()

        return instance