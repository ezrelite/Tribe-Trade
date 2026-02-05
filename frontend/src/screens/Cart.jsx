import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { mapTerm } from '../constants/dictionary';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

    if (cart.length === 0) {
        return (
            <div className="p-6 md:p-10 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-[2.5rem] flex items-center justify-center text-gray-300 mb-8">
                    <ShoppingBag size={48} />
                </div>
                <h1 className="heading-xl mb-4">Your Bag is Empty</h1>
                <p className="text-gray-500 font-bold mb-10 max-w-sm">
                    The Tribe marketplace is full of amazing drops. Start browsing to fill your stash!
                </p>
                <Link to="/marketplace" className="btn-primary px-10">
                    Go to Marketplace
                </Link>
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

            <div className="flex justify-between items-end mb-6 sm:mb-10">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937] tracking-tighter">Tribe Bag</h1>
                    <p className="text-gray-500 font-bold text-xs sm:text-sm">You have {cartCount} items ready for extraction.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="card-clean flex items-center gap-4 sm:gap-6 p-3 sm:p-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl flex items-center justify-center text-[#1F2937] font-black text-xl sm:text-2xl italic flex-shrink-0">
                                {item.name[0]}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-base sm:text-lg text-[#1F2937] truncate">{item.name}</h3>
                                <p className="text-[#10B981] font-black text-sm sm:text-base">₦{item.price}</p>

                                <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3">
                                    <div className="flex items-center bg-gray-50 rounded-lg p-0.5 sm:p-1">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="p-1 hover:text-[#10B981] transition-colors"
                                        >
                                            <Minus size={14} className="sm:w-4 sm:h-4" />
                                        </button>
                                        <span className="w-6 sm:w-8 text-center font-black text-xs sm:text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="p-1 hover:text-[#10B981] transition-colors"
                                        >
                                            <Plus size={14} className="sm:w-4 sm:h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1 space-y-6 sm:space-y-8">
                    {/* Delivery Section */}
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] mb-4 sm:mb-6 tracking-tighter">Delivery Protocol</h2>

                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-500 font-bold text-sm">
                                <span>Subtotal</span>
                                <span>₦{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-orange-600 font-bold text-sm">
                                <span>TribeGuard Fee (2%)</span>
                                <span>₦{(cartTotal * 0.02).toLocaleString()}</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                <span className="font-black text-[#1F2937]">Total</span>
                                <span className="text-2xl font-black text-[#10B981]">₦{(cartTotal * 1.02).toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full btn-primary py-4 flex items-center justify-center gap-3"
                        >
                            Checkout <ArrowRight size={20} />
                        </button>

                        <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                            {mapTerm('ESCROW')} SHIELDS WILL BE ACTIVATED UPON CHECKOUT.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
