import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, LayoutDashboard, User, Bell, MessageSquare, Package, Menu, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mapTerm } from '../constants/dictionary';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const location = useLocation();
    const [user] = React.useState(JSON.parse(localStorage.getItem('tribe_user') || '{}'));

    const navItems = user.is_plug ? [
        { name: 'Home', path: '/marketplace', icon: Home },
        { name: 'My Inventory', path: '/hq/drops', icon: Package },
        { name: 'Hustle HQ', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Received Orders', path: '/hq/orders', icon: Package },
        { name: 'Profile', path: '/profile', icon: User },
    ] : [
        { name: 'Home', path: '/marketplace', icon: Home },
        { name: 'Cart', path: '/cart', icon: ShoppingBag },
        { name: 'Orders', path: '/orders', icon: Package },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex min-h-screen bg-[#F3F4F6]">
            {/* Sidebar - Desktop Only */}
            <aside className="hidden lg:flex flex-col w-64 bg-white/30 border-r border-white/50 shadow-sm fixed h-full z-20 liquid-glass animate-liquid">
                <div className="p-8">
                    <Link to="/" className="text-2xl font-black tracking-tight text-[#1F2937]">
                        Tribe<span className="text-[#10B981]">Trade</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.filter(item => {
                        if (item.role === 'plug') return user.is_plug;
                        if (item.role === 'citizen') return !user.is_plug;
                        return true;
                    }).map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path) ? 'nav-item-active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-100">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 bg-gray-100/80 rounded-xl border border-gray-100 shadow-inner hover:bg-gray-200/50 transition-all">
                        <div className="w-10 h-10 bg-[#10B981] rounded-lg flex items-center justify-center text-white font-bold">
                            {user.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user.username}</p>
                            <p className="text-xs text-gray-500 truncate font-bold">
                                {user.is_plug ? mapTerm('PLUG') : mapTerm('CITIZEN')}
                            </p>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:pl-64 pb-32 lg:pb-0 transition-all duration-300 ease-in-out">
                <header className="mobile-header-fix animate-liquid liquid-glass transition-all duration-500">
                    <div className="max-w-7xl mx-auto px-4 w-full">
                        <Link to="/" className="text-xl font-black tracking-tight text-[#1F2937]">
                            Tribe<span className="text-[#10B981]">Trade</span>
                        </Link>
                    </div>
                </header>

                <div className="w-full">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Nav - Modern Liquid Pill (Image 1 Style) - Hidden on Product Detail */}
            {!location.pathname.includes('/drop/') && (
                <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-md h-16 z-50 liquid-glass animate-liquid rounded-full border border-white/10 flex items-center justify-between px-2 shadow-2xl shadow-black/10">
                    {navItems.filter(item => {
                        if (item.role === 'plug') return user.is_plug;
                        if (item.role === 'citizen') return !user.is_plug;
                        return true;
                    }).map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center justify-center transition-all duration-500 relative ${active ? 'flex-[1.5] h-[80%]' : 'flex-1 h-full'
                                    }`}
                            >
                                <motion.div
                                    layout
                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${active
                                        ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
                                    <AnimatePresence mode="wait">
                                        {active && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="text-xs font-black whitespace-nowrap overflow-hidden tracking-tight"
                                            >
                                                {item.name === 'Cart' ? 'Bag' : (item.name || 'Link').split(' ')[0]}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Layout;
