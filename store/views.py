from rest_framework import viewsets, generics, permissions, status, parsers
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from rest_framework.exceptions import ValidationError
from core.permissions import IsPlug, IsStoreOwner, IsProductOwner
from .models import Store, Category, Product, PayoutRequest
from .serializers import StoreSerializer, CategorySerializer, ProductSerializer, PayoutRequestSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.AllowAny,)

class StoreViewSet(viewsets.ModelViewSet):
    serializer_class = StoreSerializer
    permission_classes = (permissions.IsAuthenticated, IsPlug, IsStoreOwner)

    def get_queryset(self):
        return Store.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def my_store(self, request):
        store = Store.objects.filter(owner=request.user).first()
        if not store:
            return Response({"detail": "No store found for this user."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(store)
        return Response(serializer.data)

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = (permissions.IsAuthenticated, IsPlug, IsProductOwner)
    parser_classes = (parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser)

    def get_queryset(self):
        return Product.objects.filter(store__owner=self.request.user)

    def perform_create(self, serializer):
        try:
            store = Store.objects.get(owner=self.request.user)
            serializer.save(store=store)
        except Store.DoesNotExist:
            raise ValidationError("You do not have a store setup as a Plug. Please contact the Council.")
        except Exception as e:
            raise ValidationError(f"Council systems reported a glitch: {str(e)}")

class PayoutRequestViewSet(viewsets.ModelViewSet):
    serializer_class = PayoutRequestSerializer
    permission_classes = (permissions.IsAuthenticated, IsPlug)

    def get_queryset(self):
        return PayoutRequest.objects.filter(store__owner=self.request.user)

    def perform_create(self, serializer):
        with transaction.atomic():
            store = Store.objects.get(owner=self.request.user)
            amount = serializer.validated_data['amount']
            
            if store.wallet_balance < amount:
                raise ValidationError("Insufficient wallet balance for this payout request.")
            
            # Deduct funds immediately upon request
            store.wallet_balance -= amount
            store.save()
            
            serializer.save(store=store)

class MarketplaceProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for Citizens to browse 'The Drop'.
    Supports filtering by institution and category.
    """
    serializer_class = ProductSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = Product.objects.all()
        institution_id = self.request.query_params.get('institution')
        category_id = self.request.query_params.get('circle') # UI Term: Circle
        is_awoof = self.request.query_params.get('awoof')

        if institution_id:
            queryset = queryset.filter(store__institution_id=institution_id)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if is_awoof:
            queryset = queryset.filter(is_awoof=True)
            
        return queryset.order_by('-created_at')
