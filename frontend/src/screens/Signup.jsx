import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Store, MapPin, ArrowRight, UserPlus, Search, Eye, EyeOff, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { mapTerm } from '../constants/dictionary';
import { NIGERIAN_INSTITUTIONS } from '../data/nigerianInstitutions';
import TribeLoader from '../components/TribeLoader';

const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [hasError, setHasError] = useState(false);
    // Use dynamic API data
    const [institutions, setInstitutions] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        is_plug: false,
        institution: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await api.get('/core/institutions/');
                setInstitutions(response.data);
            } catch (err) {
                console.error("Failed to fetch institutions", err);
            }
        };
        fetchInstitutions();
    }, []);

    const getPasswordStrength = (pass) => {
        if (!pass) return { score: 0, label: 'Empty', color: 'bg-gray-200' };
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (score <= 1) return { score, label: 'Weak', color: 'bg-red-400' };
        if (score === 2) return { score, label: 'Fair', color: 'bg-yellow-400' };
        if (score === 3) return { score, label: 'Good', color: 'bg-blue-400' };
        return { score, label: 'Strong', color: 'bg-[#10B981]' };
    };

    const strength = getPasswordStrength(formData.password);
    const isPasswordSecure = strength.score >= 3;

    const filteredInstitutions = (institutions || []).filter(inst => {
        const search = (searchTerm || "").toLowerCase();
        return (inst.name || "").toLowerCase().includes(search) ||
            (inst.inst_type || "").toLowerCase().includes(search) ||
            (inst.inst_category || "").toLowerCase().includes(search) ||
            (inst.state || "").toLowerCase().includes(search);
    });

    const groupedInstitutions = filteredInstitutions.reduce((acc, inst) => {
        const typeRaw = inst.inst_type || "Other";
        const type = typeRaw.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if (!acc[type]) acc[type] = [];
        acc[type].push(inst);
        return acc;
    }, {});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const registrationData = {
                ...formData,
                email: formData.email.trim().toLowerCase(),
                username: formData.username.trim(),
                is_citizen: !formData.is_plug
            };
            console.log('Attempting registration with:', registrationData);
            const response = await api.post('/users/register/', registrationData);
            console.log('Registration response:', response.data);
            toast.success('Welcome to the Tribe!');

            if (response.data && response.data.token) {
                localStorage.setItem('tribe_token', response.data.token);
                localStorage.setItem('tribe_user', JSON.stringify(response.data.user));
                navigate(formData.is_plug ? '/dashboard' : '/marketplace');
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);
            console.error('Error response:', error.response?.data);

            // More detailed error handling
            let errorMsg = 'Registration failed.';
            if (error.code === 'ERR_NETWORK') {
                errorMsg = 'Network error: Cannot connect to server. Please check if the backend is running.';
            } else if (error.response?.data) {
                const data = error.response.data;
                errorMsg = data.email?.[0] || data.username?.[0] || data.password?.[0] || data.detail || data.non_field_errors?.[0] || JSON.stringify(data);
            } else if (error.message) {
                errorMsg = error.message;
            }
            setHasError(true);
            setTimeout(() => setHasError(false), 500);
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
            <div className="w-full max-w-lg">
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
                        Join the hyper-local movement
                    </p>
                </div>

                <div
                    className="bg-white shadow-xl border border-gray-100 relative overflow-hidden"
                    style={{ borderRadius: 'clamp(1.5rem, 4vw, 2rem)', padding: 'clamp(1.25rem, 4vw, 2rem)' }}
                >
                    <div className="flex justify-between items-center" style={{ marginBottom: 'clamp(1.25rem, 4vw, 2.5rem)' }}>
                        <h2
                            className="font-bold text-[#1F2937]"
                            style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}
                        >
                            Create Account
                        </h2>
                        <div className="flex gap-1 sm:gap-1.5">
                            <div className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ${step === 1 ? 'bg-[#10B981]' : 'bg-gray-100'}`} style={{ width: 'clamp(1.5rem, 4vw, 2.5rem)' }}></div>
                            <div className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ${step === 2 ? 'bg-[#10B981]' : 'bg-gray-100'}`} style={{ width: 'clamp(1.5rem, 4vw, 2.5rem)' }}></div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="relative z-10">
                        {step === 1 ? (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setFormData({ ...formData, is_plug: false })}
                                        className={`p-6 flex flex-col items-center cursor-pointer border-2 transition-all rounded-[1.5rem] ${!formData.is_plug ? 'border-[#10B981] bg-[#10B981]/5' : 'border-gray-50 bg-white'}`}
                                    >
                                        <motion.div
                                            animate={!formData.is_plug ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <User className={!formData.is_plug ? 'text-[#10B981]' : 'text-gray-400'} size={32} />
                                        </motion.div>
                                        <span className={`text-sm font-black mt-3 ${!formData.is_plug ? 'text-[#10B981]' : 'text-gray-500'}`}>{mapTerm('CITIZEN')}</span>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setFormData({ ...formData, is_plug: true })}
                                        className={`p-6 flex flex-col items-center cursor-pointer border-2 transition-all rounded-[1.5rem] ${formData.is_plug ? 'border-[#10B981] bg-[#10B981]/5' : 'border-gray-50 bg-white'}`}
                                    >
                                        <motion.div
                                            animate={formData.is_plug ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <Store className={formData.is_plug ? 'text-[#10B981]' : 'text-gray-400'} size={32} />
                                        </motion.div>
                                        <span className={`text-sm font-black mt-3 ${formData.is_plug ? 'text-[#10B981]' : 'text-gray-500'}`}>{mapTerm('PLUG')}</span>
                                    </motion.div>
                                </div>

                                <div className="space-y-3 sm:space-y-4 relative">
                                    <label className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest px-2">Select Your Campus</label>
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#10B981]" size={18} className="sm:w-5 sm:h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search school name..."
                                            className={`w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3 sm:py-4 pl-11 sm:pl-12 pr-4 focus:border-[#10B981] focus:bg-white outline-none transition-all font-bold text-[#1F2937] text-sm sm:text-base ${hasError && !formData.institution ? 'animate-shake border-red-500' : ''}`}
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setShowDropdown(true);
                                            }}
                                            onFocus={() => setShowDropdown(true)}
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {showDropdown && (
                                            <>
                                                {/* Backdrop overlay - closes dropdown when clicking outside */}
                                                <div
                                                    className="fixed inset-0 z-40 bg-transparent"
                                                    onClick={() => setShowDropdown(false)}
                                                    onTouchEnd={() => setShowDropdown(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border border-gray-100 max-h-[250px] sm:max-h-[300px] overflow-y-auto overscroll-contain p-2 sm:p-3"
                                                    style={{
                                                        WebkitOverflowScrolling: 'touch',
                                                        touchAction: 'pan-y',
                                                        overscrollBehavior: 'contain'
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onTouchStart={(e) => e.stopPropagation()}
                                                    onTouchMove={(e) => e.stopPropagation()}
                                                >
                                                    {Object.entries(groupedInstitutions).length > 0 ? (
                                                        Object.entries(groupedInstitutions).map(([type, items]) => (
                                                            <div key={type} className="mb-3 sm:mb-4 last:mb-0">
                                                                <div className="px-3 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2 sticky top-0 bg-white z-10">
                                                                    {type} <div className="h-px flex-1 bg-gray-100"></div>
                                                                </div>
                                                                <div className="space-y-0.5 sm:space-y-1">
                                                                    {items.map(inst => (
                                                                        <button
                                                                            type="button"
                                                                            key={inst.id}
                                                                            onTouchEnd={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                setFormData({ ...formData, institution: inst.id });
                                                                                setSearchTerm(inst.name);
                                                                                setShowDropdown(false);
                                                                            }}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                setFormData({ ...formData, institution: inst.id });
                                                                                setSearchTerm(inst.name);
                                                                                setShowDropdown(false);
                                                                            }}
                                                                            className={`w-full text-left p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between active:scale-[0.98] select-none ${formData.institution === inst.id
                                                                                ? 'bg-[#10B981]/10 text-[#10B981]'
                                                                                : 'hover:bg-gray-50 active:bg-gray-100 text-gray-600'
                                                                                }`}
                                                                        >
                                                                            <div className="flex-1 min-w-0 pr-2">
                                                                                <span className="font-bold text-xs sm:text-sm block leading-tight truncate">{inst.name}</span>
                                                                                <span className="text-[9px] sm:text-[10px] opacity-60 uppercase tracking-tight font-bold truncate block">{inst.inst_category} • {inst.state}</span>
                                                                            </div>
                                                                            {formData.institution === inst.id && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#10B981] flex-shrink-0" />}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-6 sm:p-8 text-center">
                                                            <MapPin className="mx-auto text-gray-200 mb-2" size={24} className="sm:w-7 sm:h-7" />
                                                            <p className="text-gray-400 font-bold text-xs sm:text-sm">No campus found.</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => formData.institution && setStep(2)}
                                    disabled={!formData.institution}
                                    className="w-full btn-primary py-5 flex items-center justify-center gap-4 text-sm disabled:opacity-50"
                                >
                                    On to the Next <ArrowRight size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Choose Handle</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            required
                                            autoCapitalize="none"
                                            autoCorrect="off"
                                            placeholder="e.g. tribe_master"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:border-[#10B981] outline-none font-bold text-[#1F2937]"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Secure Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="email"
                                            required
                                            autoCapitalize="none"
                                            autoCorrect="off"
                                            placeholder="hero@tribe.com"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:border-[#10B981] outline-none font-bold text-[#1F2937]"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Access Key</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            placeholder="••••••••"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-12 focus:border-[#10B981] outline-none font-bold text-[#1F2937]"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#10B981] transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <div className="flex gap-1.5 mt-3 px-1">
                                        {[1, 2, 3, 4].map((s) => (
                                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${s <= strength.score ? strength.color : 'bg-gray-100'}`}></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 btn-outline py-5"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !isPasswordSecure}
                                        className="flex-[2] btn-primary py-5 flex items-center justify-center gap-3 text-sm disabled:opacity-50"
                                    >
                                        {isLoading ? <TribeLoader size={20} color="#fff" /> : <>Finalize Join <UserPlus size={20} /></>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                        <p className="text-gray-400 text-sm font-bold">
                            Tribe member? <Link to="/login" className="text-[#10B981] font-black hover:underline ml-1">Sign In to HQ</Link>
                        </p>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Signup;
