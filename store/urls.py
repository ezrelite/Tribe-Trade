from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StoreViewSet, ProductViewSet, MarketplaceProductViewSet, CategoryListView, PayoutRequestViewSet

router = DefaultRouter()
router.register(r'hustle-hq', StoreViewSet, basename='store')
router.register(r'my-drops', ProductViewSet, basename='product')
router.register(r'payouts', PayoutRequestViewSet, basename='payout')
router.register(r'marketplace', MarketplaceProductViewSet, basename='marketplace')

urlpatterns = [
    path('', include(router.urls)),
    path('circles/', CategoryListView.as_view(), name='circle-list'),
]
