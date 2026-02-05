import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    ShieldAlert,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Loader2,
    ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const DisputeCenter = () => {
    const [disputes, setDisputes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDisputes = async () => {
        try {
            const res = await api.get('/orders/admin/disputes/');
            setDisputes(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDisputes();
        // Live Realtime Polling
        const interval = setInterval(fetchDisputes, 15000);
        return () => clearInterval(interval);
    }, []);

    const resolveDispute = async (id, resolution) => {
        const loadingToast = toast.loading(`Finalizing FairPlay resolution...`);
        try {
            if (resolution === 'refund') {
                await api.post(`/orders/admin/disputes/${id}/resolve-refund/`);
            } else {
                await api.post(`/orders/admin/disputes/${id}/resolve-release/`);
            }
            toast.success(`Dispute #${id} ${resolution === 'refund' ? 'Refunded' : 'Released'}!`, { id: loadingToast });
            fetchDisputes();
        } catch (error) {
            toast.error('Transmission failed.', { id: loadingToast });
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-[#10B981]" size={40} />
        </div>
    );

    return (
        <div className="p-6 md:p-10 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-[#1F2937] tracking-tighter flex items-center gap-3">
                        FairPlay Center <ShieldAlert size={32} className="text-orange-500" />
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Justice Protocol: Active</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find Case ID..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:border-[#10B981] outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {disputes.map(d => (
                    <div key={d.id} className="card-clean p-8 flex flex-col lg:flex-row gap-8 hover:scale-[1.01] transition-all">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] font-black bg-orange-500/10 text-orange-600 px-3 py-1 rounded-full uppercase tracking-widest">#{d.id} OPEN</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <Clock size={12} /> {new Date(d.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-[#1F2937] mb-2">{d.product_name}</h3>
                            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-50">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Citizen</p>
                                    <p className="font-bold text-[#1F2937]">{d.customer_username}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Plug</p>
                                    <p className="font-bold text-[#1F2937]">{d.store_name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payload</p>
                                    <p className="font-black text-[#10B981]">₦{parseFloat(d.price * d.quantity).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-4 min-w-[200px]">
                            <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-[#1F2937] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                                <MessageSquare size={16} /> View Evidence
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => resolveDispute(d.id, 'refund')}
                                    className="flex flex-col items-center justify-center py-4 border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-all group"
                                >
                                    <XCircle size={20} className="mb-1 group-hover:scale-110 transition-transform" />
                                    <span className="text-[9px] font-black uppercase tracking-tighter">Refund</span>
                                </button>
                                <button
                                    onClick={() => resolveDispute(d.id, 'release')}
                                    className="flex flex-col items-center justify-center py-4 bg-[#10B981] text-white rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#10B981]/20 group"
                                >
                                    <CheckCircle2 size={20} className="mb-1 group-hover:scale-110 transition-transform" />
                                    <span className="text-[9px] font-black uppercase tracking-tighter">Release</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {disputes.length === 0 && (
                    <div className="card-clean py-24 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-[#10B981]">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-[#1F2937] mb-2 tracking-tighter">Peace in the Tribe</h3>
                        <p className="text-gray-500 font-bold">The FairPlay queue is currently empty. All Citizens are satisfied.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisputeCenter;
