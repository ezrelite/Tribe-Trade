from rest_framework import serializers
from .models import Store, Category, Product, PayoutRequest

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug')

class StoreSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    institution_name = serializers.CharField(source='institution.name', read_only=True)

    class Meta:
        model = Store
        fields = ('id', 'owner_email', 'institution', 'institution_name', 'name', 'wallet_balance', 'escrow_balance')
        read_only_fields = ('id', 'owner_email', 'wallet_balance', 'escrow_balance')

class ProductSerializer(serializers.ModelSerializer):
    store_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    institution_name = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('id', 'store', 'store_name', 'category', 'category_name', 'institution_name', 'name', 'price', 'description', 'is_awoof', 'discount_percentage', 'campus_delivery_fee', 'waybill_delivery_fee', 'image', 'image2', 'image3', 'image4', 'image5', 'created_at')
        read_only_fields = ('id', 'created_at', 'store')

    def get_store_name(self, obj):
        return obj.store.name if obj.store else "Unknown Store"

    def get_category_name(self, obj):
        return obj.category.name if obj.category else "Uncategorized"

    def get_institution_name(self, obj):
        return obj.store.institution.name if obj.store and obj.store.institution else "Tribe"

    def validate_campus_delivery_fee(self, value):
        if value < 0:
            raise serializers.ValidationError("Campus delivery fee cannot be negative.")
        return value

    def validate_waybill_delivery_fee(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Waybill delivery fee cannot be negative.")
        return value

    def validate_discount_percentage(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Discount percentage must be between 0 and 100.")
        return value

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value

class PayoutRequestSerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source='store.name', read_only=True)

    class Meta:
        model = PayoutRequest
        fields = ('id', 'store', 'store_name', 'amount', 'status', 'created_at', 'bank_details')
        read_only_fields = ('id', 'store', 'status', 'created_at')

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Payout amount must be greater than zero.")
        return value
