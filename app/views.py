from django.shortcuts import render
from .models import RoomNumber
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
import random
import json
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import redirect
# Create your views here.
from .serializers import RoomNumberSerializer
def home(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get('name')
        # name = request.POST.get('name')
        request.session['user_name'] = name
        print("USERNAME:   " ,name)
        print('CSRF TOKEN' ,request.META.get('CSRF_COOKIE'))
        print('SESSION DATA' ,request.session.items())
        jsonData = json.dumps({
            'name':name
        })
        return JsonResponse(jsonData ,safe=False)
    return render(request ,'app/index.html')

@api_view(['POST'])
def HostRoom(request):
    if request.method == "POST":
        print("here")
        roomCode = random.randint(1000,9999)
        while RoomNumber.objects.filter(roomCode = roomCode):
            roomCode = random.randint(1000,9999)
    
        newRoom = RoomNumber.objects.create(roomCode=roomCode)
        # newRoom.roomCode = roomCode
        print("saving")
        newRoom.save()
        print("saved Succesfull")
        RoomObject = RoomNumberSerializer(newRoom)
        return Response(RoomObject.data)
    else:
        return HttpResponseRedirect(redirect_to='/')

@api_view(['GET'])
def RoomCodeList(request):
    if request.method == 'GET':
        room_list = RoomNumber.objects.all()
        room_object = RoomNumberSerializer(room_list ,many=True)
        return Response(room_object.data)
    else:
        return Response('room list unavaliable')
def roomList(request ,name):
    name = request.session.get('user_name')
    print('CSRF TOKEN' ,request.META.get('CSRF_COOKIE'))
    print('SESSION DATA' ,request.session.items())
    if(name != None):
        roomNo = RoomNumber.objects.all()
        context = {'name':name, 'room':roomNo}
        
        return render(request ,'app/lobby.html' ,context)
    else:
        print("ROOM LIST NAME:   " ,name)
        return redirect('/')

def insideXOX(request ,pk):
    name = request.session.get('user_name' ,None)
    context = {'id':pk,'name':name}
    return render(request ,'app/xox.html' ,context)