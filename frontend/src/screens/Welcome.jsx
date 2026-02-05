import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Zap, ArrowRight, CheckCircle2, Shield, UserCheck, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { mapTerm } from '../constants/dictionary';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F3F4F6] overflow-hidden font-['Outfit',sans-serif] text-[#1F2937]">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 sm:py-5 flex justify-between items-center liquid-glass animate-liquid !bg-white/30 border-b-0 transition-all duration-700">
                <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                    <div className="text-2xl sm:text-4xl font-black tracking-tighter hover:scale-105 transition-transform cursor-pointer">
                        Tribe<span className="text-[#10B981]">Trade</span>
                    </div>
                    <div className="flex gap-4 sm:gap-6 items-center">
                        <Link to="/login" className="text-[10px] sm:text-sm font-black text-gray-500 uppercase tracking-widest hover:text-[#1F2937]">Login</Link>
                        <Link to="/signup" className="btn-primary !py-2.5 sm:!py-3 !px-4 sm:!px-6 !text-[9px] sm:!text-[10px]">Join</Link>
                    </div>
                </div>
            </nav>

            <div className="pt-24">{/* Spacer for fixed nav */}</div>

            {/* Hero Section */}
            <main className="relative z-10 px-8 py-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                <div className="flex-1 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-orange-500/10 text-orange-600 rounded-full font-black text-[10px] uppercase tracking-[0.3em] mb-8"
                    >
                        <Flame size={14} className="animate-pulse" /> Trending: UNILAG Circle
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[clamp(2.5rem,10vw,5rem)] font-black leading-[0.9] tracking-tighter mb-8 sm:mb-10"
                    >
                        THE MARKET <br />
                        <span className="text-[#10B981]">OF THE TRIBE.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-500 font-bold mb-12 max-w-xl leading-relaxed mx-auto lg:mx-0"
                    >
                        Ditch the risky swaps. Build your campus hustle with <span className="text-[#10B981]">TribeGuard™ Escrow</span> and verified <span className="text-[#10B981]">GreenCheck™ Plugs</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                    >
                        <button
                            onClick={() => navigate('/signup')}
                            className="btn-primary !py-6 !px-12 !text-lg flex items-center justify-center gap-4"
                        >
                            Enter The Tribe <ArrowRight size={24} />
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, rotate: 10, scale: 0.9 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex-1 w-full max-w-xl lg:max-w-none px-4 sm:px-0"
                >
                    <div className="card-clean bg-white p-8 sm:p-12 shadow-2xl relative">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#10B981] rounded-full blur-[80px] opacity-20"></div>

                        <div className="flex items-center gap-4 sm:gap-5 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-gray-50">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#10B981]/10 text-[#10B981] rounded-2xl sm:rounded-3xl flex items-center justify-center shrink-0">
                                <Shield className="w-8 h-8 sm:w-9 sm:h-9" />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black tracking-tighter">TribeGuard Protection</h3>
                                <p className="text-gray-400 font-bold text-[10px] sm:text-sm uppercase tracking-widest">Protocol Active</p>
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0"></div>
                                <p className="text-xs sm:text-sm font-bold text-gray-600">Secure Escrow: Funds locked until delivery</p>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0"></div>
                                <p className="text-xs sm:text-sm font-bold text-gray-600">GreenCheck: Verified Plug IDs only</p>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0"></div>
                                <p className="text-xs sm:text-sm font-bold text-gray-600">Tribe Council: FairPlay resolution</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Info Section */}
            <section className="px-4 sm:px-8 py-20 sm:py-32 bg-white relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-20">
                    <div className="card-clean bg-[#1F2937] text-white p-8 sm:p-12 border-none">
                        <UserCheck className="text-[#10B981] mb-6 sm:mb-8" size={48} />
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mb-4 sm:mb-6">GreenCheck™ Verification</h2>
                        <p className="text-base sm:text-lg text-gray-300 font-bold leading-relaxed mb-6 sm:mb-8">
                            Every Plug (Vendor) on TribeTrade undergoes a mandatory ID check by the Tribe Council. When you see the GreenCheck, you're dealing with a verified student.
                        </p>
                        <div className="inline-flex items-center gap-2 text-[#10B981] font-black text-[10px] sm:text-xs uppercase tracking-[0.2em]">
                            <CheckCircle2 size={16} /> Identity Guaranteed
                        </div>
                    </div>

                    <div className="card-clean bg-[#10B981]/5 p-8 sm:p-12 border-none">
                        <ShieldCheck className="text-[#10B981] mb-6 sm:mb-8" size={48} />
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mb-4 sm:mb-6">TribeGuard™ Shield</h2>
                        <p className="text-base sm:text-lg text-gray-500 font-bold leading-relaxed mb-6 sm:mb-8">
                            Our proprietary escrow system. No money reaches the seller until you tap "Confirm arrival". If something's fishy, the Council resolves it.
                        </p>
                        <div className="inline-flex items-center gap-2 text-[#10B981] font-black text-[10px] sm:text-xs uppercase tracking-[0.2em]">
                            <Shield size={16} /> Zero-Risk Campus commerce
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Welcome;
