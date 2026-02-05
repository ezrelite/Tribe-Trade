import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Package,
    ArrowUpRight,
    Clock,
    ShieldCheck,
    MoreVertical,
    Plus,
    ArrowRight,
    TrendingUp,
    DollarSign,
    Users,
    Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mapTerm } from '../constants/dictionary';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import ErrorState from '../components/ErrorState';
import TribeLoader from '../components/TribeLoader';

const HustleHQ = () => {
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        setError(null);
        try {
            const [storeRes, ordersRes] = await Promise.all([
                api.get('/store/hustle-hq/my_store/'),
                api.get('/orders/plug-items/')
            ]);
            setStore(storeRes.data);
            setOrders(ordersRes.data);
        } catch (error) {
            console.error('Failed to load your HQ data', error);
            if (showLoading) {
                setError({
                    message: 'The Hustle HQ is currently unreachable. Check your connection to the Tribe.',
                    code: error.response?.status
                });
            }
        } finally {
            if (showLoading) setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(true);
        const interval = setInterval(() => fetchData(false), 30000); // Pulse every 30 seconds
        return () => clearInterval(interval);
    }, []);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <TribeLoader size={64} />
        </div>
    );

    if (error) return (
        <div className="p-10 max-w-2xl mx-auto">
            <ErrorState message={error.message} errorCode={error.code} onRetry={fetchData} />
        </div>
    );

    const metrics = [
        { label: "Total Sales", value: `₦${store?.total_sales || '0'}`, change: "+12%", icon: DollarSign, color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
        { label: "Locked Funds", value: `₦${store?.escrow_balance || '0'}`, change: "Escrow", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Available", value: `₦${store?.wallet_balance || '0'}`, change: "Cash Out", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50" },
        { label: "Rep Score", value: "4.9", change: "Top 5%", icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
    ];

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 sm:mb-10 w-full">
                <div className="w-full sm:w-auto">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1F2937] tracking-tighter">Hustle HQ</h1>
                        <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1 shadow-sm">
                            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Pulse</span>
                        </div>
                    </div>
                    <p className="text-gray-500 font-bold text-xs sm:text-sm md:text-base">Commander, your {store?.institution_name || 'campus'} empire is steady.</p>
                </div>
                <button
                    onClick={() => navigate('/hq/drops/new')}
                    className="flex md:flex btn-primary items-center justify-center gap-2 w-full md:w-auto py-4 md:py-3"
                >
                    <Plus size={18} className="md:w-5 md:h-5" /> Launch New Drop
                </button>
            </div>

            {/* Metric Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                {metrics.map((m, i) => (
                    <div key={i} className="card-clean p-4 md:p-6 flex flex-col justify-between hover:scale-[1.02] transition-all">
                        <div className={`w-10 h-10 md:w-12 md:h-12 ${m.bg} ${m.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4`}>
                            <m.icon size={20} className="md:w-6 md:h-6" />
                        </div>
                        <div>
                            <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{m.label}</p>
                            <h3 className="text-lg md:text-2xl font-black text-[#1F2937] truncate">{m.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Revenue Chart Section */}
                <div className="lg:col-span-2 card-clean">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <h3 className="text-lg md:text-xl font-black text-[#1F2937]">Revenue Trend</h3>
                        <div className="flex gap-2">
                            <div className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-[10px] font-black uppercase">Weekly</div>
                        </div>
                    </div>

                    {/* Mock SVG Chart */}
                    <div className="h-64 w-full relative group overflow-x-auto overflow-y-hidden">
                        <div className="min-w-[500px] h-full relative">
                            <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                                <path
                                    d="M0,80 Q50,70 100,40 T200,50 T300,20 T400,30 L400,100 L0,100 Z"
                                    fill="url(#gradient)"
                                    className="opacity-20"
                                />
                                <path
                                    d="M0,80 Q50,70 100,40 T200,50 T300,20 T400,30"
                                    fill="none"
                                    stroke="#10B981"
                                    strokeWidth="3"
                                    className="drop-shadow-lg"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#10B981" />
                                        <stop offset="100%" stopColor="white" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-end justify-between px-2 pt-4">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <span key={day} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{day}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="card-clean">
                    <h3 className="text-lg md:text-xl font-black text-[#1F2937] mb-6 md:mb-8">Recent Activity</h3>
                    <div className="space-y-6">
                        {[
                            { text: "Payout Confirmed", time: "2h ago", type: "wallet" },
                            { text: "New Order #9021", time: "4h ago", type: "order" },
                            { text: "Reputation Boost", time: "1d ago", type: "star" },
                        ].map((a, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#1F2937]">{a.text}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">{a.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 btn-outline py-3 !text-[10px]">View Analytics</button>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="card-clean overflow-hidden px-0">
                <div className="px-8 pb-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-xl font-black text-[#1F2937]">Latest Orders</h3>
                    <button onClick={() => navigate('/hq/orders')} className="text-[#10B981] text-xs font-black uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                <th className="px-8 py-5">Drop</th>
                                <th className="px-8 py-5">Customer</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.slice(0, 5).map(o => (
                                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-sm text-[#1F2937]">{o.product_name}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">#{o.id}</p>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-gray-500">{o.citizen_name || 'Tribe Member'}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${o.status === 'DELIVERED' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-orange-50 text-orange-500'
                                            }`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right font-black text-sm text-[#1F2937]">₦{o.total_price}</td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold">
                                        No orders in the pipeline yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default HustleHQ;
