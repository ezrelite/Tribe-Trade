# 🛡️ Tribe Trade

**The safest campus marketplace powered by TribeGuard Escrow.**

Tribe Trade is a modern, high-performance marketplace designed specifically for campus ecosystems. It bridges the gap between students ("Citizens") and student entrepreneurs ("Plugs") with a focus on trust, visual excellence, and secure transactions.

---

## ✨ Key Features

-   **🛡️ TribeGuard Escrow**: Secure, real-time protection for every trade. Funds are held by the Tribe Council until the buyer confirms receipt.
-   **🔌 Roles (Citizen & Plug)**: Specialized dashboards for buyers to hunt drops and sellers to manage their hustle.
-   **💎 Premium Liquid Glass UI**: A state-of-the-art, glassmorphic interface built with Framer Motion for smooth, premium interactions.
-   **💰 Integrated Wallet**: Real-time tracking of escrow balances and available earnings with seamless payout requests.
-   **📦 Hustle HQ**: A powerful dashboard for sellers (Plugs) to manage inventory, analyze performance, and launch "Awoof" drops.
-   **⚖️ Dispute Center**: Built-in mediation handled by the Tribe Council to ensure fairness across all trades.

---

## 🛠️ Technology Stack

### Backend
-   **Django (Python)**: Robust API and business logic.
-   **Django Rest Framework (DRF)**: Seamless API endpoints.
-   **SQLite**: Reliable local database (designed to be replaceable for production).
-   **Flutterwave Integration**: Secure payment processing.

### Frontend
-   **React + Vite**: High-performance single-page application.
-   **Tailwind CSS**: Modern, responsive styling.
-   **Framer Motion**: Smooth glassmorphic animations and micro-interactions.
-   **Lucide React**: Clean, consistent iconography.

---

## 🚀 Getting Started

### Prerequisites
-   Python 3.10+
-   Node.js 18+

### 1. Project Setup
Clone the repository and enter the root directory:
```bash
git clone https://github.com/ezrelite/Tribe-Trade.git
cd Tribe-Trade
```

### 2. Backend Installation
1.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    .\venv\Scripts\activate  # Windows
    source venv/bin/activate # Linux/Mac
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure environment variables:
    -   Create a `.env` file in the root based on [.env.example](.env.example).
    -   Add your `DJANGO_SECRET_KEY` and Flutterwave keys.
4.  Run migrations and start the server:
    ```bash
    python manage.py migrate
    python manage.py runserver
    # Or use the helper: .\run_backend.bat
    ```

### 3. Frontend Installation
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    # Or use the helper from root: .\run_frontend.bat
    ```

---

## 🤝 Contributing
Welcome to the Tribe! If you want to improve the marketplace:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

Developed for the Tribe. 🛡️✨
