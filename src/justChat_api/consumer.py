
from .format_date import FormatDate
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import *
from django.shortcuts import  get_object_or_404

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        print("is connecting")
        if  self.user.is_authenticated:
            self.user = CustomUser.objects.get(id=self.user.id)
            if self.user.channel_name is None:
                print(type(self.channel_name))
                self.user.channel_name = self.channel_name
                self.user.save()

            print("connected")
        else:
            print("not authenticated")
            self.close()
    
    # Receive message from WebSocket
    def receive(self, text_data):
        friend_id = self.scope["url_route"]["userid"]
        friend = CustomUser.objects.get(id=friend_id)
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        message.update({"sender": self.scope["user"].get("id"), "receipient": friend.id})
        m = Message.objects.create(**message)
        if friend.channel_name:
            m.is_receipient_online = True
        m.save()
        message.update({
            "message_id": m.message_id, 
             "created_at": FormatDate.format_date(m.created_at),
             "is_receipient_online": m.is_receipient_online,
             })
        if friend.channel_name:
            async_to_sync(self.channel_layer.send)(
                friend.channel_name, {
                    "type": "send.message.to.friend",
                    "message": message
                }
            )
        async_to_sync(self.channel_layer.send)(
            self.user.channel_name, {
            "type": "send.message.to.friend",
            "message": message,
            })

    def send_message_to_friend(self, event):
        message = event["message"]
        self.send(text_data=json.dumps(message))

    def disconnect(self, close_code):
        user = CustomUser.objects.get(id=self.user.id)
        if user.channel_name:
            user.channel_name = None
            user.save()
        print("disconnected")


class GroupChatConsumer(WebsocketConsumer):
    pass



class VideoCallConsumer(WebsocketConsumer):
    def connect(self):
        #Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.post_room, self.channel_name
        )

        async_to_sync(self.channel_layer.group_add)(
            self.notification_room, self.channel_name
        )
        async_to_sync(self.channel_layer.group_add)(
            self.comment_room, self.channel_name
        )
        print("connected")

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
    
        async_to_sync(self.channel_layer.group_discard)(
            self.post_room, self.channel_name
        )
        async_to_sync(self.channel_layer.group_discard)(
            self.notification_room, self.channel_name
        )
        


    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        print(message)

    # Receive message from room group
    def handle_post(self, event):
        message = event["message"]
        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))


