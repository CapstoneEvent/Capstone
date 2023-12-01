from rest_framework import serializers
from booking.models import Booking
from booking_verification.models import Booking_Verification
from event.models import Event
from datetime import timedelta
from django.utils import timezone
import secrets
import qrcode
from io import BytesIO
from django.core.mail import EmailMessage
from django.conf import settings

class EventSlugField(serializers.SlugRelatedField):
    def to_internal_value(self, data):
        try:
            return Event.objects.get(slug=data)
        except Event.DoesNotExist:
            raise serializers.ValidationError(f"Event with slug '{data}' does not exist.")

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['name']
        
class BookingSerializer(serializers.ModelSerializer):
    event = EventSlugField(queryset=Event.objects.all(), slug_field='slug')
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Booking
        fields = ['event', 'quantity', 'total', 'status', 'user']

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
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

        qr = qrcode.make(token)

        buffer = BytesIO()
        qr.save(buffer)
        buffer.seek(0)

        user_email = user.email
        email = EmailMessage(
            'Your Booking Confirmation',
            'Here is your booking QR Code. Please bring this to the event.',
            settings.DEFAULT_FROM_EMAIL,
            [user_email]
        )
        email.attach('booking_qr.png', buffer.getvalue(), 'image/png')
        email.send()

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
