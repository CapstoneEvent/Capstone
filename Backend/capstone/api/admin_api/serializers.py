from rest_framework import serializers
from event.models import Event
from booking_verification.models import Booking_Verification
from django.contrib.auth.hashers import make_password
from api.booking_api.mail import send_booking_email
from booking.models import Booking
from django.utils.text import slugify
from event.models import Event
from registration.models import Profile
from django.contrib.auth.models import User
import secrets
from django.utils import timezone
from datetime import timedelta

class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'profile']
        extra_kwargs = {
            'password': {'write_only': True} 
        }
    def get_profile(self, obj):
        profile = Profile.objects.get(user=obj)
        return {
            "phone": profile.phone,
            "status": profile.status,
            "verified_at": profile.verified_at
        }

class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

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
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        Profile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()

        profile.phone = profile_data.get('phone', profile.phone)
        profile.status = profile_data.get('status', profile.status)
        profile.verified_at = profile_data.get('verified_at', profile.verified_at)
        profile.save()

        return instance


class EventSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(write_only=True)

    class Meta:
        model = Event
        fields = (
            'id', 'slug', 'name', 'cover_picture', 'description',
            'start_date', 'end_date', 'available_seats',
            'price', 'status', 'user_email'
        )
        extra_kwargs = {
            'cover_picture': {'required': False},
            'slug': {'required': False},
        }

    def validate_user_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email")
        return value

    def create(self, validated_data):
        user_email = validated_data.pop('user_email')
        user = User.objects.get(email=user_email)
        event = Event(**validated_data)
        event.save()
        event.user.add(user)
        slug = slugify(event.name)
        unique_slug = slug
        num = 1
        while Event.objects.filter(slug=unique_slug).exists():
            unique_slug = f'{slug}-{num}'
            num += 1

        event.slug = unique_slug
        event.save()

        return event

    def update(self, instance, validated_data):
        user_email = validated_data.pop('user_email', None)

        if user_email:
            user = User.objects.get(email=user_email)
            instance.user.clear()
            instance.user.add(user)

        instance.name = validated_data.get('name', instance.name)
        instance.cover_picture = validated_data.get('cover_picture', instance.cover_picture)
        instance.description = validated_data.get('description', instance.description)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.available_seats = validated_data.get('available_seats', instance.available_seats)
        instance.price = validated_data.get('price', instance.price)
        instance.status = validated_data.get('status', instance.status)

        if 'name' in validated_data:
            slug = slugify(validated_data['name'])
            if instance.slug != slug:
                unique_slug = slug
                num = 1
                while Event.objects.filter(slug=unique_slug).exists():
                    unique_slug = f'{slug}-{num}'
                    num += 1
                instance.slug = unique_slug

        instance.save()
        return instance

class EventSlugField(serializers.SlugRelatedField):
    def to_internal_value(self, data):
        try:
            return Event.objects.get(slug=data)
        except Event.DoesNotExist:
            raise serializers.ValidationError(f"Event with slug '{data}' does not exist.")

class BookingSerializer(serializers.ModelSerializer):
    event = EventSlugField(queryset=Event.objects.all(), slug_field='slug')
    user_email = serializers.EmailField(write_only=True)  #

    class Meta:
        model = Booking
        fields = ['event', 'quantity', 'total', 'status', 'user_email'] 
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value

    def create(self, validated_data):
        user_email = validated_data.pop('user_email')

        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with provided email does not exist.")

        event = validated_data['event']
        quantity = validated_data['quantity']

        total = quantity * event.price
        validated_data['total'] = total
        validated_data['user'] = user

        booking = Booking.objects.create(**validated_data)

        token = secrets.token_urlsafe(10)

        if booking.event.end_date:
            valid_till = booking.event.end_date
        else:
            valid_till = timezone.now() + timedelta(days=365)

        Booking_Verification.objects.create(
            booking=booking,
            token=token,
            valid_till=valid_till,
            status=0
        )

        send_booking_email(user, token)

        return booking

    def update(self, instance, validated_data):
        instance.quantity = validated_data.get('quantity', instance.quantity)
        if 'quantity' in validated_data:
            instance.total = validated_data['quantity'] * instance.event.price
        else:
            instance.total = validated_data.get('total', instance.total)
        
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance
