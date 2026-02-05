import requests
import json
import sys
import time

BASE_URL = "http://localhost:8000/api"

def print_result(step, success, details=""):
    status = "[PASS]" if success else "[FAIL]"
    print(f"{status} - {step}")
    if details:
        print(f"   Details: {details}")
    if not success:
        sys.exit(1)

def run_verification():
    print("Starting Comprehensive Logic Verification...")
    
    # Generate unique user data
    timestamp = int(time.time())
    citizen_email = f"citizen{timestamp}@example.com"
    citizen_user = f"citizen{timestamp}"
    plug_email = f"plug{timestamp}@example.com"
    plug_user = f"plug{timestamp}"
    password = "SecurePass123!"
    
    # 1. Register Citizen
    print(f"\n1. Registering Citizen ({citizen_user})...")
    resp = requests.post(f"{BASE_URL}/users/register/", json={
        "username": citizen_user,
        "email": citizen_email,
        "password": password,
        "is_plug": False,
        "is_citizen": True
    })
    print_result("Citizen Registration", resp.status_code == 201, resp.text if resp.status_code != 201 else "")
    citizen_token = resp.json()['token']

    # 2. Register Plug
    print(f"\n2. Registering Plug ({plug_user})...")
    resp = requests.post(f"{BASE_URL}/users/register/", json={
        "username": plug_user,
        "email": plug_email,
        "password": password,
        "is_plug": True,
        "is_citizen": False,
        "institution": 1 # Assuming ID 1 exists (ABU)
    })
    print_result("Plug Registration", resp.status_code == 201, resp.text if resp.status_code != 201 else "")
    plug_token = resp.json()['token']
    
    # 3. Plug creates a product (Drop)
    print("\n3. Plug creating a Drop...")
    headers_plug = {"Authorization": f"Token {plug_token}"}
    drop_data = {
        "name": f"Test Drop {timestamp}",
        "description": "A test product verification",
        "price": "5000.00",
        "stock_quantity": 5,
        "category": "GADGETS",
        "condition": "NEW"
    }

    resp = requests.post(f"{BASE_URL}/store/drops/", json=drop_data, headers=headers_plug)
    # If 400 because of formatting (multipart), we retry with requests.post(..., data=...)
    if resp.status_code == 415 or "multipart" in resp.text.lower():
        resp = requests.post(f"{BASE_URL}/store/drops/", data=drop_data, headers=headers_plug)
        
    print_result("Create Drop", resp.status_code == 201, resp.text if resp.status_code != 201 else "")
    drop_id = resp.json()['id']
    
    # 4. Citizen Views Marketplace (List Drops)
    print("\n4. Citizen adding to cart...")
    headers_citizen = {"Authorization": f"Token {citizen_token}"}
    resp = requests.get(f"{BASE_URL}/store/marketplace/", headers=headers_citizen)
    print_result("View Marketplace", resp.status_code == 200)
    
    # 5. Citizen Creates Order (Checkout)
    print("\n5. Citizen Checkout...")
    order_data = {
        "items": [{"id": drop_id, "quantity": 1}]
    }
    resp = requests.post(f"{BASE_URL}/orders/citizen-orders/", json=order_data, headers=headers_citizen)
    print_result("Create Order", resp.status_code == 201, resp.text if resp.status_code != 201 else "")
    
    print("\nAll logic verification steps passed successfully!")

if __name__ == "__main__":
    try:
        run_verification()
    except Exception as e:
        print(f"\nScript Error: {e}")
        sys.exit(1)
