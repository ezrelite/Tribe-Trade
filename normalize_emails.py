import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tribe_trade_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("Checking for mixed-case emails...")
updated_count = 0
for user in User.objects.all():
    original_email = user.email
    lower_email = original_email.lower().strip()
    if original_email != lower_email:
        print(f"Normalizing: '{original_email}' -> '{lower_email}'")
        user.email = lower_email
        # Also update username if it's the same as email
        if user.username == original_email:
            user.username = lower_email
        user.save()
        updated_count += 1

print(f"Finished normalization. Updated {updated_count} users.")
