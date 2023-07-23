from django.urls import re_path ,path
from . import consumers

websocket_urlpatterns = [
    path(r'ws/socket-server/<str:pk>/' ,consumers.XOConsumer.as_asgi()),
]