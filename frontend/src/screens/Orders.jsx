import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { mapTerm } from '../constants/dictionary';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import ErrorState from '../components/ErrorState';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null); // Track expanded order

    const [user] = useState(JSON.parse(localStorage.getItem('tribe_user') || '{}'));
    const isHustleHQ = window.location.pathname.startsWith('/hq');

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const endpoint = isHustleHQ ? '/orders/plug-items/' : '/orders/orders/';
            const response = await api.get(endpoint);
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to load orders', error);
            if (error.response?.status !== 404) {
                setError('We could not retrieve orders. The Tribe Council might be busy.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleConfirm = async (itemId) => {
        try {
            await api.post(`/orders/citizen-items/${itemId}/confirm-received/`);
            toast.success('TribeGuard Shields Lowered. Funds released!');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to confirm delivery.');
            console.error(error);
        }
    };

    const toggleOrder = (orderId) => {
        setExpandedOrderId(prev => prev === orderId ? null : orderId);
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
            <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="p-10 max-w-2xl mx-auto">
            <ErrorState message={error} onRetry={fetchOrders} />
        </div>
    );

    return (
        <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto pb-32">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1F2937] tracking-tighter mb-6 sm:mb-8">
                {isHustleHQ ? 'Received Orders' : 'My Orders'}
            </h1>

            <div className="space-y-4 md:space-y-6">
                {orders.length === 0 ? (
                    <div className="text-center py-16 md:py-20 card-clean">
                        <Package className="mx-auto text-gray-400 mb-4" size={40} />
                        <h3 className="text-lg md:text-xl font-bold text-gray-500">
                            {isHustleHQ ? 'No orders in the pipeline yet' : 'No orders yet'}
                        </h3>
                        <p className="text-gray-400 font-bold text-sm md:text-base">
                            {isHustleHQ ? 'Keep your drops hot to attract the Tribe!' : 'Start browsing the marketplace to join the Tribe!'}
                        </p>
                    </div>
                ) : isHustleHQ ? (
                    // PLUG VIEW (Item based)
                    orders.map(order => (
                        <div key={order.id} className="card-clean flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#10B981]/5 rounded-xl flex items-center justify-center text-[#10B981] font-bold flex-shrink-0">
                                    {(order.product_name && order.product_name[0]) || '?'}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base md:text-xl font-bold text-[#1F2937] truncate">{order.product_name}</h3>
                                    <p className="text-xs md:text-sm text-gray-500 font-bold flex items-center gap-1 mt-1 truncate">
                                        <Clock size={12} /> Ref: #{order.id} • From {order.store_name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                                <div className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider ${order.status === 'DELIVERED' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-orange-50 text-orange-500'}`}>
                                    {order.status}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    // CITIZEN VIEW (Order based)
                    orders.map(order => {
                        const isExpanded = expandedOrderId === order.id;
                        return (
                            <div key={order.id} className={`card-clean transition-all duration-300 ${isExpanded ? 'p-6 ring-2 ring-[#10B981]/20' : 'p-4 hover:bg-gray-50/50 cursor-pointer'}`}>
                                <div
                                    onClick={() => toggleOrder(order.id)}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-[#10B981] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-[#1F2937]">Order #{order.id}</h3>
                                            <p className="text-xs text-gray-400 font-bold flex items-center gap-2">
                                                {new Date(order.created_at).toLocaleDateString()}
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                {order.items?.length || 0} Items
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-xl text-[#10B981]">₦{order.total_amount}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isExpanded ? 'Click to close' : 'Click to view'}</p>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="mt-6 space-y-4 pt-6 border-t border-gray-50 animate-in slide-in-from-top-4 fade-in duration-300">
                                        {order.items && order.items.map(item => (
                                            <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-xl">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1F2937] font-bold shadow-sm">
                                                        {item.product_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-[#1F2937]">{item.product_name}</h4>
                                                        <p className="text-xs text-gray-500 font-bold">Qty: {item.quantity} • ₦{item.price}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    {item.status === 'DELIVERED' ? (
                                                        item.tribeguard_status === 'RELEASED' ? (
                                                            <div className="px-3 py-1 bg-gray-100 text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                                <CheckCircle2 size={12} /> Completed
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleConfirm(item.id);
                                                                }}
                                                                className="px-4 py-2 bg-[#10B981] text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                                                            >
                                                                <CheckCircle2 size={14} /> Confirm Receipt
                                                            </button>
                                                        )
                                                    ) : (
                                                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${item.status === 'RECEIVED' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'
                                                            }`}>
                                                            {item.status}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Orders;
