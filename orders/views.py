from decimal import Decimal
from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from django.db import transaction
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer

class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Citizens to manage their orders.
    """
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user).prefetch_related('items')

    def perform_create(self, serializer):
        if self.request.user.is_plug:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Plugs are restricted from placing orders. Use a Citizen account.")
        serializer.save(customer=self.request.user)

class PlugOrderItemViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Vendors (Plugs) to see items ordered from their store.
    """
    serializer_class = OrderItemSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return OrderItem.objects.filter(store__owner=self.request.user)

    @decorators.action(detail=True, methods=['post'], url_path='mark-delivered')
    def mark_delivered(self, request, pk=None):
        item = self.get_object()
        if item.status != 'RECEIVED' and item.status != 'PROCESSING':
            return Response({"error": "Item state prevents this action"}, status=status.HTTP_400_BAD_REQUEST)
        
        item.status = 'DELIVERED'
        item.save()
        return Response(OrderItemSerializer(item).data)

class CitizenOrderItemViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Citizens to confirm receipt of specific items.
    """
    serializer_class = OrderItemSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return OrderItem.objects.filter(order__customer=self.request.user)

    @decorators.action(detail=True, methods=['post'], url_path='confirm-received')
    def confirm_received(self, request, pk=None):
        item = self.get_object()
        if item.status != 'DELIVERED':
            return Response({"error": "Item must be marked as delivered by the Plug first"}, status=status.HTTP_400_BAD_REQUEST)
        if item.tribeguard_status == 'RELEASED':
            return Response({"error": "Funds already released"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            item.tribeguard_status = 'RELEASED'
            item.save()

            # TribeGuard Logic: Move funds from Escrow to Wallet (minus 5% commission)
            store = item.store
            total_amount = item.product.price * item.quantity
            commission = total_amount * Decimal('0.03')
            vendor_amount = total_amount - commission
            
            store.escrow_balance -= total_amount
            store.wallet_balance += vendor_amount
            store.save()

        return Response(OrderItemSerializer(item).data)

    @decorators.action(detail=True, methods=['post'], url_path='raise-dispute')
    def raise_dispute(self, request, pk=None):
        item = self.get_object()
        if item.status != 'PENDING' and item.status != 'PROCESSING' and item.status != 'DELIVERED':
            return Response({"error": "Cannot dispute an item in this state"}, status=status.HTTP_400_BAD_REQUEST)
        
        item.status = 'DISPUTED'
        item.save()
        return Response(OrderItemSerializer(item).data)

class AdminDisputeViewSet(viewsets.ModelViewSet):
    """
    Council HQ FairPlay Center: Manage Disputes.
    """
    serializer_class = OrderItemSerializer
    permission_classes = (permissions.IsAdminUser,)

    def get_queryset(self):
        return OrderItem.objects.filter(status='DISPUTED')

    @decorators.action(detail=True, methods=['post'], url_path='resolve-refund')
    def resolve_refund(self, request, pk=None):
        item = self.get_object()
        with transaction.atomic():
            item.status = 'PENDING' # Reset or mark as refunded
            item.tribeguard_status = 'REFUNDED'
            item.save()

            # Release from Escrow (Logic: In real app, return to buyer wallet)
            store = item.store
            total_amount = item.product.price * item.quantity
            store.escrow_balance -= total_amount
            store.save()

        return Response(OrderItemSerializer(item).data)

    @decorators.action(detail=True, methods=['post'], url_path='resolve-release')
    def resolve_release(self, request, pk=None):
        item = self.get_object()
        with transaction.atomic():
            item.status = 'DELIVERED' # Mark as settled
            item.tribeguard_status = 'RELEASED'
            item.save()

            # Give to Vendor
            store = item.store
            total_amount = item.product.price * item.quantity
            commission = total_amount * Decimal('0.03')
            vendor_amount = total_amount - commission
            
            store.escrow_balance -= total_amount
            store.wallet_balance += vendor_amount
            store.save()

        return Response(OrderItemSerializer(item).data)
