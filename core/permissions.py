from rest_framework import permissions

class IsPlug(permissions.BasePermission):
    """
    Allows access only to users who are marked as plugs.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_plug)

class IsStoreOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a store to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.owner == request.user

class IsProductOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of the store a product belongs to, to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.store.owner == request.user
