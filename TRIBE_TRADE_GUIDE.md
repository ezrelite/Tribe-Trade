# 🛡️ Tribe Trade: The Ultimate User Guide

Welcome to **Tribe Trade**, the safest campus marketplace powered by **TribeGuard Escrow**. This guide walks you through the entire experience, from a fresh signup to successful trades and payouts.

---

## 🚀 Getting Started

### 1. Launch the Tribe HQ
Before you can enter the marketplace, ensure the local servers are running:
*   **Backend**: Run `run_backend.bat` from the root folder.
*   **Frontend**: Run `run_frontend.bat` from the root folder.
*   **Accessing from Laptop**: Open `http://localhost:5173`.
*   **Accessing from Phone**: 
    1.  Ensure both are on the same WiFi.
    2.  Find your laptop's Local IP (run `ipconfig` in CMD, look for `IPv4 Address`).
    3.  Open `http://192.168.8.101:5173` on your phone.

### 1b. Alternative: Using Ngrok (Remote Access)
If your WiFi is blocking local connections, use Ngrok to create a secure tunnel.
1.  **Install Ngrok**: Download it from `ngrok.com` and authenticate it (`ngrok config add-authtoken <TOKEN>`).
2.  **Start Backend Tunnel**: In a new terminal, run:
    ```bash
    ngrok http 8000
    ```
    Copy the `Forwarding` URL (e.g., `https://xyz.ngrok-free.app`).
3.  **Start Frontend Tunnel**: In another terminal, run:
    ```bash
    ngrok http 5173
    ```
    Copy this URL too (e.g., `https://abc.ngrok-free.app`).
4.  **Connect Them**: 
    -   Open the **Frontend** URL on your phone's browser.
    -   Open the browser console (or I can help you set it) and run:
        `localStorage.setItem('tribe_api_url', 'https://your-backend-url.ngrok-free.app/api')`
    -   Refresh the page.

    > [!TIP]
    > If you don't want to run commands, just **give me the Backend Ngrok URL** and I will hardcode it into the system for you temporarily!

    > [!IMPORTANT]
    > **Mobile Debugging List**:
    > *   **Target Check**: If you see `localhost:8000` in the "Debug Pulse" on your phone, your browser is using a cached version. **Clear your mobile browser cache** or use **Incognito Mode**.
    > *   **Firewall**: Ensure your laptop's firewall isn't blocking port **8000**. (Search "Allow an app through Windows Firewall").
    > *   **No PWA**: If you "Added to Home Screen" earlier, delete that icon and try the IP address fresh in the browser.

### 2. Physical & Spiritual Onboarding
*   **Welcome Screen**: You'll be greeted by the Tribe manifesto.
*   **Identity Creation**: Click **"Join the Tribe"** to reach the Signup page.
*   **Pick Your Role**:
    *   **Citizen**: You're here to hunt for the best drops (Buyer).
    *   **The Plug**: You're here to list items and stack bags (Seller).

---

## 🔌 The Plug's Journey (Seller Flow)

If you're here to sell, your home is the **Hustle HQ**.

### Step 1: Set Up Your Shop
Once logged in, navigate to **Hustle HQ** (the dashboard icon). From here, you can manage your inventory and see your earnings pulse.

### Step 2: Launch a New Drop
1.  Click **"Add Drop"** in the sidebar menu (or go to **"Inventory"** and click **"Create New"**).
2.  **Basic Details**: Enter the name and price of your item.
3.  **Circle Selection**: Choose a category (e.g., Electronics, Fashion) to list it in the right "Circle".
4.  **Awoof Mode**: Toggle this if you're offering an unbeatable deal – it gives your drop extra visibility!
5.  **Submit**: Your drop is now live in the global Marketplace.

---

## 🛒 The Citizen's Hunt (Buyer Flow)

As a Citizen, the **Marketplace** is your playground.

### Step 1: Scout for Drops
1.  Browse the **Marketplace** grid.
2.  Use **Circles** (categories) to filter items or use the **Search Bar** to find something specific.
3.  Items marked with **"AWOOF"** are high-value deals!

### Step 2: Inspect & Commit
1.  Click on any item to view its **Drop Detail**.
2.  Check the "Verified Badge" and "Plug" details.
3.  Click **"Purchase Product"**.

### Step 3: TribeGuard Activation (Escrow)
1.  In the **Checkout** screen, choose your **Delivery Protocol**:
    *   **Meet on Campus**: Standard handshake deal.
    *   **Tribe Runner**: A runner brings it to you for a small fee.
2.  **Authorize Payment**: When you pay, funds ARE NOT sent to the seller immediately. They are held by the **Tribe Council** (TribeGuard).

---

## 💎 The Trade Completion

### Step 1: Receiving the Drop
Meet the seller and inspect your item. Once it's in your hands:
1.  Go to your **"Orders"** screen.
2.  Find the active order and click **"Confirm Receipt"**.

### Step 2: Releasing the Bag
The moment you confirm, **TribeGuard Shields** are lowered, and the funds move from the Escrow bag to the Seller's **Available Bag**.

---

## 💰 Managing the Bag (Wallet)

Sellers can manage their earnings in the **Wallet** (within Hustle HQ Payouts):
*   **Escrow Balance**: Money currently "locked" while orders are being delivered.
*   **Available Bag**: Money you can withdraw.
*   **Cash Out**: Enter your bank details and the amount to request a payout. Funds typically arrive within 24 hours.

---

## 🛠️ Troubleshooting & Disputes
If a drop goes sour (the item isn't as described or a seller goes ghost):
*   Navigate to **"Orders"**.
*   Click **"Dispute Drop"** instead of confirming.
*   The **Tribe Council** will step in to mediate the trade.

---
**Happy Trading, Tribe!** 🛡️✨
