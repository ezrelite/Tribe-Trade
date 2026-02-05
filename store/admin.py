from django.contrib import admin
from .models import Store, Category, Product, PayoutRequest

@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'institution', 'wallet_balance', 'escrow_balance')
    search_fields = ('name', 'owner__email')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'store', 'category', 'price', 'is_awoof')
    list_filter = ('is_awoof', 'category', 'store')
    search_fields = ('name', 'store__name')

@admin.register(PayoutRequest)
class PayoutRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'store', 'amount', 'status', 'created_at')
    list_filter = ('status', 'store')
    search_fields = ('store__name',)
