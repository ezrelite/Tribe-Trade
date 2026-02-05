from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    verbose_name = "TribeGuard Item"
    verbose_name_plural = "TribeGuard Items"

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'total_amount', 'payment_ref', 'created_at')
    inlines = [OrderItemInline]
    search_fields = ('payment_ref', 'customer__email')

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'store', 'status', 'tribeguard_status')
    list_filter = ('status', 'tribeguard_status', 'store')
