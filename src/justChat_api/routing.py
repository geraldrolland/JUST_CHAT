from django.urls import re_path, path
from . import consumer

websocket_urlpatterns = [
  re_path(r'ws/groupchat/<group_id>/$', consumer.GroupChatConsumer.as_asgi()),
  re_path(r'ws/chat/<userId>/$', consumer.ChatConsumer.as_asgi()),
  re_path(r'ws/videocall/<userId>/$', consumer.VideoCallConsumer.as_asgi()),
]