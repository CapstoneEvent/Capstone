from rest_framework import serializers
from booking.models import Booking
from event.models import Event

class EventSlugField(serializers.SlugRelatedField):
    def to_internal_value(self, data):
        try:
            # Fetch the event based on the slug
            return Event.objects.get(slug=data)
        except Event.DoesNotExist:
            raise serializers.ValidationError(f"Event with slug '{data}' does not exist.")

class BookingSerializer(serializers.ModelSerializer):
    # Use the custom EventSlugField for the event field
    event = EventSlugField(queryset=Event.objects.all(), slug_field='slug')

    class Meta:
        model = Booking
        fields = ['event', 'quantity', 'total', 'status']

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user

        # Directly use the event object in validated_data for creating the Booking
        return Booking.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.total = validated_data.get('total', instance.total)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance
