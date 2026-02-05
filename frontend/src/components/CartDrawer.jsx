import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-[#1F2937]/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
                    >
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#10B981]/10 text-[#10B981] rounded-xl flex items-center justify-center">
                                    <ShoppingBag size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-[#1F2937] tracking-tighter">Your Bag</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cartCount} Items Collected</p>
                                </div>
                            </div>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-50 rounded-lg transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mb-6">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1F2937] mb-2">Your bag is empty</h3>
                                    <p className="text-sm text-gray-400 font-bold max-w-[200px]">Go to the Marketplace and collect some drops!</p>
                                </div>
                            ) : cart.map((item) => (
                                <div key={item.id} className="flex gap-4 group">
                                    <div className="w-20 h-20 bg-[#F3F4F6] rounded-2xl flex items-center justify-center text-[#1F2937]/20 font-black text-xl italic overflow-hidden">
                                        {item.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-[#1F2937] leading-tight">{item.name}</h4>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className="text-[#10B981] font-black text-sm mb-4">₦{item.price}</p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center bg-gray-50 rounded-lg p-1">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md transition-all"><Minus size={14} /></button>
                                                <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md transition-all"><Plus size={14} /></button>
                                            </div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">
                                                Total: ₦{parseFloat(item.price) * item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-gray-50/50 border-t border-gray-100 space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Payload</p>
                                    <h3 className="text-3xl font-black text-[#1F2937]">₦{cartTotal.toFixed(2)}</h3>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1 text-[#10B981] text-[10px] font-black uppercase tracking-widest mb-1">
                                        <ShieldCheck size={12} fill="currentColor" /> TribeGuard
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-bold">Secure Escrow Active</p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setIsCartOpen(false);
                                    navigate('/checkout');
                                }}
                                disabled={cart.length === 0}
                                className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                Secure Checkout <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
