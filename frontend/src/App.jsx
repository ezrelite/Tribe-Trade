import React, { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import CouncilLayout from './components/CouncilLayout'
import { Toaster } from 'react-hot-toast'

// Lazy Load Screens
import Welcome from './screens/Welcome'
import Login from './screens/Login'
import Signup from './screens/Signup'

// Lazy Load Others
const Marketplace = lazy(() => import('./screens/Marketplace'))
const HustleHQ = lazy(() => import('./screens/HustleHQ'))
const DropDetail = lazy(() => import('./screens/DropDetail'))
const TribeCouncil = lazy(() => import('./screens/TribeCouncil'))
const Orders = lazy(() => import('./screens/Orders'))
const Profile = lazy(() => import('./screens/Profile'))
const DropCreator = lazy(() => import('./screens/DropCreator'))
const Inventory = lazy(() => import('./screens/Inventory'))
const PublicStore = lazy(() => import('./screens/PublicStore'))
const Wallet = lazy(() => import('./screens/Wallet'))
const Settings = lazy(() => import('./screens/Settings'))
const Chat = lazy(() => import('./screens/Chat'))
const Notifications = lazy(() => import('./screens/Notifications'))
const Analytics = lazy(() => import('./screens/Analytics'))
const History = lazy(() => import('./screens/History'))
const DisputeCenter = lazy(() => import('./screens/DisputeCenter'))
const Manifesto = lazy(() => import('./screens/Manifesto'))
const Verify = lazy(() => import('./screens/Verify'))
const Checkout = lazy(() => import('./screens/Checkout'))
const Cart = lazy(() => import('./screens/Cart'))
const Success = lazy(() => import('./screens/PaymentSuccess'))
const SuperAdminSignup = lazy(() => import('./screens/SuperAdminSignup'))
const SuperAdminLogin = lazy(() => import('./screens/SuperAdminLogin'))

// Auth Guard
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('tribe_token');
    let user = {};
    try {
        user = JSON.parse(localStorage.getItem('tribe_user') || '{}');
    } catch (e) {
        user = {};
    }

    if (!token) return <Navigate to={adminOnly ? "/super-admin-login" : "/login"} replace />;

    if (adminOnly && !user.is_superuser) {
        return <Navigate to="/marketplace" replace />;
    }

    return children;
};

import TribeLoader from './components/TribeLoader'

const NavigationLoader = () => {
    const location = useLocation();
    const [show, setShow] = useState(false);
    const [loadingPath, setLoadingPath] = useState(null);

    useEffect(() => {
        // Only trigger if the path actually changed
        if (location.pathname !== loadingPath) {
            setLoadingPath(location.pathname);
            const duration = location.pathname === '/' ? 3000 : 2000;
            setShow(true);
            const timer = setTimeout(() => setShow(false), duration);
            return () => clearTimeout(timer);
        }
    }, [location.pathname]);

    if (!show) return null;
    return (
        <div className="fixed inset-0 z-[9999] bg-white/30 backdrop-blur-2xl flex items-center justify-center liquid-glass animate-liquid">
            <TribeLoader size={80} />
        </div>
    );
};

// Simple fallback for Suspense that doesn't conflict with NavigationLoader
const SuspenseLoader = () => (
    <div className="flex items-center justify-center p-20">
        <TribeLoader size={40} />
    </div>
);

import { CartProvider } from './context/CartContext'
import CartDrawer from './components/CartDrawer'

function App() {
    const user = JSON.parse(localStorage.getItem('tribe_user') || '{}');
    const isPlug = user?.is_plug;

    return (
        <CartProvider>
            <Router>
                <Toaster
                    position="top-center"
                    toastOptions={{
                        className: 'font-bold text-sm',
                        duration: 3000,
                        style: {
                            borderRadius: '1rem',
                            background: '#fff',
                            color: '#1F2937',
                            border: '1px solid #F3F4F6',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }
                    }}
                />
                {!isPlug && <CartDrawer />}
                <Suspense fallback={<SuspenseLoader />}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Welcome />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/super-admin-signup" element={<SuperAdminSignup />} />
                        <Route path="/super-admin-login" element={<SuperAdminLogin />} />

                        {/* Protected Main Layout */}
                        <Route element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }>
                            {/* Citizen Zone */}
                            <Route path="/marketplace" element={<Marketplace />} />
                            <Route path="/drop/:id" element={<DropDetail />} />
                            <Route path="/cart" element={isPlug ? <Navigate to="/hq/drops" replace /> : <Cart />} />
                            <Route path="/checkout" element={isPlug ? <Navigate to="/hq/drops" replace /> : <Checkout />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/verify" element={<Verify />} />
                            <Route path="/chat" element={<Chat />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/manifesto" element={<Manifesto />} />
                            <Route path="/store/:id" element={<PublicStore />} />
                            <Route path="/payment-success" element={<Success />} />

                            {/* Hustle HQ Zone */}
                            <Route path="/dashboard" element={<HustleHQ />} />
                            <Route path="/hq/drops" element={<Inventory />} />
                            <Route path="/hq/drops/new" element={<DropCreator />} />
                            <Route path="/hq/drops/edit/:id" element={<DropCreator />} />
                            <Route path="/hq/orders" element={<Orders />} />
                            <Route path="/hq/payouts" element={<Wallet />} />
                            <Route path="/hq/analytics" element={<Analytics />} />
                            <Route path="/hq/history" element={<History />} />

                        </Route>

                        <Route element={
                            <ProtectedRoute adminOnly>
                                <CouncilLayout />
                            </ProtectedRoute>
                        }>
                            <Route path="/tribe-council" element={<TribeCouncil />} />
                            <Route path="/admin/disputes" element={<DisputeCenter />} />
                            <Route path="/admin/verifications" element={<TribeCouncil />} />
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </Router>
        </CartProvider>
    );
}

export default App;
