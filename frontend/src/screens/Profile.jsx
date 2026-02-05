import React, { useState, useEffect, useRef } from 'react';
import {
    User, Mail, MapPin, ShieldCheck, LogOut, ChevronRight,
    ShoppingBag, ChevronLeft, CheckCircle2, Zap, Settings as SettingsIcon,
    Lock, ArrowRight, Camera
} from 'lucide-react';
import { mapTerm } from '../constants/dictionary';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import TribeLoader from '../components/TribeLoader';

const Profile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('tribe_user') || '{}'));
    const [store, setStore] = useState(null);
    const [drops, setDrops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Settings Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const profileRes = await api.get('/users/profile/');
            const currentUser = profileRes.data;
            setUser(currentUser);
            localStorage.setItem('tribe_user', JSON.stringify(currentUser));

            setFormData({
                username: currentUser.username,
                email: currentUser.email,
                password: ''
            });

            if (currentUser.is_plug) {
                const [storeRes, dropsRes] = await Promise.all([
                    api.get('/store/hustle-hq/my_store/'),
                    api.get('/store/my-drops/')
                ]);
                setStore(storeRes.data);
                setDrops(dropsRes.data);
            }
        } catch (error) {
            console.error("Failed to sync profile data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getImageUrl = (img) => {
        if (!img) return null;
        return img.startsWith('http') ? img : `${api.defaults.baseURL.replace('/api', '')}${img}`;
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        toast.success("Safe travels, Tribe member!");
        setTimeout(() => {
            localStorage.removeItem('tribe_token');
            localStorage.removeItem('tribe_user');
            window.location.href = '/';
        }, 1000);
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const dataToUpdate = { ...formData };
            if (!dataToUpdate.password) delete dataToUpdate.password;

            const response = await api.patch('/users/profile/', dataToUpdate);
            setUser(response.data);
            localStorage.setItem('tribe_user', JSON.stringify(response.data));
            toast.success("Profile sync successful!");
            setFormData({ ...formData, password: '' });
        } catch (error) {
            toast.error(error.response?.data?.detail || "Update failed.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('avatar', file);

        setIsUploading(true);
        const toastId = toast.loading('Syncing your new look...');

        try {
            const response = await api.patch('/users/profile/', uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser(response.data);
            localStorage.setItem('tribe_user', JSON.stringify(response.data));
            toast.success('PFP Updated!', { id: toastId });
        } catch (error) {
            toast.error('Upload failed. Try a smaller image.', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <TribeLoader size={64} />
        </div>
    );

    // PLUG DASHBOARD VIEW
    if (user.is_plug) {
        return (
            <div className="pb-32 bg-[#F3F4F6]">
                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                />

                {/* Header / HQ Banner Area */}
                <div className="bg-white border-b border-gray-100 mb-6 sm:mb-10 overflow-hidden">
                    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#1F2937] font-bold mb-6 sm:mb-8 transition-colors"
                        >
                            <ChevronLeft size={20} /> Back
                        </button>

                        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-start text-center md:text-left">
                            <div className="relative group shrink-0">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-[#10B981] rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-xl shadow-[#10B981]/20 group-hover:scale-105 transition-all overflow-hidden border-4 border-white">
                                    {user.avatar ? (
                                        <img
                                            src={getImageUrl(user.avatar)}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        user.username?.[0].toUpperCase()
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <TribeLoader size={24} color="#fff" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-0 right-0 bg-[#10B981] p-2 rounded-xl shadow-lg text-white hover:bg-[#059669] transition-all border-2 border-white scale-90 md:scale-100"
                                >
                                    <Camera size={16} />
                                </button>
                            </div>

                            <div className="flex-1 space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <h1 className="text-3xl sm:text-4xl font-black text-[#1F2937] tracking-tighter">My HQ</h1>
                                    <CheckCircle2 size={24} className="text-[#10B981]" />
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 items-center text-gray-500 font-bold text-xs sm:text-sm">
                                    <p className="flex items-center gap-1.5"><MapPin size={16} className="sm:w-[18px] sm:h-[18px]" /> {user.institution_name || 'The Tribe'}</p>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></span>
                                    <p className="flex items-center gap-1.5"><ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" /> {drops.length} Active Drops</p>
                                    <div className="flex items-center gap-1 text-[#10B981] bg-[#10B981]/5 px-3 py-1 rounded-full text-[10px] sm:text-xs">
                                        <ShieldCheck size={14} /> TribeGuard Shield Covered
                                    </div>
                                </div>

                                <p className="max-w-2xl text-gray-500 leading-relaxed font-medium text-xs sm:text-sm md:text-base">
                                    Serving the Tribe with high-quality gear and essential campus drops. Check out my latest below.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-6 md:px-10 mb-20">
                    <div className="flex items-baseline justify-between mb-8">
                        <div className="flex items-baseline gap-2 flex-1">
                            <h2 className="text-2xl font-black text-[#1F2937]">Current Drops</h2>
                            <div className="h-px flex-1 bg-gray-100"></div>
                        </div>
                        {drops.length > 4 && (
                            <Link to="/hq/drops" className="text-[#10B981] font-black text-xs uppercase tracking-widest ml-4 hover:underline">
                                View All
                            </Link>
                        )}
                    </div>

                    {drops.length === 0 ? (
                        <div className="text-center py-20 card-clean bg-white">
                            <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-gray-500">Your Shop's Empty</h3>
                            <p className="text-gray-400 font-bold mb-6">Launch your first drop to start earning Rep.</p>
                            <button onClick={() => navigate('/hq/drops/new')} className="btn-primary flex items-center gap-2 !px-4 md:!px-10">
                                <Plus size={18} className="md:hidden" />
                                <span className="hidden md:inline">Launch Drop</span>
                                <Plus size={18} className="hidden md:inline" />
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {drops.slice(0, 4).map(drop => (
                                <Link
                                    key={drop.id}
                                    to={`/drop/${drop.id}`}
                                    className="card-clean p-0 group overflow-hidden border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all bg-white"
                                >
                                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-300/50 font-black text-4xl uppercase italic select-none">
                                            {drop.name[0]}
                                        </div>
                                        {drop.image && (
                                            <img
                                                src={getImageUrl(drop.image)}
                                                alt={drop.name}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        )}
                                        {drop.is_awoof && (
                                            <div className="absolute top-2 left-2 bg-[#10B981] text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg z-10">
                                                <Zap size={8} fill="white" /> AWOOF
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-bold text-[#1F2937] text-xs leading-tight group-hover:text-[#10B981] transition-colors mb-2 truncate">{drop.name}</h3>
                                        <span className="text-[#10B981] font-black text-sm">₦{drop.price}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Settings Form Section at the End */}
                <div className="max-w-3xl mx-auto px-6 md:px-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-px flex-1 bg-gray-100"></div>
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <SettingsIcon size={16} /> HQ Protocol Settings
                        </h2>
                        <div className="h-px flex-1 bg-gray-100"></div>
                    </div>

                    <form onSubmit={handleSettingsSubmit} className="space-y-6">
                        <div className="card-clean bg-white space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            disabled
                                            type="email"
                                            className="w-full bg-gray-100 border border-transparent rounded-xl py-4 pl-12 pr-4 outline-none font-bold text-gray-500 cursor-not-allowed"
                                            value={formData.email}
                                        />
                                    </div>
                                </div>
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
                                <p className="text-[10px] text-gray-400 font-bold">Leave blank to keep your current encryption.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isSaving ? "Encrypting..." : <>Apply Changes <ArrowRight size={18} /></>}
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-all shadow-sm"
                            >
                                <LogOut size={24} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // ORIGINAL CITIZEN IDENTITY VIEW (REMAINING SAME BUT SLIGHTLY POLISHED)
    return (
        <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto pb-32">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-12">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1F2937] tracking-tighter">Your Identity</h1>
                    <p className="text-gray-500 font-bold text-xs sm:text-sm md:text-base">Manage your Rep and presence in the Tribe.</p>
                </div>
                <div className="hidden sm:flex w-10 h-10 md:w-12 md:h-12 bg-[#10B981]/10 text-[#10B981] rounded-xl md:rounded-2xl items-center justify-center">
                    <User className="w-6 h-6 md:w-7 md:h-7" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <div className="card-clean flex flex-col items-center text-center">
                        <div className="relative group mb-4">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#10B981] rounded-2xl md:rounded-3xl flex items-center justify-center text-white text-2xl md:text-3xl font-black shadow-lg shadow-[#10B981]/20 overflow-hidden border-2 border-white">
                                {user.avatar ? (
                                    <img
                                        src={getImageUrl(user.avatar)}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    user.username?.[0]?.toUpperCase() || 'U'
                                )}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <TribeLoader size={16} color="#fff" />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute -bottom-1 -right-1 bg-[#10B981] p-1.5 rounded-lg shadow-md text-white hover:bg-[#059669] transition-all border border-white"
                            >
                                <Camera size={12} />
                            </button>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold truncate max-w-full">{user.username}</h3>
                        <p className="text-[#10B981] font-bold text-xs md:text-sm uppercase tracking-widest">
                            Verified {user.is_plug ? mapTerm('PLUG') : mapTerm('CITIZEN')}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/settings')}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 text-[#1F2937] rounded-xl font-bold text-sm hover:bg-gray-100 transition-all group mb-3"
                    >
                        <div className="flex items-center gap-3">
                            <SettingsIcon size={18} /> Protocols
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500" />
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between p-4 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut size={18} /> Logout
                        </div>
                        <ChevronRight size={16} className="text-red-200 group-hover:text-red-400" />
                    </button>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="card-clean space-y-6">
                        <h4 className="text-lg font-bold border-b border-gray-50 pb-4">Personal Information</h4>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                <Mail size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Email Address</p>
                                <p className="font-bold text-base md:text-lg text-[#1F2937] truncate">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Primary Campus</p>
                                <p className="font-bold">{user?.institution_name || 'The Tribe'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-[#10B981]">
                            <div className="w-10 h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest">Security Status</p>
                                <p className="font-bold">{mapTerm('ESCROW')} Shield Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
