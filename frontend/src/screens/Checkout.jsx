import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    Truck,
    Users,
    CreditCard,
    ArrowRight,
    ChevronLeft,
    Shield,
    Zap
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import TribeLoader from '../components/TribeLoader';
import api from '../services/api';
import PaymentButton from '../components/PaymentButton';

const Checkout = () => {
    const location = useLocation();
    const { cart: globalCart, cartTotal: globalCartTotal, clearCart } = useCart();

    // Support for single-item checkout from DropDetail
    const singleItem = location.state?.singleItem;
    const cart = singleItem ? [singleItem] : globalCart;
    const cartTotal = singleItem ? (parseFloat(singleItem.price) * (singleItem.quantity || 1)) : globalCartTotal;

    const [deliveryMode, setDeliveryMode] = useState('MEETUP');
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [txRef, setTxRef] = useState(`TT-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
    const [deliveryDetails, setDeliveryDetails] = useState({
        address: '',
        phone: '',
        instructions: ''
    });
    const user = JSON.parse(localStorage.getItem('tribe_user') || '{}');

    // Logic: Compare campuses
    const sellerInstitutionId = cart[0]?.store?.institution || cart[0]?.store_institution_id || cart[0]?.institution;
    const userInstitutionId = user?.institution;
    const isSameCampus = !sellerInstitutionId || !userInstitutionId || sellerInstitutionId === userInstitutionId;

    useEffect(() => {
        // Set default based on campus logic
        setDeliveryMode(isSameCampus ? 'MEETUP' : 'WAYBILL');
    }, [isSameCampus]);

    const calculateDeliveryTotal = () => {
        if (!deliveryMode || deliveryMode === 'MEETUP') return 0;
        if (deliveryMode === 'TRIBE_RUNNER' || deliveryMode === 'TRIBE_LOGISTICS') return 500;

        // PLUG_DELIVERY: Sum campus delivery fees
        if (deliveryMode === 'PLUG_DELIVERY') {
            return cart.reduce((sum, item) => {
                const fee = parseFloat(item.campus_delivery_fee);
                return sum + (isNaN(fee) ? 0 : fee);
            }, 0);
        }

        // WAYBILL: Sum waybill fees
        if (deliveryMode === 'WAYBILL') {
            return cart.reduce((sum, item) => {
                const fee = parseFloat(item.waybill_delivery_fee);
                return sum + (isNaN(fee) ? 0 : fee);
            }, 0);
        }

        return 0;
    };

    const handleDeliveryChange = (e) => {
        setDeliveryDetails({
            ...deliveryDetails,
            [e.target.name]: e.target.value
        });
    };

    const deliveryTotal = calculateDeliveryTotal();
    const protocolFee = cartTotal * 0.02;
    const grandTotal = cartTotal + deliveryTotal + protocolFee;

    const handleOrderAndPayment = async (paymentResponse) => {
        console.log("DEBUG: Payment Callback Received", paymentResponse);

        // Robust status check
        const status = paymentResponse?.status;
        if (status === 'successful' || status === 'success' || status === 'completed') {
            console.log("DEBUG: Payment Successful, Clearing Cart and Redirecting...");
            toast.success("Payment Verified by TribeGuard!");
            clearCart();
            // Small delay to ensure state updates before navigation
            setTimeout(() => {
                navigate('/payment-success');
            }, 100);
        } else {
            console.warn("DEBUG: Payment Status not successful", status);
            // Show the actual status to the user for debugging
            toast.error(`Payment validation failed. Status: ${status || 'Unknown'}`);
        }
    };

    const prepareOrder = async () => {
        setIsCreatingOrder(true);
        // Use the consistent txRef from state
        const payment_ref = txRef;

        // Security check for delivery mode
        const finalDeliveryMode = deliveryMode || (isSameCampus ? 'MEETUP' : 'WAYBILL');

        // Validation for Plug Delivery
        if (finalDeliveryMode === 'PLUG_DELIVERY') {
            if (!deliveryDetails.address || !deliveryDetails.phone) {
                toast.error("Please provide your hostel address and phone number for delivery.");
                setIsCreatingOrder(false);
                throw new Error("Missing delivery details");
            }
        }

        // Validation for Waybill (Check if Plug supports it)
        if (finalDeliveryMode === 'WAYBILL') {
            const unsupportedItems = cart.filter(item => item.waybill_delivery_fee === null || item.waybill_delivery_fee === undefined || item.waybill_delivery_fee === '');
            if (unsupportedItems.length > 0) {
                toast.error(`One or more items do not support Waybill delivery (Seller doesn't ship).`);
                setIsCreatingOrder(false);
                throw new Error("Waybill not supported for some items");
            }
        }

        try {
            const orderData = {
                total_amount: parseFloat(grandTotal || 0).toFixed(2),
                payment_ref: payment_ref,
                delivery_method: finalDeliveryMode,
                delivery_address: finalDeliveryMode === 'PLUG_DELIVERY' ? deliveryDetails.address : null,
                delivery_phone: finalDeliveryMode === 'PLUG_DELIVERY' ? deliveryDetails.phone : null,
                items: cart.map(item => ({
                    product: item.id?.id || item.id,
                    store: item.store?.id || item.store_id || item.store,
                    quantity: parseInt(item.quantity || 1)
                }))
            };

            console.log("DEBUG: Attempting Order Registration", orderData);
            const response = await api.post('/orders/orders/', orderData);
            console.log("DEBUG: Order Registered Successfully", response.data);
            return { tx_ref: payment_ref, order: response.data };
        } catch (error) {
            const errorData = error.response?.data;
            console.error("Order creation failed:", errorData || error.message);

            // Extract a readable error message
            let msg = "Failed to register order.";
            let isStale = false;

            if (errorData && typeof errorData === 'object') {
                const errorStr = JSON.stringify(errorData);
                if (errorStr.includes("does not exist") && errorStr.includes("Product")) {
                    isStale = true;
                    msg = "Tribe Alert: Some items in your bag are no longer available. Your bag needs to be cleared.";
                } else if (errorData.items) {
                    msg = `Item Error: ${JSON.stringify(errorData.items)}`;
                } else if (errorData.total_amount) {
                    msg = `Amount Error: ${JSON.stringify(errorData.total_amount)}`;
                } else if (errorData.delivery_method) {
                    msg = `Delivery Error: ${JSON.stringify(errorData.delivery_method)}`;
                } else {
                    msg = `Order Failed: ${errorStr.substring(0, 100)}`;
                }
            } else if (error.message) {
                msg = `Network Error: ${error.message}`;
            }
            toast.error(msg, { duration: 5000 });

            if (isStale) {
                setTimeout(() => {
                    clearCart();
                    navigate('/marketplace');
                }, 3000);
            }
            throw error;
        } finally {
            setIsCreatingOrder(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mb-8">
                    <Shield size={40} />
                </div>
                <h2 className="text-2xl font-black text-[#1F2937] mb-2">Checkout Restricted</h2>
                <p className="text-gray-500 font-bold mb-10 max-w-sm">You haven't collected any drops in your bag yet.</p>
                <button onClick={() => navigate('/marketplace')} className="btn-primary">Go to Marketplace</button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto pb-32">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-[#1F2937] font-bold mb-6 sm:mb-10 transition-colors"
            >
                <ChevronLeft size={20} /> Back to Market
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    {/* Delivery Section */}
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] mb-4 sm:mb-6 tracking-tighter">Delivery Protocol</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isSameCampus ? (
                                <>
                                    {/* Scenario A: Same Campus */}
                                    <div
                                        onClick={() => setDeliveryMode('MEETUP')}
                                        className={`card-clean p-6 flex flex-col gap-4 cursor-pointer border-2 transition-all ${deliveryMode === 'MEETUP' ? 'border-[#10B981] bg-[#10B981]/5' : 'border-gray-50'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${deliveryMode === 'MEETUP' ? 'bg-[#10B981] text-white' : 'bg-gray-50 text-gray-400'}`}>
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1F2937]">Meet on Campus</h4>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Free / Standard Meetup</p>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setDeliveryMode('PLUG_DELIVERY')}
                                        className={`card-clean p-6 flex flex-col gap-4 cursor-pointer border-2 transition-all ${deliveryMode === 'PLUG_DELIVERY' ? 'border-[#10B981] bg-[#10B981]/5' : 'border-gray-50'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${deliveryMode === 'PLUG_DELIVERY' ? 'bg-[#10B981] text-white' : 'bg-gray-50 text-gray-400'}`}>
                                            <Truck size={20} />
                                        </div>
                                        <h4 className="font-bold text-[#1F2937]">Plug Delivery</h4>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Seller delivers to your hostel</p>
                                    </div>

                                    {/* Delivery Details Form */}
                                    {deliveryMode === 'PLUG_DELIVERY' && (
                                        <div className="md:col-span-2 card-clean bg-gray-50/50 p-4 space-y-4 border-2 border-[#10B981]/20 animate-in slide-in-from-top-2 fade-in">
                                            <h4 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
                                                <Truck size={14} className="text-[#10B981]" /> Delivery Details
                                            </h4>
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    name="address"
                                                    placeholder="Hostel / Room Number / Landmark"
                                                    value={deliveryDetails.address}
                                                    onChange={handleDeliveryChange}
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#10B981]"
                                                />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="Phone Number (for the runner)"
                                                    value={deliveryDetails.phone}
                                                    onChange={handleDeliveryChange}
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#10B981]"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Coming Soon */}
                                    <div
                                        title="We are building this network. It'll be available soon"
                                        className="card-clean p-6 flex flex-col gap-4 opacity-50 cursor-not-allowed border-2 border-dashed border-gray-200 grayscale"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center">
                                                <Zap size={20} />
                                            </div>
                                            <span className="bg-gray-100 text-gray-500 text-[8px] font-black px-2 py-0.5 rounded-full">COMING SOON</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-400">Tribe Runner</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Instant delivery by Tribe Agents</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Scenario B: Different Campus */}
                                    <div
                                        onClick={() => setDeliveryMode('WAYBILL')}
                                        className={`card-clean p-6 flex flex-col gap-4 cursor-pointer border-2 transition-all ${deliveryMode === 'WAYBILL' ? 'border-[#10B981] bg-[#10B981]/5' : 'border-gray-50'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${deliveryMode === 'WAYBILL' ? 'bg-[#10B981] text-white' : 'bg-gray-50 text-gray-400'}`}>
                                            <Truck size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#1F2937]">Plug Waybill</h4>
                                            {/* Check if any item has no waybill fee set */}
                                            {cart.some(item => !item.waybill_delivery_fee && item.waybill_delivery_fee !== 0 && item.waybill_delivery_fee !== '0' && item.waybill_delivery_fee !== '0.00') ? (
                                                <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
                                                        <Shield size={12} className="shrink-0" /> Delivery Unavailable
                                                    </p>
                                                    <p className="text-xs text-red-600 mt-1 font-medium leading-tight">
                                                        The seller has not set a waybill fee for one or more items in your bag.
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Seller handles shipping/waybill</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Coming Soon */}
                                    <div
                                        title="We are building this network. It'll be available soon"
                                        className="card-clean p-6 flex flex-col gap-4 opacity-50 cursor-not-allowed border-2 border-dashed border-gray-200 grayscale"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center">
                                                <Truck size={20} />
                                            </div>
                                            <span className="bg-gray-100 text-gray-500 text-[8px] font-black px-2 py-0.5 rounded-full">COMING SOON</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-400">Tribe Logistics</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secure inter-campus logistics</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div>
                        <h2 className="text-2xl font-black text-[#1F2937] mb-6 tracking-tighter">Secure Payment</h2>
                        <div className="card-clean bg-gray-50/50 p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#10B981]">
                                    <CreditCard size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-[#1F2937]">Paystack Gateway</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Cards, Bank, Transfer</p>
                                </div>
                                <ShieldCheck className="text-[#10B981]" size={24} />
                            </div>

                            <div className="p-4 bg-[#10B981]/10 rounded-xl border border-[#10B981]/10 flex items-start gap-3">
                                <ShieldCheck className="text-[#10B981] mt-0.5 shrink-0" size={18} />
                                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                    Your funds will be held in TribeGuard Escrow until you confirm receipt of the drop. No room for scope!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="space-y-6">
                    <div className="card-clean p-8">
                        <h3 className="text-xl font-black text-[#1F2937] mb-6">Order Summary</h3>
                        <div className="space-y-4 mb-8">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-[#1F2937]">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-black text-[#1F2937]">₦{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-4 sm:pt-6 border-t border-gray-50">
                            <div className="flex justify-between text-xs font-bold text-gray-500">
                                <span>Subtotal</span>
                                <span>₦{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-gray-500">
                                <span>Delivery Fee</span>
                                <span>₦{deliveryTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-orange-600">
                                <span>TribeGuard Fee (2%)</span>
                                <span>₦{protocolFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-4">
                                <span className="text-base sm:text-lg font-black text-[#1F2937]">Grand Total</span>
                                <span className="text-xl sm:text-2xl font-black text-[#10B981]">₦{grandTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <PaymentButton
                            amount={grandTotal}
                            email={user?.email}
                            name={user?.username}
                            tx_ref={txRef} // Use state ref
                            onSuccess={handleOrderAndPayment}
                            onBeforePayment={prepareOrder}
                            disabled={isCreatingOrder}
                        />
                    </div>

                    <div className="flex items-center justify-center gap-2 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all cursor-help">
                        <ShieldCheck size={16} className="text-[#10B981]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">TribeGuard Protected</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
