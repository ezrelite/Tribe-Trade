import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, LogIn, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const SuperAdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        secret_key: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/users/super-admin/login/', {
                username: formData.email,
                password: formData.password,
                secret_key: formData.secret_key
            });

            toast.success('Access granted. Welcome back, Administrator.');

            localStorage.setItem('tribe_token', response.data.token);
            localStorage.setItem('tribe_user', JSON.stringify(response.data.user));

            navigate('/tribe-council');
        } catch (error) {
            const errorMsg = error.response?.data?.detail || 'Identity verification failed. Access denied.';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1F2937] flex items-center justify-center p-6 font-['Outfit',sans-serif] text-white">
            <div className="w-full max-w-md">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0.5, rotate: 10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-20 h-20 bg-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-white border border-white/20"
                    >
                        <ShieldCheck size={40} />
                    </motion.div>
                    <h1 className="text-3xl font-black tracking-tighter text-white">Council <span className="text-white">Access</span></h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Administrative Entrance</p>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Internal Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@tribetrade.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-white outline-none transition-all font-bold text-white placeholder:text-white/20"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Authority Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:border-white outline-none transition-all font-bold text-white placeholder:text-white/20"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Secret Mandate Code</label>
                            <input
                                type="password"
                                required
                                placeholder="Enter secret code"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-white outline-none transition-all font-bold text-white placeholder:text-white/10"
                                value={formData.secret_key}
                                onChange={(e) => setFormData({ ...formData, secret_key: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-[#1F2937] font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-xl disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-[#1F2937]/30 border-t-[#1F2937] rounded-full animate-spin"></div>
                            ) : (
                                <>Verify Identity <LogIn size={20} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-white/30 text-sm font-bold">
                            Request mandate? <Link to="/super-admin-signup" className="text-white hover:underline">Sign Up</Link>
                        </p>
                    </div>
                </motion.div>

                <div className="mt-10 flex items-center justify-center gap-3 text-white/40">
                    <ShieldAlert size={14} />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">Authorized Entry Only</span>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminLogin;
