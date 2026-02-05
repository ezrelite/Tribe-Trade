import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Zap, ShoppingBag, ArrowUpRight, Plus, X, RotateCcw, CheckCircle2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mapTerm } from '../constants/dictionary';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import ErrorState from '../components/ErrorState';
import { useCart } from '../context/CartContext';

const Marketplace = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCircle, setActiveCircle] = useState('All');
    const [drops, setDrops] = useState([]);
    const [circles, setCircles] = useState(['All']);
    const [institutions, setInstitutions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('tribe_user') || '{}'));
    const { addToCart, cart } = useCart();

    // Advanced Filtering State
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        onlyAwoof: false,
        institution: ''
    });

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [dropsRes, catsRes, instRes] = await Promise.all([
                api.get('/store/marketplace/'),
                api.get('/store/circles/'),
                api.get('/core/institutions/')
            ]);
            setDrops(dropsRes.data);
            setCircles(['All', ...catsRes.data.map(c => c.name)]);
            setInstitutions(instRes.data);
        } catch (error) {
            console.error('Failed to load the latest Drops', error);
            setError({
                message: 'Could not load the latest Drops. The Tribe network might be under maintenance.',
                code: error.response?.status
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredDrops = drops.filter(drop => {
        const matchesCategory = activeCircle === 'All' || drop.category_name === activeCircle;
        const matchesSearch = drop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            drop.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const price = parseFloat(drop.price);
        const matchesMinPrice = !filters.minPrice || price >= parseFloat(filters.minPrice);
        const matchesMaxPrice = !filters.maxPrice || price <= parseFloat(filters.maxPrice);
        const matchesAwoof = !filters.onlyAwoof || drop.is_awoof;
        const matchesInstitution = !filters.institution || drop.institution_name === filters.institution;

        return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesAwoof && matchesInstitution;
    });

    const resetFilters = (clearCampus = false) => {
        setFilters({
            minPrice: '',
            maxPrice: '',
            onlyAwoof: false,
            institution: clearCampus ? '' : (user?.institution_name || '')
        });
        toast.success(clearCampus ? "All filters cleared" : "Filters reset to campus default");
    };

    const getImageUrl = (img) => {
        if (!img) return null;
        return img.startsWith('http') ? img : `${api.defaults.baseURL.replace('/api', '')}${img}`;
    };

    const gridVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    };

    return (
        <div className="p-4 md:p-10 max-w-7xl mx-auto pb-32 relative">
            {/* Filter Drawer Overlay */}
            <AnimatePresence>
                {!user.is_plug && showFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFilters(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-2xl font-black text-[#1F2937] tracking-tighter flex items-center gap-2">
                                    <Filter size={24} /> Advanced Filters
                                </h2>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10">
                                {/* Institution Filter */}
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Select Campus</label>
                                    <select
                                        value={filters.institution}
                                        onChange={(e) => setFilters({ ...filters, institution: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent rounded-xl py-4 px-4 outline-none focus:border-[#10B981] font-bold transition-all appearance-none"
                                    >
                                        <option value="">All Nigerian Campuses</option>
                                        {institutions.map(inst => (
                                            <option key={inst.id} value={inst.name}>{inst.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range Filter */}
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Price Boundary (₦)</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.minPrice}
                                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                            className="w-full bg-gray-50 border border-transparent rounded-xl py-4 px-4 outline-none focus:border-[#10B981] font-bold transition-all"
                                        />
                                        <span className="text-gray-300 font-black">—</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.maxPrice}
                                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                            className="w-full bg-gray-50 border border-transparent rounded-xl py-4 px-4 outline-none focus:border-[#10B981] font-bold transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Awoof Filter */}
                                <div className="pt-4">
                                    <button
                                        onClick={() => setFilters({ ...filters, onlyAwoof: !filters.onlyAwoof })}
                                        className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${filters.onlyAwoof
                                            ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]'
                                            : 'bg-white border-gray-100 text-gray-400 grayscale'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${filters.onlyAwoof ? 'bg-[#10B981] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                <Zap size={20} fill={filters.onlyAwoof ? "white" : "none"} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black uppercase tracking-widest text-[10px]">Special Status</p>
                                                <p className="font-black text-lg">Awoof Deals Only</p>
                                            </div>
                                        </div>
                                        {filters.onlyAwoof && <CheckCircle2 size={24} />}
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 border-t border-gray-50 flex gap-4 bg-gray-50/50">
                                <button
                                    onClick={() => resetFilters(true)}
                                    className="px-6 py-4 bg-white border border-gray-200 text-gray-500 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-100 transition-all shadow-sm"
                                >
                                    <RotateCcw size={16} /> Clear All
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="flex-1 btn-primary py-4 text-center"
                                >
                                    Sync Results
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Integrated Search & Filter Bar (Liquid Glass Style) */}
            <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10B981] transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="search here ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full liquid-glass animate-liquid text-[#1F2937] pl-12 pr-12 py-4 rounded-full border border-white/40 outline-none focus:border-[#10B981]/50 placeholder:text-gray-400 font-medium transition-all shadow-xl shadow-black/10"
                    />
                    <button
                        onClick={() => setShowFilters(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#1F2937] transition-colors"
                    >
                        <Filter size={20} />
                    </button>
                </div>
                <Link to="/cart" className="relative w-14 h-14 bg-white/70 backdrop-blur-xl rounded-full flex items-center justify-center text-[#1F2937] shadow-xl border border-white/40 hover:scale-105 transition-all">
                    <ShoppingBag size={22} />
                    {cart.length > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-[#10B981] text-white text-[8px] font-black rounded-full border-2 border-white flex items-center justify-center">
                            {cart.length}
                        </span>
                    )}
                </Link>
            </div>



            {/* Categories / Circles Section - Modern Horizontal List */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-[#1F2937] uppercase tracking-widest">Popular Circles</h3>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
                    {circles.map(circle => (
                        <button
                            key={circle}
                            onClick={() => setActiveCircle(circle)}
                            className="flex flex-col items-center gap-3 flex-shrink-0 group"
                        >
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center border transition-all duration-300 relative ${activeCircle === circle
                                ? 'border-[#10B981] bg-white ring-2 ring-[#10B981]/10'
                                : 'border-gray-100 bg-gray-50/50 group-hover:border-[#10B981]/30'
                                }`}>
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl ${activeCircle === circle ? 'bg-[#10B981] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                    {circle === 'All' ? '⚡' : circle[0]}
                                </div>
                            </div>
                            <span className={`text-[11px] font-black uppercase tracking-tighter ${activeCircle === circle ? 'text-[#1F2937]' : 'text-gray-400'}`}>
                                {circle}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Awoof Flash Sale Section */}
            {!isLoading && !error && filteredDrops.some(d => d.is_awoof) && (
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-[#1F2937] uppercase tracking-widest">Flash Sale</h3>
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                        </div>
                        <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Ends at</span>
                            <div className="flex items-center gap-1">
                                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded">11</span>
                                <span className="text-red-500 font-black text-[10px]">:</span>
                                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded">12</span>
                                <span className="text-red-500 font-black text-[10px]">:</span>
                                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded">02</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                        {filteredDrops.filter(d => d.is_awoof).map(drop => (
                            <Link
                                key={drop.id}
                                to={`/drop/${drop.id}`}
                                className="w-[160px] flex-shrink-0 group"
                            >
                                <div className="aspect-square rounded-3xl bg-gray-50 mb-4 overflow-hidden relative shadow-sm group-hover:shadow-md transition-all">
                                    <img
                                        src={getImageUrl(drop.image)}
                                        alt={drop.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors">
                                        <Heart size={14} />
                                    </div>
                                </div>
                                <h4 className="text-[11px] font-bold text-[#1F2937] truncate mb-1 px-1">{drop.name}</h4>
                                <div className="flex items-center gap-2 px-1">
                                    <span className="text-xs font-black text-[#1F2937]">₦{drop.price}</span>
                                    <span className="text-[10px] text-gray-400 font-bold line-through opacity-60">₦{Math.floor(drop.price * 1.5)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Marketplace Grid Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-[#1F2937] uppercase tracking-widest">Recent Drops</h3>
                <button
                    onClick={() => setShowFilters(true)}
                    className="text-[10px] font-black text-[#10B981] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                >
                    Expand All <ArrowUpRight size={12} />
                </button>
            </div>
            {/* Product Grid Area */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="py-10">
                    <ErrorState message={error.message} errorCode={error.code} onRetry={fetchData} />
                </div>
            ) : filteredDrops.length === 0 ? (
                <div className="text-center py-20 card-clean">
                    <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-gray-500">No {mapTerm('PRODUCT')}s matching your filters</h3>
                    <p className="text-gray-400 font-bold mb-6">Try broadening your search or switching Circles.</p>
                    {!user.is_plug && (
                        <div className="flex justify-center gap-4">
                            <button onClick={() => resetFilters(false)} className="btn-outline !text-[10px] !py-3">Home Campus Only</button>
                            <button onClick={() => resetFilters(true)} className="btn-primary !text-[10px] !py-3">Clear All Filters</button>
                        </div>
                    )}
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCircle + searchTerm + JSON.stringify(filters)}
                        variants={gridVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-8"
                    >
                        {filteredDrops.map(drop => (
                            <motion.div key={drop.id} variants={itemVariants} layout>
                                <Link
                                    to={`/drop/${drop.id}`}
                                    className="group block"
                                >
                                    <div className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] relative overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-all duration-500 border border-gray-100">
                                        {drop.image ? (
                                            <img
                                                src={getImageUrl(drop.image)}
                                                alt={drop.name}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-200 font-black text-4xl opacity-20 italic uppercase">
                                                {drop.name[0]}
                                            </div>
                                        )}

                                        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                                            <Heart size={18} />
                                        </div>

                                        {drop.is_awoof && (
                                            <div className="absolute bottom-4 left-4 bg-[#10B981] text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                                                <Zap size={10} fill="white" /> AWOOF
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-1">
                                        <h3 className="text-xs font-bold text-[#1F2937] truncate mb-1">{drop.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-[#1F2937]">₦{drop.price}</span>
                                            <span className="text-[10px] text-gray-400 font-bold line-through opacity-40">₦{Math.floor(drop.price * 1.3)}</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default Marketplace;
