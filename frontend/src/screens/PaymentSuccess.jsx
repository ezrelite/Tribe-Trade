import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    // Auto-redirect removed per user request

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="card-clean max-w-md w-full text-center p-12 relative overflow-hidden"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[#10B981]"></div>

                <div className="mb-8 flex justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-[#10B981]/10 rounded-full flex items-center justify-center text-[#10B981]"
                    >
                        <CheckCircle2 size={60} />
                    </motion.div>
                </div>

                <h1 className="heading-xl mb-4 text-[#1F2937]">Payment Successful!</h1>
                <p className="text-gray-500 font-bold mb-10 leading-relaxed">
                    Your drops have been collected! The TribeGuard Protocol is now shielding your funds.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/orders')}
                        className="w-full btn-primary py-4 flex items-center justify-center gap-3"
                    >
                        Go to My Orders <ArrowRight size={20} />
                    </button>

                </div>

                {/* Micro-interaction decoration */}
                <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-center gap-2 text-gray-300">
                    <ShoppingBag size={16} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Tribe Extraction Complete</span>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
