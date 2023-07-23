from django.urls import path

from . import views

urlpatterns = [
    path('' ,views.home , name='home'),
    path('room/<str:name>' ,views.roomList ,name='lobby'),
    path('game/<str:pk>/' ,views.insideXOX),
    path('create-room/' ,views.HostRoom),
    path('room-list/' ,views.RoomCodeList),

]