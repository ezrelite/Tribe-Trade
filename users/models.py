import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    is_plug = models.BooleanField(default=False)
    is_citizen = models.BooleanField(default=True)
    has_greencheck = models.BooleanField(default=False)
    institution = models.ForeignKey('core.Institution', on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    @property
    def role_display(self):
        if self.is_plug: return 'Plug'
        if self.is_citizen: return 'Citizen'
        return 'Tribe Member'

    def __str__(self):
        return self.email

class VerificationRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='verification_requests')
    matric_no = models.CharField(max_length=50)
    id_card = models.ImageField(upload_to='verifications/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Verification for {self.user.email} - {self.status}"
