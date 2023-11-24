from rest_framework import serializers
from booking.models import Booking
from event.models import Event

class EventSlugField(serializers.SlugRelatedField):
    def to_internal_value(self, data):
        try:
            return Event.objects.get(slug=data)
        except Event.DoesNotExist:
            raise serializers.ValidationError(f"Event with slug '{data}' does not exist.")

class BookingSerializer(serializers.ModelSerializer):
    event = EventSlugField(queryset=Event.objects.all(), slug_field='slug')

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

        return Booking.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.quantity = validated_data.get('quantity', instance.quantity)
        if 'quantity' in validated_data:
            instance.total = validated_data['quantity'] * instance.event.price
        else:
            instance.total = validated_data.get('total', instance.total)
        
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance
