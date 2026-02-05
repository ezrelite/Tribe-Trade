from rest_framework import serializers
from .models import Order, OrderItem
from store.models import Product, Store

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    store_name = serializers.CharField(source='store.name', read_only=True)
    customer_username = serializers.CharField(source='order.customer.username', read_only=True)
    citizen_name = serializers.CharField(source='order.customer.username', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(source='order.created_at', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'store', 'store_name', 'customer_username', 'citizen_name', 'quantity', 'status', 'tribeguard_status', 'price', 'total_price', 'created_at')
        read_only_fields = ('id', 'status', 'tribeguard_status')

    def get_total_price(self, obj):
        return obj.product.price * obj.quantity

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer_email = serializers.EmailField(source='customer.email', read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'customer', 'customer_email', 'total_amount', 'payment_ref', 'is_paid', 'delivery_method', 'delivery_address', 'delivery_phone', 'created_at', 'items')
        read_only_fields = ('id', 'customer', 'created_at', 'is_paid')

    def validate_delivery_method(self, value):
        if value in ['TRIBE_RUNNER', 'TRIBE_LOGISTICS']:
            raise serializers.ValidationError("This delivery method is coming soon and cannot be used yet.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        order = Order.objects.create(customer=user, **validated_data)
        
        for item_data in items_data:
            # Note: In a real app, we would verify the store matches the product
            OrderItem.objects.create(order=order, **item_data)
            
        return order
