# users/views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
import logging
from django.http import JsonResponse
from django.middleware.csrf import get_token
from .serializers import UserSerializer, LoginSerializer

# Set up logger
logger = logging.getLogger(__name__)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    "user": serializer.data,
                    "token": token.key
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error("User registration failed.", exc_info=True)
                return Response({"error": "User registration failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logger.info(f"Login attempt with data: {request.data}")
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            logger.info(f"Serializer is valid. Attempting authentication with email: {serializer.validated_data['email']}")
            user = authenticate(request, username=serializer.validated_data['email'], password=serializer.validated_data['password'])
            if user:
                logger.info(f"Authentication successful for user: {user.email}")
                token, created = Token.objects.get_or_create(user=user)
                logger.info(f"Token created/retrieved: {token.key}")
                return Response({
                    'message': 'Login successful',
                    'token': token.key
                }, status=status.HTTP_200_OK)
            else:
                logger.warning("Authentication failed: Invalid credentials")
                return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            logger.warning(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

# CSRF token view
def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})