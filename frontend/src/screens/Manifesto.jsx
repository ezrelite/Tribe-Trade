import React, { useState } from 'react';
import {
    Book,
    ShieldCheck,
    Zap,
    Heart,
    ChevronLeft,
    Search,
    ChevronDown,
    MapPin,
    DollarSign,
    Users,
    MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mapTerm } from '../constants/dictionary';

const Manifesto = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Safety');

    const faq = [
        {
            category: 'Safety',
            icon: ShieldCheck,
            questions: [
                { q: "How does the TribeGuard work?", a: "Every payment is held in our secure escrow. The Plug only receives the funds once you confirm you've received your item. This ensures zero-risk campus trading." },
                { q: "Where is the safest place to meet?", a: "We recommend well-lit, populated areas like the Student Union Building (SUB), Faculty entrances, or departmental common areas." },
                { q: "What if I get scammed?", a: "The Tribe doesn't let that happen. If there's an issue, hit the 'Dispute' button immediately. Funds will be frozen until the Council reviews the evidence." }
            ]
        },
        {
            category: 'Hustling',
            icon: DollarSign,
            questions: [
                { q: "How do I become a verified Plug?", a: "Fill out the merchant application in your profile. You'll need a valid student ID and a clean trade history." },
                { q: "What is Awoof Mode?", a: "Awoof mode is a visibility booster. By offering essential items at a great value, your drops appear at the top of the Marketplace and in notifications." },
                { q: "When do I get paid?", a: "As soon as the Citizen confirms receipt, funds move to your wallet. You can cash out to any Nigerian bank within 24 hours." }
            ]
        },
        {
            category: 'Community',
            icon: Users,
            questions: [
                { q: "What is my Rep score?", a: "Rep (Reputation) is calculated based on successful trades, timely responses, and community feedback. A high Rep unlock lower commissions." },
                { q: "Can I sell outside my campus?", a: "Not yet! We prioritize hyper-local, in-person trades to maintain the highest security and zero shipping fees." }
            ]
        }
    ];

    const filteredFaq = faq.filter(cat =>
        cat.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.questions.some(q => q.q.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto pb-32">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-[#1F2937] font-bold mb-8 transition-colors"
            >
                <ChevronLeft size={20} /> Back
            </button>

            <div className="text-center mb-16 space-y-4">
                <div className="w-20 h-20 bg-[#10B981]/10 text-[#10B981] rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 transform hover:rotate-12 transition-transform">
                    <Book size={40} />
                </div>
                <h1 className="text-5xl font-black text-[#1F2937] tracking-tighter">The Tribe Manifesto</h1>
                <p className="text-gray-500 font-bold max-w-lg mx-auto leading-relaxed">Everything you need to know about the most secure campus marketplace on the continent.</p>
            </div>

            <div className="relative mb-12">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                <input
                    type="text"
                    placeholder="Search the Manifesto..."
                    className="w-full bg-white border border-gray-100 rounded-3xl py-6 pl-16 pr-6 outline-none shadow-xl shadow-gray-100/50 focus:border-[#10B981] transition-all font-bold text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Category Pills */}
            <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar pb-4 px-1">
                {faq.map(cat => (
                    <button
                        key={cat.category}
                        onClick={() => setActiveCategory(cat.category)}
                        className={`flex items-center gap-2 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 ${activeCategory === cat.category ? 'bg-[#1F2937] text-white shadow-xl' : 'bg-white text-gray-400 border border-gray-100'}`}
                    >
                        <cat.icon size={16} />
                        {cat.category}
                    </button>
                ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-6">
                {faq.find(c => c.category === activeCategory)?.questions.map((q, i) => (
                    <div key={i} className="card-clean animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h3 className="text-lg font-bold text-[#1F2937] mb-4 flex items-start gap-3">
                            <span className="text-[#10B981] font-black italic">Q:</span>
                            {q.q}
                        </h3>
                        <p className="text-gray-500 font-medium leading-relaxed bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
                            {q.a}
                        </p>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-20 p-10 bg-[#10B981] rounded-[3rem] text-white flex flex-col items-center text-center gap-6 shadow-2xl shadow-[#10B981]/20">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <MessageCircle size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-black mb-2">Still confused?</h2>
                    <p className="font-bold opacity-80 max-w-sm">The Tribe Council is always online. Contact us directly for any support.</p>
                </div>
                <button
                    onClick={() => navigate('/chat')}
                    className="bg-white text-[#10B981] font-black px-10 py-4 rounded-2xl hover:scale-105 transition-all flex items-center gap-2"
                >
                    Contact Council <Zap size={20} fill="currentColor" />
                </button>
            </div>
        </div>
    );
};

export default Manifesto;
