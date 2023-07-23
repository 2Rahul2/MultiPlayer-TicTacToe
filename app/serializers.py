from rest_framework import serializers
from .models import RoomNumber

class RoomNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomNumber
        fields = '__all__'