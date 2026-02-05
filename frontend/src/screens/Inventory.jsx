import React, { useState, useEffect } from 'react';
import {
    Package,
    Edit2,
    Trash2,
    ExternalLink,
    Zap,
    Plus,
    Loader2,
    Search,
    ShoppingBag
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { mapTerm } from '../constants/dictionary';

const Inventory = () => {
    const navigate = useNavigate();
    const [drops, setDrops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchInventory = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/store/my-drops/');
            setDrops(response.data);
        } catch (error) {
            console.error("Failed to load inventory", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this drop? This action is permanent!")) return;

        try {
            await api.delete(`/store/my-drops/${id}/`);
            toast.success("Drop scrubbed from the marketplace.");
            setDrops(drops.filter(d => d.id !== id));
        } catch (error) {
            toast.error("Cleanup failed. Try again.");
        }
    };

    const toggleAwoof = async (drop) => {
        try {
            const updated = await api.patch(`/store/my-drops/${drop.id}/`, {
                is_awoof: !drop.is_awoof
            });
            toast.success(updated.data.is_awoof ? "Awoof mode ON! 🚀" : "Standard mode active.");
            setDrops(drops.map(d => d.id === drop.id ? updated.data : d));
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const filteredDrops = drops.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-[#10B981]" size={40} />
        </div>
    );

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="w-full sm:w-auto">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1F2937] tracking-tighter">My Inventory</h1>
                    <p className="text-gray-500 font-bold text-xs sm:text-sm">Manage your active {mapTerm('PRODUCT')}s.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter your drops..."
                            className="w-full bg-white border border-gray-100 rounded-xl py-3 sm:py-2 pl-10 pr-4 outline-none focus:border-[#10B981] transition-all font-bold text-sm sm:text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link to="/hq/drops/new" className="btn-primary flex items-center justify-center gap-2 px-4 md:px-6 py-4 sm:py-2">
                        <Plus size={18} /> <span>Create New</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDrops.length === 0 ? (
                    <div className="col-span-full py-20 text-center card-clean border-dashed border-2 border-gray-200 bg-transparent">
                        <Package className="mx-auto text-gray-200 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-gray-400">Empty Stash</h3>
                        <p className="text-gray-400 font-bold mb-8">You haven't listed any drops yet.</p>
                        <Link to="/hq/drops/new" className="text-[#10B981] font-black underline hover:text-[#059669]">List your first item now</Link>
                    </div>
                ) : filteredDrops.map(drop => (
                    <div key={drop.id} className="card-clean p-0 overflow-hidden flex flex-col group border-none shadow-md hover:shadow-xl transition-all">
                        {/* Status Overlay */}
                        <div className="aspect-[16/10] bg-gray-50 relative flex items-center justify-center text-gray-200 font-black text-3xl italic select-none overflow-hidden">
                            {drop.image ? (
                                <img
                                    src={drop.image.startsWith('http') ? drop.image : `${api.defaults.baseURL.replace('/api', '')}${drop.image}`}
                                    alt={drop.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                drop.name[0]
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => navigate(`/hq/drops/edit/${drop.id}`)}
                                    className="p-2 bg-white rounded-lg shadow-md text-gray-400 hover:text-[#10B981] hover:scale-110 transition-all"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(drop.id)}
                                    className="p-2 bg-white rounded-lg shadow-md text-gray-400 hover:text-red-500 hover:scale-110 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-[#1F2937] leading-tight group-hover:text-[#10B981] transition-colors">{drop.name}</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{drop.category_name}</p>
                                </div>
                                <span className="font-black text-[#10B981] text-lg bg-[#10B981]/5 px-2 py-1 rounded-lg">₦{drop.price}</span>
                            </div>

                            <div className="mt-auto space-y-4 pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => toggleAwoof(drop)}
                                    className={`w-full py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-2 ${drop.is_awoof ? 'bg-[#10B981] text-white border-[#10B981] shadow-lg shadow-[#10B981]/20' : 'bg-transparent text-gray-400 border-gray-100 hover:border-[#10B981]/30 hover:text-[#10B981]'}`}
                                >
                                    <Zap size={14} fill={drop.is_awoof ? "white" : "none"} />
                                    {drop.is_awoof ? "AWOOF MODE ACTIVE" : "ACTIVATE AWOOF"}
                                </button>

                                <Link
                                    to={`/drop/${drop.id}`}
                                    className="w-full text-center text-xs font-bold text-gray-400 hover:text-[#1F2937] flex items-center justify-center gap-1 transition-colors"
                                >
                                    View in Marketplace <ExternalLink size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Inventory;
