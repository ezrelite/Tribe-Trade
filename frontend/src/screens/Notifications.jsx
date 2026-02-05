import React, { useState } from 'react';
import {
    Bell,
    Zap,
    ShieldCheck,
    ShoppingBag,
    ArrowRight,
    Trash2,
    Search,
    ChevronLeft,
    Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mapTerm } from '../constants/dictionary';

const Notifications = () => {
    const navigate = useNavigate();

    // Mock Notifications Data
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'alert',
            title: 'TribeGuard Shield Active',
            desc: 'Your recent payment is safely locked in Escrow. The Plug only gets paid when you confirm.',
            time: '2m ago',
            read: false,
            icon: ShieldCheck,
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
        {
            id: 2,
            type: 'drop',
            title: 'Price Drop Alert!',
            desc: 'A pair of Jordan 4s in your Circle just went 30% OFF.',
            time: '1h ago',
            read: false,
            icon: Zap,
            color: 'text-[#10B981]',
            bg: 'bg-[#10B981]/10'
        },
        {
            id: 3,
            type: 'order',
            title: 'Order Delivered',
            desc: 'Tade confirmed delivery. Please confirm you have received the item at SUB.',
            time: '3h ago',
            read: true,
            icon: ShoppingBag,
            color: 'text-orange-500',
            bg: 'bg-orange-50'
        },
        {
            id: 4,
            type: 'system',
            title: 'Welcome to the Tribe!',
            desc: 'Start exploring your campus marketplace and rep your bag.',
            time: '1 day ago',
            read: true,
            icon: Bell,
            color: 'text-purple-500',
            bg: 'bg-purple-50'
        }
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto pb-32">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-[#1F2937] font-bold mb-8 transition-colors"
            >
                <ChevronLeft size={20} /> Back
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black text-[#1F2937] tracking-tighter">Tribe Pulse</h1>
                        <span className="bg-[#10B981] text-white text-xs font-black px-2 py-1 rounded-full">{notifications.filter(n => !n.read).length} New</span>
                    </div>
                    <p className="text-gray-500 font-bold">Stay updated with your campus commerce.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={markAllRead}
                        className="text-xs font-black text-[#10B981] uppercase tracking-widest hover:underline"
                    >
                        Mark all as read
                    </button>
                    <div className="w-px h-6 bg-gray-200 hidden md:block"></div>
                    <button className="p-2 text-gray-400 hover:text-[#1F2937]"><Filter size={20} /></button>
                </div>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-20 card-clean border-dashed border-2 border-gray-200 bg-transparent">
                        <Bell className="mx-auto text-gray-200 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-gray-400">All Clear</h3>
                        <p className="text-gray-400 font-bold">Nothing new in the Tribe right now.</p>
                    </div>
                ) : notifications.map(n => (
                    <div
                        key={n.id}
                        className={`card-clean p-6 flex flex-col md:flex-row md:items-center gap-6 group transition-all duration-300 border-none ${n.read ? 'bg-white opacity-80' : 'bg-white shadow-xl shadow-[#10B981]/5 ring-1 ring-[#10B981]/10'}`}
                    >
                        <div className={`w-14 h-14 ${n.bg} ${n.color} rounded-2xl flex items-center justify-center shrink-0`}>
                            <n.icon size={28} />
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                                <h3 className={`font-bold text-lg ${n.read ? 'text-[#1F2937]' : 'text-[#10B981]'}`}>{n.title}</h3>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{n.time}</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">{n.desc}</p>

                            {!n.read && (
                                <div className="pt-4 flex gap-4">
                                    <button
                                        onClick={() => setNotifications(notifications.map(target => target.id === n.id ? { ...target, read: true } : target))}
                                        className="text-[10px] font-black text-[#10B981] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                                    >
                                        View Details <ArrowRight size={12} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end border-t md:border-t-0 pt-4 md:pt-0">
                            <button
                                onClick={() => deleteNotification(n.id)}
                                className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 card-clean bg-gray-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-none shadow-xl shadow-black/10">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-center backdrop-blur-md shrink-0">
                        <Lock size={28} className="text-[#10B981] sm:w-8 sm:h-8" />
                    </div>
                    <div>
                        <h4 className="text-base sm:text-lg font-bold">Push Notifications</h4>
                        <p className="text-gray-400 text-xs sm:text-sm font-medium">Never miss a drop or an urgent message from a buyer.</p>
                    </div>
                </div>
                <button className="w-full sm:w-auto bg-white text-gray-900 font-black px-8 py-3.5 sm:py-3 rounded-xl hover:bg-[#10B981] hover:text-white transition-all text-sm sm:text-base">
                    Enable Web Push
                </button>
            </div>
        </div>
    );
};

const Lock = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

export default Notifications;
