from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'is_citizen', 'is_plug', 'has_greencheck')
    fieldsets = UserAdmin.fieldsets + (
        ('Tribe Status', {'fields': ('is_plug', 'is_citizen', 'has_greencheck', 'phone_number')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.site_header = "Tribe Council HQ"
admin.site.site_title = "Tribe Trade Admin"
admin.site.index_title = "Welcome to the Tribe Council"
