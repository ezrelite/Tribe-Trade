from rest_framework import serializers
from django.contrib.auth import get_user_model
from store.models import Store

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    institution_name = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'is_plug', 'is_citizen', 'has_greencheck', 'phone_number', 'is_superuser', 'is_staff', 'institution', 'institution_name', 'password', 'avatar')
        read_only_fields = ('id', 'has_greencheck', 'is_superuser', 'is_staff', 'is_plug', 'is_citizen')

    def get_institution_name(self, obj):
        return obj.institution.name if obj.institution else "No Institution"

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        
        return super().update(instance, validated_data)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_plug = serializers.BooleanField(required=False, default=False)
    is_citizen = serializers.BooleanField(required=False, default=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'phone_number', 'is_plug', 'is_citizen', 'institution')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'].lower().strip(),
            username=validated_data['username'].strip(),
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number', ''),
            is_plug=validated_data.get('is_plug', False),
            is_citizen=validated_data.get('is_citizen', True),
            institution=validated_data.get('institution')
        )
        
        # Create Store for Plugs
        if user.is_plug:
            institution_id = self.context['request'].data.get('institution')
            if institution_id:
                from core.models import Institution
                # Try to find the institution by ID, create store only if found
                institution = Institution.objects.filter(id=institution_id).first()
                if institution:
                    Store.objects.create(
                        owner=user,
                        name=f"{user.username}'s HQ",
                        institution=institution
                    )
                else:
                    # If no institution found, create store without institution (make nullable)
                    # For now, skip store creation if institution not found
                    pass
        
        return user

from django.conf import settings

class SuperAdminRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    secret_key = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'secret_key')

    def validate_secret_key(self, value):
        if value != settings.COUNCIL_SECRET_KEY:
            raise serializers.ValidationError("Invalid Authority Key.")
        return value

    def create(self, validated_data):
        validated_data.pop('secret_key')
        user = User.objects.create_superuser(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

from .models import VerificationRequest

class VerificationRequestSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    institution = serializers.SerializerMethodField()

    class Meta:
        model = VerificationRequest
        fields = ('id', 'user', 'username', 'email', 'matric_no', 'id_card', 'status', 'created_at', 'institution')
        read_only_fields = ('id', 'user', 'status', 'created_at')

    def get_institution(self, obj):
        # If user is a plug, they have a store with an institution
        if hasattr(obj.user, 'store'):
            return obj.user.store.institution.name
        return "Not Linked"
