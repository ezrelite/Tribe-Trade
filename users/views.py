from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, RegisterSerializer, SuperAdminRegisterSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    # ... existing code ...
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user).data,
            "token": token.key
        }, status=status.HTTP_201_CREATED)

class SuperAdminRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = SuperAdminRegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user).data,
            "token": token.key
        }, status=status.HTTP_201_CREATED)

class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        identity = request.data.get('username', '').strip()
        password = request.data.get('password', '')
        
        print(f"[AUTH DEBUG] Login attempt for identity: '{identity}'")
        
        # Try finding the user by email first (normalized)
        user = User.objects.filter(email__iexact=identity.lower()).first()
        
        # If not found by email, try by username
        if not user:
            user = User.objects.filter(username__iexact=identity).first()
            
        if user and user.check_password(password):
            print(f"[AUTH DEBUG] Auth successful for: {user.email}")
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "user": UserSerializer(user).data,
                "token": token.key
            })
        
        print(f"[AUTH DEBUG] Auth failed for identity: '{identity}'")
        return Response({"non_field_errors": ["Invalid credentials. Check your email/username and password."]}, status=status.HTTP_400_BAD_REQUEST)

from django.conf import settings

class SuperAdminLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        secret_key = request.data.get('secret_key')
        if secret_key != settings.COUNCIL_SECRET_KEY:
            return Response({"detail": "Invalid Authority Key."}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        if not user.is_superuser:
            return Response({"detail": "Access restricted to Council members."}, status=status.HTTP_403_FORBIDDEN)
            
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user).data,
            "token": token.key
        })

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

from .models import VerificationRequest
from .serializers import VerificationRequestSerializer
from rest_framework import viewsets, decorators

class VerificationRequestViewSet(viewsets.ModelViewSet):
    queryset = VerificationRequest.objects.all()
    serializer_class = VerificationRequestSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.is_superuser:
            return VerificationRequest.objects.all()
        return VerificationRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Check if user already has a pending or approved request
        existing = VerificationRequest.objects.filter(user=self.request.user, status__in=['PENDING', 'APPROVED']).exists()
        if existing:
            from rest_framework.exceptions import ValidationError
            raise ValidationError("You already have a pending or approved mandate request.")
        serializer.save(user=self.request.user)

    @decorators.action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        v_request = self.get_object()
        v_request.status = 'APPROVED'
        v_request.save()
        
        user = v_request.user
        user.has_greencheck = True
        user.save()
        
        return Response({'status': 'approved'})

    @decorators.action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        v_request = self.get_object()
        v_request.status = 'REJECTED'
        v_request.save()
        return Response({'status': 'rejected'})
