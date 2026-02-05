from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, ProfileView, SuperAdminRegisterView, SuperAdminLoginView, VerificationRequestViewSet

router = DefaultRouter()
router.register(r'verifications', VerificationRequestViewSet, basename='verification')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('super-admin/register/', SuperAdminRegisterView.as_view(), name='super-admin-register'),
    path('super-admin/login/', SuperAdminLoginView.as_view(), name='super-admin-login'),
    path('', include(router.urls)),
]
