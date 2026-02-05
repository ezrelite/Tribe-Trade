from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, PlugOrderItemViewSet, CitizenOrderItemViewSet, AdminDisputeViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'plug-items', PlugOrderItemViewSet, basename='plug-item')
router.register(r'citizen-items', CitizenOrderItemViewSet, basename='citizen-item')
router.register(r'admin/disputes', AdminDisputeViewSet, basename='admin-dispute')

from .webhooks import flutterwave_webhook

urlpatterns = [
    path('', include(router.urls)),
    path('payments/webhook/', flutterwave_webhook, name='flutterwave-webhook'),
]
