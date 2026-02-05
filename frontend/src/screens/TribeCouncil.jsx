import React, { useState, useEffect } from 'react';
import {
    Users,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Search,
    Loader2,
    ShieldAlert,
    Cpu,
    Globe,
    Lock,
    Scale
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import TribeLoader from '../components/TribeLoader';

const TribeCouncil = () => {
    const navigate = useNavigate();
    const [verifications, setVerifications] = useState([]);
    const [stats, setStats] = useState({
        total_citizens: 0,
        total_plugs: 0,
        pending_mandates: 0,
        uptime: '99.9%'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [user] = useState(JSON.parse(localStorage.getItem('tribe_user') || '{}'));

    const fetchData = async () => {
        try {
            const [verRes, statsRes] = await Promise.all([
                api.get('/users/verifications/'),
                api.get('/core/council-stats/')
            ]);

            // Filter only pending on frontend if needed, or backend handles it
            setVerifications(verRes.data.filter(v => v.status === 'PENDING'));
            setStats(statsRes.data);
        } catch (error) {
            console.error(error);
            // Don't toast on every poll failure to avoid spam
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Live Realtime Polling: Refresh every 10 seconds
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (id, action) => {
        const loadingToast = toast.loading(`${action === 'approve' ? 'Approving' : 'Rejecting'}...`);
        try {
            if (action === 'approve') {
                await api.post(`/users/verifications/${id}/approve/`);
            } else {
                await api.post(`/users/verifications/${id}/reject/`);
            }
            toast.success(`User ${action === 'approve' ? 'GreenChecked' : 'Rejected'}!`, { id: loadingToast });
            fetchData(); // Refresh immediately
        } catch (error) {
            toast.error("Transmission failed.", { id: loadingToast });
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#111827]">
            <TribeLoader size={64} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#111827] text-white p-6 md:p-12 font-['Outfit',sans-serif]">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
                <div className="w-full lg:w-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="h-[1px] w-8 bg-[#10B981]"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#10B981]">Council Mandate Active</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white mb-2">Council <span className="text-white/40 italic">HQ</span></h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2">
                        System Administrator: <span className="text-white">{user.username}</span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="bg-white/5 border border-white/10 p-4 px-6 rounded-2xl backdrop-blur-md flex-1 lg:flex-none">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Global Health</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                            <span className="text-lg font-black tracking-tighter">OPTIMAL</span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin/disputes')}
                        className="bg-white text-[#111827] font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.05] transition-all flex-1 lg:flex-none"
                    >
                        <Scale size={20} /> Open FairPlay
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-10 md:mb-16">
                {[
                    { label: "Active Citizens", val: stats.total_citizens?.toLocaleString(), icon: Users, color: "text-blue-500" },
                    { label: "Verified Plugs", val: stats.total_plugs?.toLocaleString(), icon: ShieldCheck, color: "text-[#10B981]" },
                    { label: "Pending Mandates", val: stats.pending_mandates, icon: Cpu, color: "text-orange-500" },
                    { label: "Network Uptime", val: stats.uptime, icon: Globe, color: "text-purple-500" },
                ].map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden group"
                    >
                        <m.icon className={`absolute -right-4 -bottom-4 w-16 md:w-24 h-16 md:h-24 ${m.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                        <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 md:mb-2 relative z-10">{m.label}</p>
                        <h3 className="text-xl md:text-3xl font-black text-white relative z-10">{m.val}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* ID Approval Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2 md:px-4">
                        <h2 className="text-lg md:text-2xl font-black tracking-tighter">Verification Queue</h2>
                        <div className="flex items-center gap-4">
                            <Search className="text-gray-500" size={18} />
                            <div className="h-4 w-[1px] bg-white/10"></div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{verifications.length} Pending</span>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">
                                        <th className="px-10 py-5">Applicant</th>
                                        <th className="px-10 py-5">Mandate Context</th>
                                        <th className="px-10 py-5 text-right">System Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {verifications.map(v => (
                                        <tr key={v.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-white font-black text-lg group-hover:bg-[#10B981] group-hover:text-[#111827] transition-all">
                                                        {v.username[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-lg text-white">{v.username}</p>
                                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{new Date(v.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-white/80">{v.matric_no}</p>
                                                    <p className="text-xs text-gray-500 uppercase tracking-widest">{v.institution}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex justify-end gap-4">
                                                    <button
                                                        onClick={() => handleAction(v.id, 'reject')}
                                                        className="w-12 h-12 border border-white/10 flex items-center justify-center text-gray-500 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all"
                                                    >
                                                        <XCircle size={24} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(v.id, 'approve')}
                                                        className="px-8 h-12 bg-[#10B981] text-[#111827] flex items-center justify-center gap-2 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
                                                    >
                                                        <CheckCircle2 size={18} /> Grant Mandate
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {verifications.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-10 py-24 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center text-[#10B981] mb-6">
                                                        <ShieldCheck size={40} />
                                                    </div>
                                                    <h4 className="text-xl font-black mb-1">Queue Sanitized</h4>
                                                    <p className="text-gray-500 font-bold">The Council has processed all pending credentials.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Live Pulse Monitor */}
                <div className="space-y-8">
                    <div className="bg-white/5 border border-[#10B981]/20 p-8 rounded-[2.5rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                        </div>
                        <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                            <Cpu size={20} className="text-[#10B981]" /> Live Pulse
                        </h3>

                        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                            {stats.live_pulse?.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="border-l-2 border-white/10 pl-4 py-1"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${item.type === 'ORDER' ? 'text-blue-400' :
                                            item.type === 'DROP' ? 'text-[#10B981]' : 'text-purple-400'
                                            }`}>{item.label}</p>
                                        <span className="text-[8px] text-gray-500 font-bold">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-sm font-bold text-white/90">{item.user}</p>
                                    <p className="text-xs text-gray-500 truncate">{item.detail}</p>
                                </motion.div>
                            ))}
                            {(!stats.live_pulse || stats.live_pulse.length === 0) && (
                                <p className="text-center text-gray-500 font-bold text-sm py-10">Waiting for pulse...</p>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                // Add a basic "Data Cleanup" trigger later if needed
                                toast.success("Monitoring system operational");
                            }}
                            className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider text-gray-400 transition-all"
                        >
                            Audit Global State
                        </button>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 p-10 rounded-[2.5rem]">
                        <ShieldAlert className="text-orange-500 mb-6" size={32} />
                        <h3 className="text-xl font-black text-orange-500 mb-4 tracking-tighter">Oversight Warning</h3>
                        <p className="text-orange-500/70 text-sm font-bold leading-relaxed">
                            Council decisions are final and impact the global TribeTrade Reputation Graph. Verify all matriculation data meticulously.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TribeCouncil;
