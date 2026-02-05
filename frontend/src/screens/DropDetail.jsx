import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Share, Heart, Plus, Minus, ShoppingBag, Info, ChevronsRight, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mapTerm } from '../constants/dictionary';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import ErrorState from '../components/ErrorState';

const DropDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [drop, setDrop] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem('tribe_user') || '{}'));
    const [isLoading, setIsLoading] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isBouncing, setIsBouncing] = useState(false);
    const { cart } = useCart();

    const fetchDrop = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/store/marketplace/${id}/`);
            setDrop(response.data);
        } catch (error) {
            console.error('Failed to load this Drop', error);
            setError('This specific Drop could not be retrieved from the Tribe records.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDrop();
    }, [id]);

    const handlePurchase = () => {
        if (user.is_plug) {
            toast.error("Plugs cannot place orders.");
            return;
        }
        // Take user to checkout with ONLY this item
        navigate('/checkout', {
            state: {
                singleItem: {
                    ...drop,
                    quantity,
                    selectedSize
                }
            }
        });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: drop.name,
                text: drop.description,
                url: window.location.href,
            }).catch(() => toast.error('Sharing failed'));
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
            <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="p-10 max-w-2xl mx-auto min-h-[60vh] flex items-center">
            <ErrorState message={error} onRetry={fetchDrop} />
        </div>
    );

    if (!drop) return null;

    const allImages = [
        drop.image,
        drop.image2,
        drop.image3,
        drop.image4,
        drop.image5
    ].filter(img => img !== null && img !== undefined);

    const getImageUrl = (img) => {
        if (!img) return null;
        return img.startsWith('http') ? img : `${api.defaults.baseURL.replace('/api', '')}${img}`;
    };



    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Top Image Section */}
            <div className="relative w-full aspect-[4/5] bg-[#F7F7F7] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={activeImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        src={getImageUrl(allImages[activeImageIndex]) || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80"}
                        alt={drop.name}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Overlaid Black Circle Controls */}
                <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-30">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all"
                    >
                        <Share size={18} />
                    </button>
                </div>

                {/* Animated Top-Nav Cart Button */}
                <div className="absolute top-6 right-20 z-30">
                    <Link to="/cart">
                        <motion.button
                            animate={isBouncing ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="w-10 h-10 bg-[#10B981] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all relative overflow-hidden"
                        >
                            <ShoppingBag size={18} />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-[#10B981]">
                                    {cart.length}
                                </span>
                            )}
                        </motion.button>
                    </Link>
                </div>

                {/* Vertical Thumbnails on the Right */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
                    {allImages.slice(0, 4).map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveImageIndex(i)}
                            className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white/80 backdrop-blur-sm ${activeImageIndex === i ? 'border-black scale-105 shadow-lg' : 'border-transparent opacity-60'
                                }`}
                        >
                            <img src={getImageUrl(img)} alt={`Thumb ${i}`} className="w-full h-full object-cover rounded-lg" />
                        </button>
                    ))}
                </div>

                {/* Badges at Bottom of Image Area */}
                <div className="absolute bottom-6 left-6 flex gap-2 z-30">
                    <span className="bg-[#E58B68] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-tighter">New</span>
                    <span className="bg-[#98FF98] text-[#1F2937] text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-tighter">Discount 30%</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="px-6 py-8 space-y-8 max-w-2xl mx-auto">
                {/* Title and Heart */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-[#1F2937] uppercase tracking-tight leading-none">{drop.name}</h1>
                        <p className="text-sm font-bold text-gray-400 capitalize pt-1">{drop.store_name} • Premium Wear</p>
                    </div>
                    <button className="text-[#1F2937] hover:scale-110 active:scale-95 transition-all">
                        <Heart size={28} />
                    </button>
                </div>

                {/* Size Selection */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-black text-[#1F2937] uppercase tracking-wider">Select size</p>
                        <button className="text-xs font-bold text-gray-400 underline decoration-gray-300">Size Guide</button>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                        {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`h-14 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${selectedSize === size
                                    ? 'bg-black text-white shadow-xl scale-[1.02]'
                                    : 'bg-[#F9FAFB] text-[#1F2937] hover:bg-gray-100'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Description Section */}
                <div className="space-y-3">
                    <p className="text-sm font-black text-[#1F2937] uppercase tracking-wider">Description</p>
                    <p className="text-sm text-gray-500 font-bold leading-relaxed tracking-tight">
                        {drop.description || "No specific details provided for this drop, but it's guaranteed Tribe material."}
                    </p>
                </div>

                {/* Qty and Price Integrated Row */}
                <div className="pt-4 flex items-end justify-between border-t border-gray-50">
                    <div className="space-y-4">
                        <p className="text-xs font-black text-[#1F2937] uppercase tracking-widest opacity-40">Qty</p>
                        <div className="flex items-center bg-[#F3F4F6] rounded-2xl p-1 gap-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#1F2937] shadow-sm active:scale-90 transition-transform"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="text-sm font-black w-6 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#1F2937] shadow-sm active:scale-90 transition-transform"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="text-right space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">Total price</p>
                        <span className="text-sm text-gray-300 font-bold line-through block italic opacity-50">₦{(parseFloat(drop.price) * 1.4 * quantity).toLocaleString()}</span>
                        <span className="text-3xl font-black text-[#1F2937] tracking-tighter">₦{(parseFloat(drop.price) * quantity).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Sticky Dual Pill Footer (Image 3 Style) */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-2xl z-50 border-t border-gray-50">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <button
                        onClick={handlePurchase}
                        className="flex-1 bg-[#10B981] text-white font-black py-4.5 rounded-full shadow-xl shadow-[#10B981]/20 hover:bg-[#0da070] transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-[0.98] h-14"
                    >
                        Checkout Now
                        <ChevronsRight size={18} />
                    </button>
                    <button
                        onClick={() => {
                            addToCart({ ...drop, quantity, selectedSize });
                            setIsBouncing(true);
                            setTimeout(() => setIsBouncing(false), 500);
                        }}
                        className="flex-1 bg-white border-2 border-[#1F2937] text-[#1F2937] font-black py-4.5 rounded-full hover:bg-gray-50 transition-all text-xs uppercase tracking-[0.1em] flex items-center justify-center gap-2 active:scale-[0.98] h-14"
                    >
                        Add to Cart
                        <div className="w-6 h-6 rounded-full bg-[#1F2937] flex items-center justify-center text-white">
                            <ShoppingCart size={12} />
                        </div>
                    </button>
                </div>
            </div>
        </div >
    );
};

export default DropDetail;
