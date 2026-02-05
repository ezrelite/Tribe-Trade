import React, { useState, useEffect } from 'react';
import {
    History as HistoryIcon,
    Search,
    Filter,
    Download,
    ChevronLeft,
    Loader2,
    Calendar,
    ShoppingBag,
    MoreVertical,
    CheckCircle2,
    XCircle,
    RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { mapTerm } from '../constants/dictionary';

const History = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetching plug orders (already contains history in the database)
                const response = await api.get('/orders/plug-items/');
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to retrieve order archive.", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.id.toString().includes(searchTerm);
        const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'DELIVERED': return 'bg-[#10B981]/10 text-[#10B981]';
            case 'DISPUTED': return 'bg-red-50 text-red-500';
            case 'PROCESSING': return 'bg-blue-50 text-blue-500';
            default: return 'bg-orange-50 text-orange-500';
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-[#10B981]" size={40} />
        </div>
    );

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto pb-32">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-[#1F2937] font-bold mb-8 transition-colors"
            >
                <ChevronLeft size={20} /> Back
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="w-full sm:w-auto">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1F2937] tracking-tighter">Vault Archive</h1>
                    <p className="text-gray-500 font-bold text-xs sm:text-sm">Comprehensive record of all your {mapTerm('PRODUCT')} trades.</p>
                </div>

                <button
                    onClick={() => toast.success("Exporting archive as CSV...")}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all"
                >
                    <Download size={18} /> Export CSV
                </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Product name or Order Reference..."
                        className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#10B981] transition-all font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#10B981] transition-all font-bold appearance-none cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="DISPUTED">Disputed</option>
                    </select>
                </div>
            </div>

            {/* History Table */}
            <div className="card-clean px-0 overflow-hidden">
                {filteredOrders.length === 0 ? (
                    <div className="p-20 text-center text-gray-400 font-bold">
                        <HistoryIcon className="mx-auto mb-4 opacity-20" size={64} />
                        <p>No records found matching your filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest border-y border-gray-100">
                                    <th className="px-8 py-5">Order Ref</th>
                                    <th className="px-8 py-5">Drop Details</th>
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-8 py-5">Amount</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map(o => (
                                    <tr key={o.id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <span className="font-black text-gray-400">#</span>
                                            <span className="font-black text-[#1F2937]">{o.id}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-[#10B981]/5 rounded-lg flex items-center justify-center font-black text-[#10B981]">
                                                    {o.product_name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#1F2937] leading-none mb-1">{o.product_name}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty: {o.quantity}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar size={14} />
                                                <span className="text-xs font-bold">Jan 22, 2026</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-black text-[#1F2937]">₦{(o.product_price * o.quantity).toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyles(o.status)}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-gray-300 hover:text-[#1F2937] transition-colors"><MoreVertical size={20} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-center">
                <button className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#10B981] transition-all">
                    <RotateCcw size={14} /> Load More From Archive
                </button>
            </div>
        </div>
    );
};

export default History;
