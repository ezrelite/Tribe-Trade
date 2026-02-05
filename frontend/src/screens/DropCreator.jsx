import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Plus,
    ArrowRight,
    Image as ImageIcon,
    Tag,
    Info,
    Zap,
    CheckCircle2,
    ChevronLeft,
    Loader2,
    Truck
} from 'lucide-react';
import { mapTerm } from '../constants/dictionary';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const DropCreator = () => {
    const { id } = useParams(); // For edit mode
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        is_awoof: false,
        discount_percentage: 0,
        is_awoof: false,
        discount_percentage: 0,
        campus_delivery_fee: '0.00',
        waybill_delivery_fee: '',
        image: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null
    });
    const [deliveryMode, setDeliveryMode] = useState('FREE'); // FREE or PAID
    const [previews, setPreviews] = useState({
        image: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null
    });

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, [field]: file }));
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            setPreviews(prev => ({ ...prev, [field]: null }));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const catRes = await api.get('/store/circles/');
                setCategories(catRes.data);

                if (isEditMode) {
                    const dropRes = await api.get(`/store/my-drops/${id}/`);
                    setFormData({
                        name: dropRes.data.name,
                        price: dropRes.data.price,
                        description: dropRes.data.description,
                        category: dropRes.data.category,
                        is_awoof: dropRes.data.is_awoof,
                        discount_percentage: dropRes.data.discount_percentage || 0,
                        is_awoof: dropRes.data.is_awoof,
                        discount_percentage: dropRes.data.discount_percentage || 0,
                        campus_delivery_fee: dropRes.data.campus_delivery_fee || '0.00',
                        waybill_delivery_fee: dropRes.data.waybill_delivery_fee || '',
                        image: null,
                        image2: null,
                        image3: null,
                        image4: null,
                        image5: null
                    });
                    setPreviews({
                        image: dropRes.data.image,
                        image2: dropRes.data.image2,
                        image3: dropRes.data.image3,
                        image4: dropRes.data.image4,
                        image5: dropRes.data.image5
                    });
                    setDeliveryMode(parseFloat(dropRes.data.campus_delivery_fee) > 0 ? 'PAID' : 'FREE');
                }
            } catch (error) {
                console.error("Failed to load setup data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (['image', 'image2', 'image3', 'image4', 'image5'].includes(key)) {
                    if (formData[key] instanceof File) data.append(key, formData[key]);
                } else if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
                    data.append(key, formData[key]);
                }
            });

            if (isEditMode) {
                await api.patch(`/store/my-drops/${id}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Drop updated successfully!");
            } else {
                await api.post('/store/my-drops/', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("New Drop is live!");
            }
            navigate('/hq/drops');
        } catch (error) {
            console.error("Drop creation failed:", error.response?.data || error.message);
            let errorMsg = "Submission failed. Check your data.";

            if (error.response?.data) {
                const data = error.response.data;
                if (typeof data === 'string') {
                    errorMsg = data.length < 100 ? data : "Server error. Please check your inputs.";
                } else if (data.detail) {
                    errorMsg = data.detail;
                } else if (Array.isArray(data)) {
                    errorMsg = data.join(', ');
                } else if (typeof data === 'object') {
                    errorMsg = Object.entries(data)
                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                        .join(' | ');
                }
            } else if (error.message) {
                errorMsg = error.message;
            }

            toast.error(errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-[#10B981]" size={40} />
        </div>
    );

    return (
        <div className="p-6 md:p-10 max-w-3xl mx-auto pb-32">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-[#1F2937] font-bold mb-8 transition-colors"
            >
                <ChevronLeft size={20} /> Back
            </button>

            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-black text-[#1F2937] tracking-tighter">
                        {isEditMode ? 'Refine Your Drop' : 'Create New Drop'}
                    </h1>
                    <p className="text-gray-500 font-bold">List your {mapTerm('PRODUCT')} in the Tribe Marketplace.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="card-clean space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Info size={18} className="text-[#10B981]" />
                        <h3 className="text-lg font-bold">Basic Details</h3>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Drop Visuals (Lead Image + 4 Optional)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Main Image */}
                            <div className="relative group md:col-span-2">
                                <input
                                    type="file"
                                    className="hidden"
                                    id="drop-image-main"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'image')}
                                />
                                <label
                                    htmlFor="drop-image-main"
                                    className="flex flex-col items-center justify-center py-12 border-4 border-dashed border-gray-100 rounded-[2.5rem] cursor-pointer group-hover:border-[#10B981]/30 transition-all bg-gray-50/50 overflow-hidden relative"
                                >
                                    {previews.image ? (
                                        <div className="relative w-full h-full flex flex-col items-center p-4">
                                            <img src={previews.image.startsWith('http') ? previews.image : previews.image} alt="Lead Preview" className="max-h-64 object-contain rounded-[1.5rem] shadow-2xl" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="bg-white p-3 rounded-full text-[#10B981] shadow-lg"><Plus size={24} /></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-[#10B981] mb-2 group-hover:scale-110 transition-transform">
                                                <Plus size={24} />
                                            </div>
                                            <span className="text-sm font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors text-center">Lead Photo (Required)</span>
                                        </>
                                    )}
                                </label>
                            </div>

                            {/* Auxiliary Images */}
                            {[2, 3, 4, 5].map(num => {
                                const field = `image${num}`;
                                return (
                                    <div key={field} className="relative group">
                                        <input
                                            type="file"
                                            className="hidden"
                                            id={`drop-image-${num}`}
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, field)}
                                        />
                                        <label
                                            htmlFor={`drop-image-${num}`}
                                            className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-100 rounded-[1.5rem] cursor-pointer group-hover:border-[#10B981]/30 transition-all bg-white overflow-hidden relative"
                                        >
                                            {previews[field] ? (
                                                <div className="relative w-full h-full flex flex-col items-center px-4">
                                                    <img src={previews[field].startsWith('http') ? previews[field] : previews[field]} alt={`View ${num}`} className="max-h-32 object-contain rounded-xl shadow-lg" />
                                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Plus size={16} className="text-[#10B981]" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 mb-2 group-hover:scale-110 transition-transform">
                                                        <ImageIcon size={20} />
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Add Photo {num - 1}</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Drop Name</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Vintage Denim Jacket"
                            className="w-full bg-white border border-gray-100 rounded-xl py-4 px-4 focus:border-[#10B981] outline-none transition-all font-bold text-[#1F2937]"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Price (₦)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-300">₦</span>
                                <input
                                    required
                                    type="number"
                                    onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                    placeholder="0.00"
                                    className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-10 pr-4 focus:border-[#10B981] outline-none transition-all font-bold text-[#1F2937]"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Select Circle (Category)</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat.id })}
                                        className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border-2 ${formData.category === cat.id
                                            ? 'bg-[#10B981] text-white border-[#10B981] shadow-lg shadow-[#10B981]/20'
                                            : 'bg-white text-gray-400 border-gray-100 hover:border-[#10B981]/30 hover:text-[#10B981]'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Configuration */}
                <div className="card-clean space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Truck size={18} className="text-[#10B981]" />
                        <h3 className="text-lg font-bold">Delivery Terms</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                            onClick={() => {
                                setDeliveryMode('FREE');
                                setFormData({ ...formData, campus_delivery_fee: '0.00' });
                            }}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${deliveryMode === 'FREE' ? 'border-[#10B981] bg-[#10B981]/5' : 'border-gray-50 bg-gray-50'}`}
                        >
                            <div className="flex gap-4 items-center">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryMode === 'FREE' ? 'border-[#10B981] bg-[#10B981]' : 'border-gray-300'}`}>
                                    {deliveryMode === 'FREE' && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className="font-bold text-sm">Free Delivery</span>
                            </div>
                        </div>

                        <div
                            onClick={() => setDeliveryMode('PAID')}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${deliveryMode === 'PAID' ? 'border-[#10B981] bg-[#10B981]/5' : 'border-gray-50 bg-gray-50'}`}
                        >
                            <div className="flex gap-4 items-center">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryMode === 'PAID' ? 'border-[#10B981] bg-[#10B981]' : 'border-gray-300'}`}>
                                    {deliveryMode === 'PAID' && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className="font-bold text-sm">Paid Delivery</span>
                            </div>
                        </div>
                    </div>

                    {deliveryMode === 'PAID' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Hostel Delivery Fee (Your Campus) (₦)</label>
                                <input
                                    required={deliveryMode === 'PAID'}
                                    type="number"
                                    onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                    placeholder="Enter amount"
                                    className="w-full bg-white border border-gray-100 rounded-xl py-4 px-4 focus:border-[#10B981] outline-none transition-all font-bold text-[#1F2937]"
                                    value={formData.campus_delivery_fee}
                                    onChange={(e) => setFormData({ ...formData, campus_delivery_fee: e.target.value })}
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Fee for delivering to students in your school.</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2 pt-4 border-t border-gray-50">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Waybill Fee (Other Schools) (₦)</label>
                        <input
                            type="number"
                            onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                            placeholder="Optional - Leave empty if you don't ship externally"
                            className="w-full bg-white border border-gray-100 rounded-xl py-4 px-4 focus:border-[#10B981] outline-none transition-all font-bold text-[#1F2937]"
                            value={formData.waybill_delivery_fee}
                            onChange={(e) => setFormData({ ...formData, waybill_delivery_fee: e.target.value })}
                        />
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Fee for shipping to a different campus.</p>
                    </div>
                </div>

                {/* Description & Media */}
                <div className="card-clean space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Tag size={18} className="text-[#10B981]" />
                        <h3 className="text-lg font-bold">Presentation</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Description</label>
                        <textarea
                            required
                            rows="4"
                            placeholder="Tell the Tribe why they need this..."
                            className="w-full bg-white border border-gray-100 rounded-xl py-4 px-4 focus:border-[#10B981] outline-none transition-all font-bold resize-none text-[#1F2937]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black text-[#10B981] uppercase tracking-widest flex items-center gap-1">
                            <Zap size={12} fill="currentColor" /> Awoof Mode
                        </label>
                        <div
                            onClick={() => {
                                const newAwoof = !formData.is_awoof;
                                setFormData({
                                    ...formData,
                                    is_awoof: newAwoof,
                                    discount_percentage: newAwoof ? formData.discount_percentage : 0
                                });
                            }}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${formData.is_awoof ? 'border-[#10B981] bg-[#10B981]/5' : 'border-gray-50 bg-gray-50'}`}
                        >
                            <div className="flex gap-4 items-center">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.is_awoof ? 'border-[#10B981] bg-[#10B981]' : 'border-gray-300'}`}>
                                    {formData.is_awoof && <CheckCircle2 size={16} className="text-white" />}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Mark as AWOOF</p>
                                    <p className="text-xs text-gray-500 font-medium tracking-tight">Increases visibility. Best value guarantee!</p>
                                </div>
                            </div>
                        </div>

                        {formData.is_awoof && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Discount Percentage (%)</label>
                                    <input
                                        required={formData.is_awoof}
                                        type="number"
                                        onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                        min="1"
                                        max="100"
                                        placeholder="e.g. 10"
                                        className="w-full bg-white border border-gray-100 rounded-xl py-4 px-4 focus:border-[#10B981] outline-none transition-all font-bold text-[#1F2937]"
                                        value={formData.discount_percentage}
                                        onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Final Price Preview</p>
                                    <p className="text-xl font-black text-[#10B981]">
                                        ₦{parseFloat(formData.price || 0).toLocaleString()} - {formData.discount_percentage}% =
                                        <span className="ml-2 underline underline-offset-4 decoration-2">
                                            ₦{Math.max(0, parseFloat(formData.price || 0) * (1 - (parseFloat(formData.discount_percentage || 0) / 100))).toLocaleString()}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-3 shadow-lg shadow-[#10B981]/20 disabled:opacity-70 disabled:grayscale"
                >
                    {isSaving ? (
                        <>Launching... <Loader2 className="animate-spin" size={24} /></>
                    ) : (
                        <>{isEditMode ? 'Update Drop' : 'Launch Drop'} <ArrowRight size={24} /></>
                    )}
                </button>
            </form>
        </div>
    );
};

export default DropCreator;
