from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(["GET"])
def test(request):
    data = {"status": True, "message": "Testing admin API", "data": None}
    return Response(data)
