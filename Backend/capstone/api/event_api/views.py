from rest_framework.response import Response
from rest_framework.decorators import api_view
from event.models import Event, Event_User
from .serializers import EventSerializer
from django.contrib.auth.models import User
from api.user_api.decorators import require_authenticated_and_valid_token as valid_token

@api_view(["GET"])
def test(request):
    data = {"status": True, "message": "Testing Event API", "data": None}
    return Response(data)

@api_view(['GET', 'POST'])
@valid_token
def event_list_create(request):
    if request.method == 'GET':
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response({
            "status": True,
            "message": "Event list fetched successfully",
            "data": serializer.data
        }, status=200)

    elif request.method == 'POST':
        serializer = EventSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": True,
                "message": "Event created successfully",
                "data": serializer.data
            }, status=201)
        return Response({
            "status": False,
            "message": "Error creating event",
            "data": serializer.errors
        }, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
@valid_token
def event_detail(request, slug):
    try:
        event = Event.objects.get(slug=slug)
    except Event.DoesNotExist:
        return Response({
            "status": False,
            "message": "Event not found",
            "data": None
        }, status=404)

    if request.method == 'GET':
        serializer = EventSerializer(event)
        return Response({
            "status": True,
            "message": "Event retrieved successfully",
            "data": serializer.data
        }, status=200)

    elif request.method == 'PUT':
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": True,
                "message": "Event updated successfully",
                "data": serializer.data
            }, status=200)
        return Response({
            "status": False,
            "message": "Error updating event",
            "data": serializer.errors
        }, status=400)

    elif request.method == 'DELETE':
        event.delete()
        return Response({
            "status": True,
            "message": "Event deleted successfully",
            "data": None
        }, status=204)
    

@api_view(['POST'])
@valid_token
def add_user_to_event(request, event_slug):
    email = request.data.get('email')
    if not email:
        return Response({"status": False, "message": "Email is required."}, status=400)

    try:
        event = Event.objects.get(slug=event_slug)
    except Event.DoesNotExist:
        return Response({"status": False, "message": "Event not found."}, status=404)

    if request.user != event.user:
        return Response({"status": False, "message": "Unauthorized: You did not create this event."}, status=403)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"status": False, "message": "User not found."}, status=404)

    if Event_User.objects.filter(event=event, user=user).exists():
        return Response({"status": False, "message": "User already added to the event."}, status=400)

    Event_User.objects.create(event=event, user=user)
    return Response({"status": True, "message": "User added to event successfully."}, status= 200)
