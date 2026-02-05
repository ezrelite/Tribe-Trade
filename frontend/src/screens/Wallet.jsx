import React, { useState, useEffect } from 'react';
import {
    Wallet as WalletIcon,
    ArrowUpRight,
    ShieldCheck,
    ArrowRight,
    Clock,
    ChevronLeft,
    Loader2,
    DollarSign,
    Banknote,
    History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mapTerm } from '../constants/dictionary';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import TribeLoader from '../components/TribeLoader';

const Wallet = () => {
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [payouts, setPayouts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Withdrawal Form State
    const [showWithdrawForm, setShowWithdrawForm] = useState(false);
    const [withdrawData, setWithdrawData] = useState({
        amount: '',
        bank_details: ''
    });

    const fetchData = async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            const [storeRes, payoutRes] = await Promise.all([
                api.get('/store/hustle-hq/my_store/'),
                api.get('/store/payouts/')
            ]);
            setStore(storeRes.data);
            setPayouts(payoutRes.data);
        } catch (error) {
            console.error("Failed to sync wallet data", error);
        } finally {
            if (showLoading) setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(true);
        const interval = setInterval(() => fetchData(false), 30000);
        return () => clearInterval(interval);
    }, []);

    const handleWithdrawal = async (e) => {
        e.preventDefault();
        if (parseFloat(withdrawData.amount) > store.wallet_balance) {
            toast.error("Insufficient funds in wallet.");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/store/payouts/', withdrawData);
            toast.success("Payout request submitted! Funds will arrive within 24 hours.");
            setShowWithdrawForm(false);
            setWithdrawData({ amount: '', bank_details: '' });
            fetchData(); // Refresh balances and history
        } catch (error) {
            toast.error(error.response?.data?.[0] || "Withdrawal failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <TribeLoader size={64} />
        </div>
    );

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto pb-32">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-[#1F2937] font-bold mb-8 transition-colors"
            >
                <ChevronLeft size={20} /> Back
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="w-full sm:w-auto">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1F2937] tracking-tighter">Tribe Wallet</h1>
                        <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1 shadow-sm">
                            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Pulse</span>
                        </div>
                    </div>
                    <p className="text-gray-500 font-bold text-xs sm:text-sm md:text-base">Mange your digital bag and payout status.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8 mb-12">
                {/* Main Wallet Card */}
                <div className="card-clean bg-[#10B981] text-white border-none shadow-xl shadow-[#10B981]/20 p-4 md:p-8 flex flex-col justify-between hover:scale-[1.02] transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[#10B981] bg-white px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest inline-block mb-1">
                                Available Bag
                            </p>
                            <h3 className="text-xl md:text-4xl font-black">₦{store?.wallet_balance || '0.00'}</h3>
                        </div>
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <WalletIcon size={24} className="md:w-8 md:h-8" />
                        </div>
                    </div>
                    <button
                        onClick={() => setShowWithdrawForm(true)}
                        className="w-full bg-white text-[#10B981] font-black py-2.5 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-2 text-[10px] md:text-sm"
                    >
                        Cash Out <ArrowUpRight size={16} />
                    </button>
                </div>

                {/* Escrow Card */}
                <div className="card-clean p-4 md:p-8 flex flex-col justify-between hover:scale-[1.02] transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center">
                            <ShieldCheck size={20} className="md:w-6 md:h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{mapTerm('ESCROW_BALANCE')}</p>
                        <h3 className="text-lg md:text-3xl font-black text-[#1F2937]">₦{store?.escrow_balance || '0.00'}</h3>
                    </div>
                </div>
            </div>

            {/* Withdrawal Form Modal-ish */}
            {showWithdrawForm && (
                <div className="mb-12 animate-in slide-in-from-top-4 duration-300">
                    <div className="card-clean border-2 border-[#10B981]/20">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold">Cash Out Request</h3>
                            <button onClick={() => setShowWithdrawForm(false)} className="text-gray-400 hover:text-red-500 font-bold">Cancel</button>
                        </div>
                        <form onSubmit={handleWithdrawal} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Amount to Withdraw</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-lg">₦</span>
                                        <input
                                            required
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-10 pr-4 focus:border-[#10B981] outline-none transition-all font-bold"
                                            value={withdrawData.amount}
                                            onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Bank Details</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Acc No, Bank Name"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-4 focus:border-[#10B981] outline-none transition-all font-bold"
                                        value={withdrawData.bank_details}
                                        onChange={(e) => setWithdrawData({ ...withdrawData, bank_details: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-primary py-4 flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {isSubmitting ? <TribeLoader size={24} color="#fff" /> : <>Request Payout <ArrowRight size={20} /></>}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Payout History */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 md:gap-3">
                    <History className="text-gray-400" size={20} />
                    <h2 className="heading-lg">Transaction Pulse</h2>
                </div>

                <div className="card-clean px-0 overflow-hidden">
                    {payouts.length === 0 ? (
                        <div className="p-20 text-center text-gray-400 font-bold">No payouts recorded yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest border-y border-gray-100">
                                        <th className="px-4 md:px-8 py-3 md:py-4">Ref</th>
                                        <th className="px-4 md:px-8 py-3 md:py-4 hidden sm:table-cell">Date</th>
                                        <th className="px-4 md:px-8 py-3 md:py-4">Amount</th>
                                        <th className="px-4 md:px-8 py-3 md:py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {payouts.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition-all group">
                                            <td className="px-4 md:px-8 py-4 md:py-5 font-black text-[#10B981] text-xs">#P-{p.id}</td>
                                            <td className="px-4 md:px-8 py-4 md:py-5 text-xs md:text-sm font-bold text-[#1F2937] hidden sm:table-cell">{new Date(p.created_at).toLocaleDateString()}</td>
                                            <td className="px-4 md:px-8 py-4 md:py-5 text-xs md:text-sm font-black text-[#1F2937]">₦{p.amount}</td>
                                            <td className="px-4 md:px-8 py-4 md:py-5 text-right">
                                                <span className={`px-2 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest ${p.status === 'COMPLETED' ? 'bg-[#10B981]/10 text-[#10B981]' :
                                                    p.status === 'FAILED' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wallet;
