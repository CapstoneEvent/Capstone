from rest_framework import serializers
from event.models import Event, Event_User
from sponsor.models import Sponsor
from booking.models import Booking
from registration.models import Profile, Token
from kanban.models import Kanban, Kanban_User

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class EventUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event_User
        fields = '__all__'

class SponsorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsor
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class KanbanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kanban
        fields = '__all__'

class KanbanUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kanban_User
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = '__all__'
