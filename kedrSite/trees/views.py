from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Trees
from .serializers import TreesSerializer, TreesCoordinatesSerializer


# Create your views here.
class TreesAPIList(generics.ListCreateAPIView):
    queryset = Trees.objects.all()
    serializer_class = TreesSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
        else:
            print(serializer.errors)

class TreesAPIDetails(generics.RetrieveAPIView):
    queryset = Trees.objects.all()
    serializer_class = TreesSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class TreesAPICoordinates(generics.ListAPIView):
    queryset = Trees.objects.all()
    serializer_class = TreesCoordinatesSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]