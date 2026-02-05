import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tribe_trade_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("Listing all registered users:")
for user in User.objects.all():
    print(f"Email: '{user.email}', Username: '{user.username}', Hashed: {user.password.startswith('pbkdf2')}")
