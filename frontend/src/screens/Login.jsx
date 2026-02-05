import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { mapTerm } from '../constants/dictionary';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const loginData = {
                username: formData.email.trim().toLowerCase(),
                password: formData.password
            };
            const response = await api.post('/users/login/', loginData);
            localStorage.setItem('tribe_token', response.data.token);
            localStorage.setItem('tribe_user', JSON.stringify(response.data.user));

            toast.success(`Welcome back ${response.data.user.username}!`);

            // Redirect based on role or to dashboard
            if (response.data?.user?.is_plug) {
                navigate('/dashboard');
            } else {
                navigate('/marketplace');
            }
        } catch (error) {
            let errorMsg = 'Login failed. Check your credentials.';
            if (error.code === 'ERR_NETWORK') {
                errorMsg = 'Tribe Connection Failed! Ensure your phone can reach the backend (Laptop IP:8000). Check Firewalls.';
            } else if (error.response?.data?.non_field_errors) {
                errorMsg = error.response.data.non_field_errors[0];
            } else if (error.response?.data?.detail) {
                errorMsg = error.response.data.detail;
            }
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-[#F3F4F6] flex items-center justify-center font-['Outfit',sans-serif]"
            style={{ padding: 'clamp(1rem, 4vw, 1.5rem)' }}
        >
            <div className="w-full max-w-md">
                <div className="text-center" style={{ marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                    <Link
                        to="/"
                        className="font-black tracking-tighter text-[#1F2937]"
                        style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)' }}
                    >
                        Tribe<span className="text-[#10B981]">Trade</span>
                    </Link>
                    <p
                        className="text-gray-500 font-bold mt-2"
                        style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}
                    >
                        Enter the Market of the Tribe
                    </p>
                </div>

                <div className="card-clean" style={{ padding: 'clamp(1rem, 4vw, 2rem)' }}>
                    <h2
                        className="font-bold text-[#1F2937]"
                        style={{ fontSize: 'clamp(1.125rem, 4vw, 1.5rem)', marginBottom: 'clamp(1rem, 4vw, 2rem)' }}
                    >
                        Login
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="space-y-1.5 sm:space-y-2">
                            <label
                                className="font-black text-gray-400 uppercase tracking-widest"
                                style={{ fontSize: 'clamp(0.55rem, 1.5vw, 0.75rem)' }}
                            >
                                Email or Username
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-300"
                                    style={{ width: 'clamp(14px, 2vw, 18px)', height: 'clamp(14px, 2vw, 18px)' }}
                                />
                                <input
                                    type="text"
                                    required
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    placeholder="Enter your email or handle"
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl focus:border-[#10B981] focus:bg-white outline-none transition-all font-bold"
                                    style={{
                                        padding: 'clamp(0.625rem, 2vw, 0.875rem)',
                                        paddingLeft: 'clamp(2.25rem, 6vw, 3rem)',
                                        fontSize: 'clamp(0.8125rem, 2vw, 1rem)'
                                    }}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                            <label
                                className="font-black text-gray-400 uppercase tracking-widest"
                                style={{ fontSize: 'clamp(0.55rem, 1.5vw, 0.75rem)' }}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-300"
                                    style={{ width: 'clamp(14px, 2vw, 18px)', height: 'clamp(14px, 2vw, 18px)' }}
                                />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl focus:border-[#10B981] focus:bg-white outline-none transition-all font-bold"
                                    style={{
                                        padding: 'clamp(0.625rem, 2vw, 0.875rem)',
                                        paddingLeft: 'clamp(2.25rem, 6vw, 3rem)',
                                        fontSize: 'clamp(0.8125rem, 2vw, 1rem)'
                                    }}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full btn-primary flex items-center justify-center gap-2 sm:gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            style={{
                                padding: 'clamp(0.75rem, 2vw, 1rem)',
                                fontSize: 'clamp(0.8125rem, 2vw, 1.125rem)'
                            }}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>Enter HQ <LogIn style={{ width: 'clamp(16px, 2vw, 20px)', height: 'clamp(16px, 2vw, 20px)' }} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-50 text-center">
                        <p
                            className="text-gray-500 font-bold"
                            style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                        >
                            Don't have an account? <Link to="/signup" className="text-[#10B981] font-black hover:underline transition-all">Join the Tribe</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6 sm:mt-8 text-center">
                    <div
                        className="inline-flex items-center gap-2 font-black text-gray-300 uppercase tracking-widest"
                        style={{ fontSize: 'clamp(0.5rem, 1.5vw, 0.625rem)' }}
                    >
                        <AlertCircle style={{ width: 'clamp(10px, 1.5vw, 12px)', height: 'clamp(10px, 1.5vw, 12px)' }} />
                        Protected by {mapTerm('ESCROW')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
