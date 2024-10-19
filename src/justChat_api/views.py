from django.shortcuts import render
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import redirect, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_ratelimit.decorators import ratelimit
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.cache  import cache_page, never_cache, cache_control
from django.core.cache import cache
from django.views.decorators.vary import vary_on_cookie
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, permission_classes, authentication_classes, parser_classes
from .serializer import *
from .custompermissions import *
import random
from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMessage
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
import requests
import base64
import uuid
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from datetime import datetime
from .services import get_user_data
from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth import login
from rest_framework.views import APIView
from .serializer import AuthSerializer
from django.db.models import Q
from .format_date import FormatDate
channel_layer = get_channel_layer()
#from .formatdate import FormatDate
# Create your views here.


class UserViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def create_user(self, request):
        serializer = CustomUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = CustomUser.objects.get(email=request.data.get("email"))
        refresh = RefreshToken.for_user(user=user)
        serializer.validated_data.update({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })
        return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def verify_email(self, request):
        try:
            CustomUser.objects.get(email=request.data.get("email"))
            return Response({"error": "bad request"}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            otp = random.randint(51011, 89630)  # Generate random OTP
            request.session['otp'] = otp
            request.session.save()
            print(f"OTP saved in session: {request.session['otp']}")  # Debugging output

            # Send OTP via email
            subject = "User Email Verification"
            html_content = f'''
                <html><body> 
                <div>Dear Sir / Madam,</div>
                <div>To verify your email, use this OTP:</div>
                <span>{otp}</span>
                <div>This OTP is valid for the next 2 minutes. Do not share it.</div>
                <div>Thank you for using justChat.com.</div>
                <div>Best regards,<br>justChat Support Team</div>
                </body></html>
            '''
            mail_from = settings.EMAIL_HOST_USER
            recipient = [request.data.get("email")]
            email = EmailMessage(subject, html_content, mail_from, recipient)
            email.content_subtype = 'html'
            email.send(fail_silently=False)
            print(request.session.get("otp"))
            return Response({"detail": "OTP created successfully"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def verify_otp(self, request):
        otp = request.session.get('otp', None)
        print(f"Provided OTP: {request.data.get('otp')}")
        print(f"Saved OTP: {otp}")  # Check what's retrieved
        otp_code = request.data.get("otpCode")
        saved_otp = request.session.get("otp")  # Retrieve OTP from session

        print(f"Provided OTP: {otp_code}")
        print(f"Saved OTP: {saved_otp}")

        if otp_code and str(otp_code) == str(saved_otp):
            response = Response({"detail": "OTP verified successfully"}, status=status.HTTP_200_OK)
            return response
        return Response({"detail": "Invalid OTP"}, status=status.HTTP_406_NOT_ACCEPTABLE)

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def login_user(self, request):
        user = get_object_or_404(CustomUser, email=request.data.get("email"))
        if user.check_password(request.data.get("password")):
            refresh = RefreshToken.for_user(user=user)
            return Response({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "profile_image": user.profile_image if user.profile_image else None,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response({"error": "bad request"}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, permission_classes=[IsAuthenticated], authentication_classes=[JWTAuthentication, SessionAuthentication, BasicAuthentication], methods=["get"])
    def add_a_friend(self, request, pk=None):
        friend = get_object_or_404(CustomUser, id=pk)
        user = get_object_or_404(CustomUser, email=request.user.get("email"))
        user.friends.add(friend)
        user.save()
        return Response({"detail": "friend added successfully"}, status=status.HTTP_200_OK)
    
    @action(detail=False, permission_classes=[IsAuthenticated], authentication_classes=[JWTAuthentication, SessionAuthentication, BasicAuthentication], methods=["post"])
    def add_friend_to_group(self, request):
        request.data.update({"author": request.user.id})
        serializer = GroupSerialzer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "group created successfully"}, status=status.HTTP_200_OK)

    
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated], authentication_classes=[JWTAuthentication, SessionAuthentication, BasicAuthentication])
    def get_friends(self, request):
        user = get_object_or_404(CustomUser, email=request.user.get("email"))
        user_friends = user.friends.all()
        if user_friends:
            friend_list = []
            for friend in user_friends:
                user_and_friend_msg = Message.objects.filter(Q(sender=user.id, receipient=friend.id) | Q(sender=friend.id, receipient=user.id)).order_by("created_at")
                user_and_friend_last_msg = user_and_friend_msg[-1]
                user_and_friend_last_msg.is_receipient_online = True if user_and_friend_last_msg.receipient.id == friend.id and friend.is_online == True else False
                user_and_friend_last_msg.save()
                friend_obj = {
                    "id": friend.id,
                    "username": friend.username,
                    "profile_image": friend.profile_image if friend.profile_image else None,
                    "is_online": friend.is_online,
                    "last_date_online": friend.last_date_online,
                    "last_message": {
                        "message_id": user_and_friend_last_msg.messageId,
                        "sender_username": user_and_friend_last_msg.sender.username,
                        "sender_id": user_and_friend_last_msg.sender.id,
                        "image": user_and_friend_last_msg.image if user_and_friend_last_msg.image else None,
                        "video": user_and_friend_last_msg.video if user_and_friend_last_msg.video else None,
                        "audio": user_and_friend_last_msg.audio if user_and_friend_last_msg.audio else None,
                        "text": user_and_friend_last_msg.text if user_and_friend_last_msg.text else None,
                        "created_at": FormatDate.format_date(user_and_friend_last_msg.created_at),
                        "is_receipient_online": user_and_friend_last_msg.is_receipient_online
                    }
                }
                friend_list.append(friend_obj)
            return Response(friend_list, status=status.HTTP_200_OK)
        return Response({"error": "not found"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, authentication_classes=[JWTAuthentication, SessionAuthentication, BasicAuthentication], methods=["get"], permission_classes=[IsAuthenticated])
    def get_groups(self, request):
        user = get_object_or_404(CustomUser, email=request.user.get("email"))
        user_groups = user.all_groups.all()
        if user_groups:
            group_list = []
            for group in user_groups:
                group_messages = Message.objects.filter(group=group.group_id).order_by("created_at")
                last_group_msg = group_messages[-1]
                group_obj = {
                    "group_id": group.group_id,
                    "group_name": group.group_name,
                    "group_photo":  group.group_photo,
                    "last_message": {
                        "message_id": last_group_msg.message_id,
                        "video": last_group_msg.video if last_group_msg.video else None,
                        "image": last_group_msg.image if last_group_msg.image else None,
                        "audio": last_group_msg.audio if last_group_msg.audio else None,
                        "text": last_group_msg.text if last_group_msg.text else None,
                        "sender_username": last_group_msg.sender.username,
                        "sender_id": last_group_msg.sender.id,
                        "created_at": FormatDate.format_date(last_group_msg.created_at)
                    }
                }

                group_list.append(group_obj)
            return Response(group_list, status=status.HTTP_200_OK)
        return Response({"error": "not found"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated], authentication_classes=[JWTAuthentication, BasicAuthentication, SessionAuthentication])
    def get_user_and_frnd_msgs(self, request, pk=None):
        friend = get_object_or_404(CustomUser, id=pk)
        user = get_object_or_404(CustomUser, email=request.user.get("email"))
        messages = Message.objects.filter(Q(sender=friend.id, receipient=user.id) | Q(sender=user.id, receipient=friend.id)).order_by("created_at")
        if messages:
            message_list = []
            for message in messages:
                message.is_receipient_online = True if message.receipient.is_online == True and message.receipient.id == friend.id else False
                message.save()
                message_obj = {
                    "message_id": message.message_id,
                    "image": message.image if message.image else None,
                    "video": message.video if message.video else None,
                    "audio": message.audio if message.audio else None,
                    "text": message.text if message.text else None,
                    "sender": message.sender.id,
                    "receipient": message.receipient.id,
                    "is_receipient_online": message.is_receipient_online,
                    "created_at": FormatDate.format_date(message.created_at)
                }
                message_list.append(message_obj)
            return Response(message_list, status=status.HTTP_200_OK)
        return Response({"error": "not found"}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, permission_classes=[IsAuthenticated], authentication_classes=[JWTAuthentication, SessionAuthentication, BasicAuthentication], methods=["get"])
    def get_user_and_group_msgs(self, request, pk=None):
        group = get_object_or_404(Group, group_id=pk)
        group_messages = group.messages.all()
        if group_messages:
            group_message_list = []
            for group_msg in group_messages:
                group_msg_obj = {
                    "message_id": group_msg.message_id,
                    "video": group_msg.video if group_msg.video else None,
                    "audio": group_msg.audio if group_msg.audio else None,
                    "image": group_msg.image if group_msg.image else None,
                    "text": group_msg.text if group_msg.text else None,
                    "created_at": FormatDate.format_date(group_msg.created_at),
                    "sender": {
                        "id": group_msg.sender.id,
                        "username": group_msg.sender.username,
                        "profile_image": group_msg.sender.profile_image if group_msg.sender.profile_image else None
                    }
                }

                group_message_list.append(group_msg_obj)
            return Response(group_message_list, status=status.HTTP_200_OK)
        return Response({"error": "not found"}, status=status.HTTP_404_NOT_FOUND)

        
    
    
    @staticmethod
    def otp_hash_algo(otp):
        otp_str = str(otp)
        hash_map_dict = {
        '0': '}?<%', '1': '*\\)>',
        '2': '/$<?', '3': '/($?',
        '4': '!$@<', '5': ']..$',
        '6': '@){:', '7': ']:,$', 
        '8': '],)/', '9': '>*!&'
        }
        hash_str = ""
        i = 0
        for ch in otp_str:
            hash_str += hash_map_dict[ch]
            if i != 3:
                hash_str += "="
            i += 1
        return hash_str
    
    @staticmethod
    def otp_unhash_algo(hash_str):
        if hash_str is None:
            print("hash_str is none")
        print(hash_str)
        unhash_map_dict = {
            '}?<%': "0", '*\\)>': "1",
            '/$<?': "2", '/($?': "3",
            '!$@<': "4", ']..$': "5",
            '@){:': "6", ']:,$': "7",
            '],)/': "8", '>*!&': "9"
        }
        otp_str = ""
        hash_str = hash_str.split("=")
        print("this is the hash str list", hash_str)
        for _str in hash_str:
            otp_str += unhash_map_dict[_str]
        return otp_str
    


class GoogleAuthViewSet(viewsets.ViewSet):

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def google_login(self, request):
        auth_serializer = AuthSerializer(data=request.GET)
        auth_serializer.is_valid(raise_exception=True)
        validated_data = auth_serializer.validated_data
        user_data = get_user_data(validated_data)
        try:
            user = CustomUser.objects.get(email=user_data['email'])
            refresh = RefreshToken.for_user(user=user)
            return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_200_OK)
        #return redirect(settings.BASE_APP_URL)
        except KeyError as e:
            return redirect("http://localhost:5173/log-in")