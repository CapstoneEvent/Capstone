from rest_framework.response import Response
from rest_framework.decorators import api_view
from sponsor.models import Sponsor
from .serializers import SponsorSerializer
from api.user_api.decorators import require_authenticated_and_valid_token as valid_token

@api_view(["GET"])
def test(request):
    data = {"status": True, "message": "Testing sponsor API", "data": None}
    return Response(data)

@api_view(['GET', 'POST'])
@valid_token
def sponsor_list_create(request):
    if request.method == 'GET':
        sponsors = Sponsor.objects.filter(event__user=request.user)
        serializer = SponsorSerializer(sponsors, many=True, context={'request': request})
        return Response({"status": True, "message": "Retrieved sponsors successfully.", "data": serializer.data})

    elif request.method == 'POST':
        serializer = SponsorSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"status": True, "message": "Sponsor created successfully.", "data": serializer.data}, status=201)
        return Response({"status": False, "message": "Sponsor creation failed.", "data": serializer.errors}, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
@valid_token
def sponsor_detail(request, slug):
    try:
        sponsor = Sponsor.objects.get(slug=slug, event__user=request.user)
    except Sponsor.DoesNotExist:
        return Response({"status": False, "message": "Sponsor not found."}, status=404)

    if request.method == 'GET':
        serializer = SponsorSerializer(sponsor, context={'request': request})
        return Response({"status": True, "message": "Retrieved sponsor successfully.", "data": serializer.data})

    elif request.method == 'PUT':
        serializer = SponsorSerializer(sponsor, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"status": True, "message": "Sponsor updated successfully.", "data": serializer.data})
        return Response({"status": False, "message": "Sponsor update failed.", "data": serializer.errors}, status=400)

    elif request.method == 'DELETE':
        sponsor.delete()
        return Response({"status": True, "message": "Sponsor deleted successfully."}, status=204)
