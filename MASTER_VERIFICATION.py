import requests
import json
import time
from decimal import Decimal

BASE_URL = "http://localhost:8000/api"

class TribeTester:
    def __init__(self):
        self.ts = int(time.time())
        self.plug_data = {
            "username": f"plug_{self.ts}",
            "email": f"plug_{self.ts}@tribe.com",
            "password": "SecurePass123!",
            "is_plug": True,
            "is_citizen": False
        }
        self.citizen_data = {
            "username": f"citizen_{self.ts}",
            "email": f"citizen_{self.ts}@tribe.com",
            "password": "SecurePass123!",
            "is_plug": False,
            "is_citizen": True
        }
        self.tokens = {}
        self.ids = {}

    def log(self, msg, status="INFO"):
        icons = {"INFO": "[INFO]", "PASS": "[PASS]", "FAIL": "[FAIL]", "STEP": ">>>"}
        print(f"{icons.get(status, '[?]')} {msg}")

    def run_all(self):
        try:
            self.test_registration()
            self.test_store_setup()
            self.test_drop_creation()
            self.test_marketplace_browsing()
            self.test_ordering_and_escrow()
            self.test_payout_lifecycle()
            self.log("MASTER VERIFICATION COMPLETE: ALL SYSTEMS NOMINAL", "PASS")
        except Exception as e:
            self.log(f"VERIFICATION FAILED: {str(e)}", "FAIL")
            raise e

    def test_registration(self):
        self.log("Phase 1: Registration", "STEP")
        
        # Plug Reg
        resp = requests.post(f"{BASE_URL}/users/register/", json=self.plug_data)
        if resp.status_code != 201: raise Exception(f"Plug Reg Failed: {resp.text}")
        self.tokens['plug'] = resp.json()['token']
        self.log(f"Plug registered: {self.plug_data['username']}", "PASS")

        # Citizen Reg
        resp = requests.post(f"{BASE_URL}/users/register/", json=self.citizen_data)
        if resp.status_code != 201: raise Exception(f"Citizen Reg Failed: {resp.text}")
        self.tokens['citizen'] = resp.json()['token']
        self.log(f"Citizen registered: {self.citizen_data['username']}", "PASS")

    def test_store_setup(self):
        self.log("Phase 2: Store Setup", "STEP")
        headers = {"Authorization": f"Token {self.tokens['plug']}"}
        
        # Create Store
        store_data = {
            "name": f"{self.plug_data['username']}'s Vault",
            "institution": 1 # ABU (Assuming seeded)
        }
        resp = requests.post(f"{BASE_URL}/store/stores/", json=store_data, headers=headers)
        if resp.status_code != 201: raise Exception(f"Store Creation Failed: {resp.text}")
        self.ids['store'] = resp.json()['id']
        self.log(f"Store created: {store_data['name']}", "PASS")

    def test_drop_creation(self):
        self.log("Phase 3: Drop Creation", "STEP")
        headers = {"Authorization": f"Token {self.tokens['plug']}"}
        
        # Ensure category exists
        cat_resp = requests.get(f"{BASE_URL}/store/categories/")
        if not cat_resp.json():
            # If no categories, this might fail unless we seed
            self.log("No categories found. Testing needs seeded categories.", "INFO")
        
        drop_data = {
            "name": f"Elite Mech Keyboard {self.ts}",
            "price": "45000.00",
            "category": 1, 
            "is_awoof": True
        }
        resp = requests.post(f"{BASE_URL}/store/products/", json=drop_data, headers=headers)
        if resp.status_code != 201: raise Exception(f"Drop Creation Failed: {resp.text}")
        self.ids['product'] = resp.json()['id']
        self.log(f"Drop created: {drop_data['name']} @ {drop_data['price']}", "PASS")

    def test_marketplace_browsing(self):
        self.log("Phase 4: Marketplace Discovery", "STEP")
        resp = requests.get(f"{BASE_URL}/store/marketplace/")
        if resp.status_code != 200: raise Exception("Marketplace Access Failed")
        
        products = resp.json()
        found = any(p['id'] == self.ids['product'] for p in products)
        if not found: raise Exception("New product not found in marketplace")
        self.log("Marketplace verified: New drop is visible", "PASS")

    def test_ordering_and_escrow(self):
        self.log("Phase 5: Ordering & TribeGuard Escrow", "STEP")
        citizen_headers = {"Authorization": f"Token {self.tokens['citizen']}"}
        plug_headers = {"Authorization": f"Token {self.tokens['plug']}"}

        # 1. Create Order
        order_data = {
            "total_amount": "45000.00",
            "payment_ref": f"REF_{self.ts}",
            "items": [
                {
                    "product": self.ids['product'],
                    "quantity": 1,
                    "store": self.ids['store']
                }
            ]
        }
        resp = requests.post(f"{BASE_URL}/orders/orders/", json=order_data, headers=citizen_headers)
        if resp.status_code != 201: raise Exception(f"Order Creation Failed: {resp.text}")
        order_id = resp.json()['id']
        order_item_id = resp.json()['items'][0]['id']
        self.log(f"Order {order_id} created. Funds LOCKED in TribeGuard.", "PASS")

        # 2. Verify Escrow Balance for Plug
        store_resp = requests.get(f"{BASE_URL}/store/stores/{self.ids['store']}/", headers=plug_headers)
        escrow_bal = Decimal(store_resp.json()['escrow_balance'])
        if escrow_bal != Decimal('45000.00'):
            raise Exception(f"Escrow balance mismatch. Found {escrow_bal}")
        self.log("Escrow balance verified on Plug side.", "PASS")

        # 3. Mark as Delivered (Plug)
        resp = requests.post(f"{BASE_URL}/orders/plug-order-items/{order_item_id}/mark-delivered/", headers=plug_headers)
        if resp.status_code != 200: raise Exception(f"Mark Delivered Failed: {resp.text}")
        self.log("Plug marked item as DELIVERED.", "PASS")

        # 4. Confirm Received (Citizen) -> Releasing Funds
        resp = requests.post(f"{BASE_URL}/orders/citizen-order-items/{order_item_id}/confirm-received/", headers=citizen_headers)
        if resp.status_code != 200: raise Exception(f"Confirm Received Failed: {resp.text}")
        self.log("Citizen confirmed receipt. TribeGuard RELEASED funds.", "PASS")

        # 5. Verify Wallet Balances (5% Commission check)
        store_resp = requests.get(f"{BASE_URL}/store/stores/{self.ids['store']}/", headers=plug_headers)
        wallet_bal = Decimal(store_resp.json()['wallet_balance'])
        expected_bal = Decimal('45000.00') * Decimal('0.95')
        if wallet_bal != expected_bal:
            raise Exception(f"Wallet balance mismatch. Expected {expected_bal}, Found {wallet_bal}")
        self.log(f"Wallet balance verified: {wallet_bal} (Correct after 5% Tribe tax).", "PASS")

    def test_payout_lifecycle(self):
        self.log("Phase 6: Payout Lifecycle", "STEP")
        headers = {"Authorization": f"Token {self.tokens['plug']}"}
        
        payout_data = {
            "amount": "10000.00",
            "bank_details": "GTBank 0123456789 (Test Plug)"
        }
        resp = requests.post(f"{BASE_URL}/store/payout-requests/", json=payout_data, headers=headers)
        if resp.status_code != 201: raise Exception(f"Payout Request Failed: {resp.text}")
        
        # Verify wallet balance deducted
        store_resp = requests.get(f"{BASE_URL}/store/stores/{self.ids['store']}/", headers=headers)
        final_bal = Decimal(store_resp.json()['wallet_balance'])
        expected_bal = (Decimal('45000.00') * Decimal('0.95')) - Decimal('10000.00')
        if final_bal != expected_bal:
             raise Exception("Wallet balance not deducted after payout request.")
        self.log(f"Payout requested and balance deducted: {final_bal} remaining.", "PASS")

if __name__ == "__main__":
    tester = TribeTester()
    tester.run_all()
