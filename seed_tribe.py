import os
import django
from decimal import Decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tribe_trade_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.models import Institution, CampusLocation
from store.models import Store, Category, Product

User = get_user_model()

def seed_data():
    print("--- Seeding Tribe Trade Database ---")

    # Cleanup existing test data to avoid integrity errors
    Institution.objects.filter(slug__in=["unilag", "covenant"]).delete()
    Category.objects.filter(slug__in=["fashion", "tech", "food", "electronics"]).delete()
    User.objects.filter(email__in=["tade@plug.com", "tobi@plug.com"]).delete()

    # 1. Institutions (Universities)
    unilag, _ = Institution.objects.get_or_create(name="University of Lagos", slug="unilag")
    covenant, _ = Institution.objects.get_or_create(name="Covenant University", slug="covenant")
    print(f"Created Institutions: {unilag.name}, {covenant.name}")

    # 2. Campus Locations
    moremi, _ = CampusLocation.objects.get_or_create(institution=unilag, name="Moremi Hall")
    shodeinde, _ = CampusLocation.objects.get_or_create(institution=unilag, name="Shodeinde Hall")
    hebron, _ = CampusLocation.objects.get_or_create(institution=covenant, name="Hebron")
    dorcas, _ = CampusLocation.objects.get_or_create(institution=covenant, name="Dorcas Hall")
    print(f"Created Locations: Moremi, Shodeinde, Hebron, Dorcas")

    # 3. Categories (Circles)
    fashion, _ = Category.objects.get_or_create(name="Fashion Circle", slug="fashion")
    tech, _ = Category.objects.get_or_create(name="Tech Circle", slug="tech")
    food, _ = Category.objects.get_or_create(name="Food Circle", slug="food")
    print(f"Created Circles: Fashion, Tech, Food")

    # 4. Plugs (Vendors)
    tade, created = User.objects.get_or_create(
        email="tade@plug.com", 
        defaults={"username": "tade_plug", "is_plug": True, "has_greencheck": True}
    )
    if created:
        tade.set_password("password123")
        tade.save()
    
    tade_store, _ = Store.objects.get_or_create(
        owner=tade, 
        defaults={"institution": unilag, "name": "Tade's Tech Shop"}
    )

    tobi, created = User.objects.get_or_create(
        email="tobi@plug.com", 
        defaults={"username": "tobi_styles", "is_plug": True, "has_greencheck": True}
    )
    if created:
        tobi.set_password("password123")
        tobi.save()

    tobi_store, _ = Store.objects.get_or_create(
        owner=tobi, 
        defaults={"institution": covenant, "name": "Tobi's Fashion Hub"}
    )
    print(f"Created Plugs: {tade.username}, {tobi.username}")

    # 5. Drops (Products)
    # Tade's Drops (Tech)
    Product.objects.get_or_create(
        store=tade_store, 
        name="MacBook Pro M2", 
        defaults={"price": Decimal('450000.00'), "category": tech, "is_awoof": False}
    )
    Product.objects.get_or_create(
        store=tade_store, 
        name="AirPods Pro 2", 
        defaults={"price": Decimal('120000.00'), "category": tech, "is_awoof": True}
    )

    # Tobi's Drops (Fashion)
    Product.objects.get_or_create(
        store=tobi_store, 
        name="Vintage Oversized Tee", 
        defaults={"price": Decimal('8500.00'), "category": fashion, "is_awoof": False}
    )
    Product.objects.get_or_create(
        store=tobi_store, 
        name="Denim Jacket", 
        defaults={"price": Decimal('15000.00'), "category": fashion, "is_awoof": True}
    )
    print(f"Created 4 Drops successfully.")

    print("\n--- Seeding Complete! Launch your Tribe. ---")

if __name__ == "__main__":
    seed_data()
