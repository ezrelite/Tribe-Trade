import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    Send,
    MoreVertical,
    Phone,
    Video,
    Info,
    ChevronLeft,
    Image as ImageIcon,
    Smile,
    CheckCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [user] = useState(JSON.parse(localStorage.getItem('tribe_user') || '{}'));

    // Mock Threads
    const [threads] = useState([
        { id: 1, name: 'Tade the Plug', avatar: 'T', status: 'online', active: true, lastMsg: 'I have the hoodies in stock now.' },
        { id: 2, name: 'Ibrahim (Buyer)', avatar: 'I', status: 'offline', active: false, lastMsg: 'When can we meet at SUB?' },
        { id: 3, name: 'Council Support', avatar: 'C', status: 'online', active: false, lastMsg: 'Your dispute has been reviewed.' }
    ]);

    const [activeThread, setActiveThread] = useState(threads[0]);
    const [input, setInput] = useState('');

    // Load messages from LocalStorage or use defaults
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem(`tribe_chat_${activeThread.id}`);
        return saved ? JSON.parse(saved) : [
            { id: 1, text: "Yo! You still have those vintage hoodies?", sender: 'me', time: '10:30 AM' },
            { id: 2, text: "Yes o! I just got 5 in stock this morning.", sender: 'them', time: '10:32 AM' },
            { id: 3, text: "I have the hoodies in stock now.", sender: 'them', time: '10:33 AM' }
        ];
    });

    useEffect(() => {
        localStorage.setItem(`tribe_chat_${activeThread.id}`, JSON.stringify(messages));
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, activeThread.id]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMsg = {
            id: Date.now(),
            text: input,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMsg]);
        setInput('');

        // Simulate a reply after 2 seconds
        setTimeout(() => {
            const reply = {
                id: Date.now() + 1,
                text: "Got it! Let me know when you're ready to pick up.",
                sender: 'them',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    return (
        <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-40px)] flex bg-white md:m-5 rounded-none sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
            {/* Sidebar Threads */}
            <div className={`${activeThread ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-gray-50`}>
                <div className="p-4 sm:p-6 border-b border-gray-50">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] mb-4 sm:mb-6">Tribe Talk</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find a contact..."
                            className="w-full bg-gray-50 border border-transparent rounded-xl py-2.5 pl-10 pr-4 focus:bg-white focus:border-[#10B981]/20 outline-none transition-all font-bold text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {threads.map(t => (
                        <div
                            key={t.id}
                            onClick={() => setActiveThread(t)}
                            className={`p-4 flex items-center gap-4 cursor-pointer transition-all border-l-4 ${activeThread?.id === t.id ? 'bg-[#10B981]/5 border-[#10B981]' : 'border-transparent hover:bg-gray-50'}`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-[#1F2937]">
                                    {t.avatar}
                                </div>
                                {t.status === 'online' && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] border-2 border-white rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-sm truncate">{t.name}</h4>
                                    <span className="text-[10px] text-gray-400 font-bold">10:33 AM</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate font-medium">{t.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`${!activeThread ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-gray-50/30`}>
                {activeThread ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white p-4 md:px-8 md:py-6 border-b border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setActiveThread(null)} className="md:hidden text-gray-400">
                                    <ChevronLeft size={24} />
                                </button>
                                <div className="w-12 h-12 bg-[#10B981] rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-[#10B981]/20">
                                    {activeThread.avatar}
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1F2937] text-sm sm:text-base leading-none mb-1">{activeThread.name}</h3>
                                    <p className="text-[10px] sm:text-xs text-[#10B981] font-black uppercase tracking-widest flex items-center gap-1">
                                        {activeThread.status}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-4 text-gray-400">
                                <button className="p-2 hover:bg-gray-50 rounded-xl transition-all hidden sm:block"><Phone size={20} /></button>
                                <button className="p-2 hover:bg-gray-50 rounded-xl transition-all hidden sm:block"><Video size={20} /></button>
                                <button className="p-2 hover:bg-gray-50 rounded-xl transition-all"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar"
                        >
                            <div className="flex justify-center mb-8">
                                <span className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 shadow-sm">
                                    Today
                                </span>
                            </div>

                            {messages.map(m => (
                                <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] md:max-w-[60%] p-3 sm:p-4 rounded-2xl shadow-sm relative group ${m.sender === 'me'
                                        ? 'bg-[#10B981] text-white rounded-tr-none'
                                        : 'bg-white text-[#1F2937] rounded-tl-none border border-gray-50'
                                        }`}>
                                        <p className="font-medium text-sm sm:text-base leading-relaxed">{m.text}</p>
                                        <div className={`flex items-center gap-1 mt-1.5 sm:mt-2 text-[10px] font-bold ${m.sender === 'me' ? 'text-white/70' : 'text-gray-400'}`}>
                                            {m.time}
                                            {m.sender === 'me' && <CheckCheck size={12} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-50">
                            <div className="flex items-center gap-4 bg-gray-50 border border-transparent focus-within:border-[#10B981]/20 focus-within:bg-white rounded-2xl px-4 py-2 transition-all">
                                <button type="button" className="text-gray-400 hover:text-[#10B981] transition-colors">
                                    <ImageIcon size={20} />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Typed a message for the Tribe..."
                                    className="flex-1 bg-transparent py-3 outline-none font-bold text-sm"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button type="button" className="text-gray-400 hover:text-[#10B981] transition-colors hidden md:block">
                                    <Smile size={20} />
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#10B981] text-white p-3 rounded-xl shadow-lg shadow-[#10B981]/20 hover:scale-110 active:scale-95 transition-all"
                                >
                                    <Send size={18} fill="white" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-3xl flex items-center justify-center mb-6">
                            <Info size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-[#1F2937] mb-2">Private Secure Channels</h3>
                        <p className="text-gray-400 font-bold max-w-xs">Select a contact from the Tribe to start a secure conversation.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
