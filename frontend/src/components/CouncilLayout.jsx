import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    Scale,
    Settings,
    LogOut,
    ShieldAlert
} from 'lucide-react';

const CouncilLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user] = React.useState(JSON.parse(localStorage.getItem('tribe_user') || '{}'));

    const adminNav = [
        { name: 'Council HQ', path: '/tribe-council', icon: LayoutDashboard },
        { name: 'Verifications', path: '/admin/verifications', icon: ShieldCheck },
        { name: 'FairPlay Center', path: '/admin/disputes', icon: Scale },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/super-admin-login');
    };

    return (
        <div className="flex min-h-screen bg-[#0F172A] text-white font-['Outfit',sans-serif]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#111827] hidden md:flex flex-col">
                <div className="p-10 mb-8 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-white/10 text-white">
                        <ShieldAlert size={32} />
                    </div>
                    <div className="text-xl font-black tracking-tighter">Council<span className="text-white/30">HQ</span></div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {adminNav.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${isActive(item.path)
                                ? 'bg-white text-[#0F172A] shadow-xl'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-8 border-t border-white/5 space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center text-[#111827] font-black">
                            {user.username?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-black truncate">{user.username}</p>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Admin Mandate</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                    >
                        <LogOut size={16} /> Terminate Session
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="md:hidden p-6 border-b border-white/5 flex justify-between items-center bg-[#111827]">
                    <div className="text-xl font-black tracking-tighter">Council<span className="text-white/30">HQ</span></div>
                    <button onClick={handleLogout} className="text-red-400"><LogOut size={20} /></button>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#111827]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default CouncilLayout;
