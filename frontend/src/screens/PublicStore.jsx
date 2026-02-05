import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    MapPin,
    Zap,
    ShoppingBag,
    ArrowUpRight,
    ChevronLeft,
    CheckCircle2,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import { mapTerm } from '../constants/dictionary';
import api from '../services/api';
import ErrorState from '../components/ErrorState';
import TribeLoader from '../components/TribeLoader';

const PublicStore = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [drops, setDrops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch store info and its drops
            const [storeRes, dropsRes] = await Promise.all([
                api.get(`/store/hustle-hq/${id}/`),
                api.get(`/store/marketplace/?store=${id}`)
            ]);
            setStore(storeRes.data);
            setDrops(dropsRes.data);
        } catch (error) {
            console.error('Failed to load store', error);
            setError("We couldn't reach this Plug's shop right now.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <TribeLoader size={64} />
        </div>
    );

    if (error) return (
        <div className="p-10 max-w-2xl mx-auto min-h-[60vh] flex items-center">
            <ErrorState message={error} onRetry={fetchData} />
        </div>
    );

    if (!store) return null;

    return (
        <div className="pb-32">
            {/* Header / Banner */}
            <div className="bg-white border-b border-gray-100 mb-10 overflow-hidden">
                <div className="max-w-7xl mx-auto p-6 md:p-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#1F2937] font-bold mb-8 transition-colors"
                    >
                        <ChevronLeft size={20} /> Back
                    </button>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-[#10B981] rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-[#10B981]/20">
                            {store.name?.[0].toUpperCase()}
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2">
                                <h1 className="text-4xl font-black text-[#1F2937] tracking-tighter">{store.name}</h1>
                                {store.has_greencheck && <CheckCircle2 size={24} className="text-[#10B981]" />}
                            </div>

                            <div className="flex flex-wrap gap-4 items-center text-gray-500 font-bold">
                                <p className="flex items-center gap-1.5"><MapPin size={18} /> {store.institution_name}</p>
                                <span className="w-1 h-1 bg-gray-300 rounded-full hidden md:block"></span>
                                <p className="flex items-center gap-1.5"><ShoppingBag size={18} /> {drops.length} Active Drops</p>
                                <span className="w-1 h-1 bg-gray-300 rounded-full hidden md:block"></span>
                                <div className="flex items-center gap-1 text-[#10B981] bg-[#10B981]/5 px-3 py-1 rounded-full text-xs">
                                    <ShieldCheck size={14} /> {mapTerm('ESCROW')} Covered
                                </div>
                            </div>

                            <p className="max-w-2xl text-gray-500 leading-relaxed font-medium">
                                Serving the Tribe with high-quality gear and essential campus drops. Check out my latest below.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="flex items-baseline gap-2 mb-8">
                    <h2 className="text-2xl font-black text-[#1F2937]">Current Drops</h2>
                    <div className="h-px flex-1 bg-gray-100"></div>
                </div>

                {drops.length === 0 ? (
                    <div className="text-center py-20 card-clean">
                        <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-gray-500">Shop's Currently Empty</h3>
                        <p className="text-gray-400 font-bold">This Plug hasn't listed any drops yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {drops.map(drop => (
                            <Link
                                key={drop.id}
                                to={`/drop/${drop.id}`}
                                className="card-clean p-0 group overflow-hidden border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-300/50 font-black text-4xl uppercase italic select-none">
                                        {drop.name[0]}
                                    </div>
                                    {drop.is_awoof && (
                                        <div className="absolute top-4 left-4 bg-[#10B981] text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                            <Zap size={10} fill="white" /> AWOOF
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#10B981] opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                        <ArrowUpRight size={20} />
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="font-bold text-[#1F2937] leading-tight group-hover:text-[#10B981] transition-colors mb-2">{drop.name}</h3>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                                        <span className="text-[#10B981] font-black text-xl">₦{drop.price}</span>
                                        <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <MapPin size={10} /> {drop.institution_name}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicStore;
