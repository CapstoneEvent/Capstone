from rest_framework.response import Response
from rest_framework.decorators import api_view
from booking.models import Booking
from .serializers import BookingSerializer
from api.user_api.decorators import require_authenticated_and_valid_token as valid_token

@api_view(["GET"])
def test(request):
    data = {"status": True, "message": "Testing Booking API", "data": None}
    return Response(data, status=200)

@api_view(['GET', 'POST'])
@valid_token
def booking_list_create(request):
    if request.method == 'GET':
        bookings = Booking.objects.all()
        serializer = BookingSerializer(bookings, many=True)
        return Response({"status": True, "message": "Booking list retrieved.", "data": serializer.data})

    elif request.method == 'POST':
        serializer = BookingSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"status": True, "message": "Booking created.", "data": serializer.data}, status=201)
        return Response({"status": False, "message": "Booking creation failed.", "data": serializer.errors}, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
@valid_token
def booking_detail(request, id):
    try:
        booking = Booking.objects.get(id=id)
    except Booking.DoesNotExist:
        return Response({"status": False, "message": "Booking not found.", "data": None}, status=404)

    if request.user != booking.user:
        return Response({"status": False, "message": "Unauthorized access.", "data": None}, status=403)

    if request.method == 'GET':
        serializer = BookingSerializer(booking)
        return Response({"status": True, "message": "Booking retrieved.", "data": serializer.data})

    elif request.method == 'PUT':
        serializer = BookingSerializer(booking, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": True, "message": "Booking updated.", "data": serializer.data})
        return Response({"status": False, "message": "Booking update failed.", "data": serializer.errors}, status=400)

    elif request.method == 'DELETE':
        booking.delete()
        return Response({"status": True, "message": "Booking deleted.", "data": None}, status=204)
