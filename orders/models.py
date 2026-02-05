from django.db import models
from django.conf import settings

class Order(models.Model):
    DELIVERY_CHOICES = [
        ('MEETUP', 'Meet on Campus'),
        ('PLUG_DELIVERY', 'Plug Delivery'),
        ('TRIBE_RUNNER', 'Tribe Runner'),
        ('WAYBILL', 'Plug Waybill'),
        ('TRIBE_LOGISTICS', 'Tribe Logistics'),
    ]

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_ref = models.CharField(max_length=100, unique=True)
    is_paid = models.BooleanField(default=False)
    delivery_method = models.CharField(max_length=20, choices=DELIVERY_CHOICES, default='MEETUP')
    delivery_address = models.TextField(blank=True, null=True)
    delivery_phone = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.customer.email}"

class OrderItem(models.Model):
    STATUS_CHOICES = [
        ('RECEIVED', 'Received'),
        ('PROCESSING', 'Processing'),
        ('DELIVERED', 'Delivered'),
        ('DISPUTED', 'Disputed'),
    ]

    TRIBEGUARD_CHOICES = [
        ('LOCKED', 'Locked'),
        ('RELEASED', 'Released'),
        ('REFUNDED', 'Refunded'),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('store.Product', on_delete=models.CASCADE)
    store = models.ForeignKey('store.Store', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='RECEIVED')
    tribeguard_status = models.CharField(max_length=20, choices=TRIBEGUARD_CHOICES, default='LOCKED')

    def __str__(self):
        return f"{self.product.name} in Order {self.order.id}"
