# Tribe Trade

**The definitive campus marketplace secured by TribeGuard Escrow.**

Tribe Trade is a high-performance marketplace engineered specifically for campus ecosystems. It establishes a trusted bridge between student buyers and entrepreneurs through a focus on security, visual excellence, and seamless transaction management.

---

## Key Features

**TribeGuard Escrow**
Transaction security is handled by an integrated escrow system. Funds are held securely by the Tribe Council and only released once the buyer confirms satisfactory receipt of the product.

**Specialized User Roles**
The platform offers tailored experiences for Citizens (buyers) and Plugs (sellers). Each role features a dedicated dashboard designed to optimize their specific journey within the marketplace.

**Premium Liquid Glass Interface**
A state-of-the-art glassmorphic UI built with React and Framer Motion. The interface provides a premium, responsive experience with smooth micro-interactions that elevate the standard of campus commerce.

**Integrated Financial Management**
The built-in Wallet allows users to track escrow balances, monitor available earnings, and initiate payout requests through a streamlined interface.

**Hustle HQ Dashboard**
A comprehensive command center for sellers to manage inventory, analyze sales performance, and launch promotional "Awoof" drops for maximum visibility.

**Centralized Dispute Resolution**
A dedicated mediation system handled by the Tribe Council ensures that every trade is fair and that conflicts are resolved with transparency and speed.

---

## Technical Architecture

### Backend
- **Django**: Powers the core business logic and API infrastructure.
- **Django Rest Framework**: Provides a clean, standardized interface for frontend communication.
- **SQLite**: Utilized for reliable local data persistence.
- **Flutterwave**: Integrated for secure, multi-method payment processing.

### Frontend
- **React and Vite**: Delivers a fast, modular single-page application experience.
- **Tailwind CSS**: A utility-first framework for precise, responsive styling.
- **Framer Motion**: Enables complex animations and the signature glassmorphic aesthetic.
- **Lucide**: A consistent, professional iconography set.

---

## Installation and Setup

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher

### Initialization
Begin by cloning the repository and navigating to the project root:
```bash
git clone https://github.com/ezrelite/Tribe-Trade.git
cd Tribe-Trade
```

### Backend Configuration
1. **Initialize the Virtual Environment:**
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate # Linux/Mac
   ```
2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Environment Setup:**
   - Create a `.env` file in the root directory.
   - Refer to `.env.example` for required variables, including your Django secret key and Flutterwave credentials.
4. **Launch the Server:**
   ```bash
   python manage.py migrate
   python manage.py runserver
   # Alternatively, use the provided helper: .\run_backend.bat
   ```

### Frontend Configuration
1. **Navigate to the Frontend Directory:**
   ```bash
   cd frontend
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Start the Development Server:**
   ```bash
   npm run dev
   # Alternatively, use the provided helper from the root: .\run_frontend.bat
   ```

---

## Contribution Guidelines
The Tribe Trade project welcomes contributions from the community. If you are interested in improving the platform:
1. Fork the repository.
2. Create a specific feature branch for your work.
3. Commit your changes with clear, descriptive messages.
4. Push your branch to the remote repository.
5. Open a Pull Request for review.

---

## License
This project is licensed under the MIT License. Refer to the LICENSE file for full details.

Developed for the Tribe.
