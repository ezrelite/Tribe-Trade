from django.db import models
from django.conf import settings

class Store(models.Model):
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='store')
    institution = models.ForeignKey('core.Institution', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    wallet_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    escrow_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    class Meta:
        verbose_name = "The Plug"
        verbose_name_plural = "The Plugs"

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name = "Circle"
        verbose_name_plural = "Circles"

    def __str__(self):
        return self.name

class Product(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    is_awoof = models.BooleanField(default=False)
    discount_percentage = models.PositiveIntegerField(default=0) # Only used if is_awoof is True
    campus_delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    waybill_delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    image2 = models.ImageField(upload_to='products/', blank=True, null=True)
    image3 = models.ImageField(upload_to='products/', blank=True, null=True)
    image4 = models.ImageField(upload_to='products/', blank=True, null=True)
    image5 = models.ImageField(upload_to='products/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "The Drop"
        verbose_name_plural = "The Drops"

    def __str__(self):
        return self.name

class PayoutRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]

    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='payout_requests')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    bank_details = models.TextField(blank=True, null=True) # Mock: In real app, use a BankAccount model

    def __str__(self):
        return f"Payout of {self.amount} for {self.store.name} ({self.status})"
