from django.template.context_processors import request
from rest_framework import serializers
from .models import Trees
from users.serializers import UserSerializer

class TreesSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    
    class Meta:
        model = Trees
        fields = ['id', 'title', 'content', 'picture', 'latitude', 'longitude', 'owner']

class TreesCoordinatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trees
        fields = ['latitude', 'longitude']
