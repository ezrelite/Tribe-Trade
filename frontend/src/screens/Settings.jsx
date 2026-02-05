import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Shield,
    Lock,
    ArrowRight,
    ChevronLeft,
    CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mapTerm } from '../constants/dictionary';
import api from '../services/api';
import ErrorState from '../components/ErrorState';
import TribeLoader from '../components/TribeLoader';

const Settings = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '', // New password if they want to change it
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/users/profile/');
                setFormData({
                    username: response.data.username,
                    email: response.data.email,
                    password: ''
                });
            } catch (error) {
                console.error("Failed to load settings.", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const dataToUpdate = { ...formData };
            if (!dataToUpdate.password) delete dataToUpdate.password;

            const response = await api.patch('/users/profile/', dataToUpdate);
            localStorage.setItem('tribe_user', JSON.stringify(response.data));
            toast.success("Profile sync successful!");
            setFormData({ ...formData, password: '' }); // Clear password field
        } catch (error) {
            toast.error(error.response?.data?.detail || "Update failed.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <TribeLoader size={64} />
        </div>
    );

    return (
        <div className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto pb-32">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-[#1F2937] font-bold mb-6 sm:mb-8 transition-colors"
            >
                <ChevronLeft size={20} /> Back
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 sm:mb-10">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1F2937] tracking-tighter">HQ Protocols</h1>
                    <p className="text-gray-500 font-bold text-xs sm:text-sm md:text-base">Configure your presence in the Tribe.</p>
                </div>
                <div className="hidden sm:flex w-10 h-10 md:w-12 md:h-12 bg-gray-50 text-gray-400 rounded-xl md:rounded-2xl items-center justify-center border border-gray-100">
                    <Shield className="w-6 h-6 md:w-7 md:h-7" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Identity Section */}
                <div className="card-clean space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <User size={18} className="text-[#10B981]" />
                        <h3 className="text-lg font-bold">Identity Console</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                                required
                                type="text"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 focus:border-[#10B981] outline-none transition-all font-bold"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                                required
                                type="email"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 focus:border-[#10B981] outline-none transition-all font-bold"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <p className="text-[10px] text-[#10B981] font-black uppercase tracking-wider flex items-center gap-1 px-1">
                            <CheckCircle2 size={10} /> Verified Academic Domain
                        </p>
                    </div>
                </div>

                {/* Security Section */}
                <div className="card-clean space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Lock size={18} className="text-[#10B981]" />
                        <h3 className="text-lg font-bold">Security & Encryption</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Update Secret Key (Password)</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 focus:border-[#10B981] outline-none transition-all font-bold"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <p className="text-xs text-gray-400 font-bold px-1">Leave blank to keep current password.</p>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full btn-primary py-4 md:py-5 text-sm md:text-base flex items-center justify-center gap-2 md:gap-3 shadow-lg shadow-[#10B981]/20 disabled:opacity-70 disabled:grayscale"
                >
                    {isSaving ? (
                        <>Encrypting... <TribeLoader size={20} color="#fff" /></>
                    ) : (
                        <>Apply Changes <ArrowRight size={20} /></>
                    )}
                </button>
            </form>
        </div>
    );
};

export default Settings;
