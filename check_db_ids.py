import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tribe_trade_backend.settings')
django.setup()

from store.models import Product, Store
print("--- STORES ---")
for s in Store.objects.all():
    print(f"ID: {s.id}, Name: {s.name}")

print("\n--- PRODUCTS ---")
for p in Product.objects.all():
    print(f"ID: {p.id}, Name: {p.name}, Store: {p.store.name} (ID: {p.store.id})")
