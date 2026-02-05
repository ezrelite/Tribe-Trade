import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    Users,
    DollarSign,
    ShoppingBag,
    ChevronLeft,
    Loader2,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Analytics = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState(null);

    const fetchAnalytics = async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            // In a full implementation, we'd have a specific analytics endpoint
            // For now, we derive from store stats and mock the time-series data
            const response = await api.get('/store/hustle-hq/my_store/');
            setStats(response.data);
        } catch (error) {
            console.error("Failed to load analytics pulse.", error);
        } finally {
            if (showLoading) setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics(true);
        const interval = setInterval(() => fetchAnalytics(false), 30000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-[#10B981]" size={40} />
        </div>
    );

    const metrics = [
        { label: "Total Revenue", value: `₦${stats?.wallet_balance || '0.00'}`, trend: "+12.5%", positive: true, icon: DollarSign },
        { label: "Active Escrow", value: `₦${stats?.escrow_balance || '0.00'}`, trend: "Pending", positive: true, icon: Target },
        { label: "Customer Reach", value: "142", trend: "+8.2%", positive: true, icon: Users },
        { label: "Reputation Score", value: "4.9", trend: "Elite", positive: true, icon: Zap },
    ];

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto pb-32">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-[#1F2937] font-bold mb-8 transition-colors"
            >
                <ChevronLeft size={20} /> Back
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 sm:mb-12">
                <div className="w-full sm:w-auto">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1F2937] tracking-tighter">Hustle Analytics</h1>
                        <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1 shadow-sm">
                            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Pulse</span>
                        </div>
                    </div>
                    <p className="text-gray-500 font-bold text-xs sm:text-sm md:text-base">Data-driven growth for your campus empire.</p>
                </div>
                <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-6 py-2 bg-[#10B981] text-white rounded-xl text-xs font-black uppercase tracking-widest">Weekly</button>
                    <button className="flex-1 sm:flex-none px-6 py-2 text-gray-400 rounded-xl text-xs font-black uppercase tracking-widest">Monthly</button>
                </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                {metrics.map((m, i) => (
                    <div key={i} className="card-clean p-4 md:p-6 flex flex-col justify-between hover:scale-[1.02] transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                <m.icon size={20} />
                            </div>
                            <span className={`text-[8px] md:text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 ${m.positive ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-red-50 text-red-500'
                                }`}>
                                {m.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                {m.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{m.label}</p>
                            <h3 className="text-lg md:text-2xl font-black text-[#1F2937] truncate">{m.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart Visualization */}
                <div className="lg:col-span-2 card-clean">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-lg font-bold">Revenue Pulse</h3>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#10B981]"></div> Sales</div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-100"></div> Views</div>
                        </div>
                    </div>

                    <div className="overflow-x-auto pb-4">
                        <div className="h-72 flex items-end gap-3 px-2 border-b-2 border-gray-50 mb-4 min-w-[500px]">
                            {[35, 60, 45, 90, 65, 85, 75].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer relative">
                                    {/* Sales Bar */}
                                    <div className="w-full bg-[#10B981] rounded-t-lg transition-all hover:bg-[#059669] relative" style={{ height: `${h}%` }}>
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1F2937] text-white text-[10px] font-black px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl whitespace-nowrap">
                                            ₦{(h * 1500).toLocaleString()}
                                        </div>
                                    </div>
                                    {/* Views Ghost Bar */}
                                    <div className="absolute inset-x-0 bottom-0 bg-blue-50/50 rounded-t-lg -z-10" style={{ height: `${h + 10}%` }}></div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[500px]">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>
                </div>

                {/* Performance Insights */}
                <div className="space-y-6">
                    <div className="card-clean h-full">
                        <h3 className="text-lg font-bold mb-6">Circle Dominance</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Electronics', value: 45, color: 'bg-[#10B981]' },
                                { label: 'Fashion', value: 30, color: 'bg-blue-400' },
                                { label: 'Services', value: 25, color: 'bg-orange-400' },
                            ].map((c, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                        <span className="text-gray-500">{c.label}</span>
                                        <span className="text-[#1F2937]">{c.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.value}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 p-6 bg-[#10B981]/5 rounded-2xl border border-[#10B981]/10">
                            <h4 className="text-sm font-black text-[#10B981] uppercase tracking-widest mb-2 flex items-center gap-2">
                                <TrendingUp size={14} /> Council Tip
                            </h4>
                            <p className="text-xs text-gray-500 font-bold leading-relaxed">
                                Items marked as <span className="text-[#10B981]">AWOOF</span> are getting 4x more views this week. Consider dropping your price on stale inventory.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
