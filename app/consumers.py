import json
from channels.generic.websocket import WebsocketConsumer
# from asigref.sync import async_to_sync 
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import RoomNumber
from django.db.models import F

class XOConsumer(WebsocketConsumer):
    def connect(self):

        # self.room_code = self.scope['url_route']['kwargs'].get('roomcode', None)
        # self.room_code = "room5464"

        # if self.room_code is not None:
        #     # Print the room code to verify if it's being captured correctly
        #     print(f"Room Code: {self.room_code}")

        # self.accept()
        
        self.room_group_name = self.scope['url_route']['kwargs']['pk']
        self.roomObject = RoomNumber.objects.get(roomCode = self.room_group_name)
        if self.roomObject.usersConnected >=2:
            self.send(text_data=json.dumps({
                'type':'connection_failed',
                'message':'roomFull'
            }))
            return self.close()
        else:
            self.roomObject.usersConnected += 1
            self.roomObject.save()

            print(self.room_group_name)
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
            self.accept()
            self.send(text_data = json.dumps({
                'type':'connection_established',
                'message':'connected'
            }))

        if self.roomObject.usersConnected == 2:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                self.room_group_name,{
                'type':'enableChoice',
                'msg':'1'

                }
            )
    def enableChoice(self ,event):
        message = event['msg']
        self.send(text_data=json.dumps({'type': 'enableChoice', 'message': message}))

    def receive(self , text_data):
        text_data_json = json.loads(text_data)
        messageType = text_data_json.get('type')
        # print("recieved " ,text_data_json.get("Key"))
        key = ''
        if(messageType == 'decide'):
            channel_layer = get_channel_layer()
            if text_data_json.get("Key") == 'X':
                txt = text_data_json.get('user')+'   '+'chose X'
                key ='X'
            elif text_data_json.get("Key") == "O":
                txt = text_data_json.get('user')+'   '+'chose O'
                key = 'O'
            async_to_sync(channel_layer.group_send)(
                self.room_group_name,
                {
                    'type':'playerKey',
                    'msg':txt,
                    'user':text_data_json.get('user'),
                    'key':key

                }
            )
        elif messageType == 'game':
            channel_layer = get_channel_layer()
            text_data_json = json.loads(text_data)
            keyID = text_data_json.get('boxNo')
            myKey = text_data_json.get('myKey')
            user = text_data_json.get('user')
            print('sending Key Moves')
            async_to_sync(channel_layer.group_send)(
                self.room_group_name,{
                    'type':'keyMove',
                    'boxNo':keyID,
                    'myKey':myKey,
                    'user':user,
                }
            )
        elif messageType == 'win':
            channel_layer=get_channel_layer()
            win_index = text_data_json.get('indexes')
            user = text_data_json.get('user')
            print("INDEX" ,win_index)
            async_to_sync(channel_layer.group_send)(
                self.room_group_name,{
                    'type':'WinStatus',
                    'index':win_index,
                    'user':user,
                }
            )
        elif messageType == 'replay':
            channel_layer = get_channel_layer()
            user = text_data_json.get('user')

            async_to_sync(channel_layer.group_send)(
                self.room_group_name,{
                    'type':'replay',
                    'user':user,
                }
            )

    def replay(self ,event):
        user = event['user']
        self.send(text_data=json.dumps({'type':'replay' ,'user':user}))
    def WinStatus(self ,event):
        win_index = event['index']
        user = event['user']
        self.send(text_data=json.dumps({'type':'WinStatus' , 'win_index':win_index ,'user':user}))

    def keyMove(self ,event):
        boxno = event['boxNo']
        mykey = event['myKey']
        user = event['user']
        self.send(text_data=json.dumps({'type':'keyMove','boxno':boxno ,'myKey':mykey ,'user':user}))
    def playerKey(self, event):
        # This method handles messages of type 'playerKey' sent to the group
        message = event['msg']
        userName = event['user']
        key = event['key']
        print("PLAYER KEY FUNTION:    " ,message)
        # Send the message to the WebSocket
        self.send(text_data=json.dumps({'type': 'playerKey', 'message': message ,'userName':userName ,'key':key}))
                # print(text_data_json.get('user') ,'Chose Y')

        # async_to_sync(self.channel_layer.group_send)(
        #     self.room_group_name,{
        #         'type':'chat_message',
        #         'message':message
        #     }
        # )
    def chat_message(self ,event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type':'chat',
            'message':message
        }))
    
    def disconnect(self, close_code):
        self.roomObject.usersConnected = F('usersConnected') - 1
        self.roomObject.save()
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        # return super().disconnect(code)

        
