import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    Upload,
    CheckCircle2,
    ChevronLeft,
    Loader2,
    Info,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import TribeLoader from '../components/TribeLoader';

const Verify = () => {
    const navigate = useNavigate();
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        matric_no: '',
        id_card: null
    });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const checkStatus = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/users/verifications/');
                const pending = response.data.find(req => req.status === 'PENDING');
                if (pending) {
                    setStep(3); // Pending screen
                }
            } catch (error) {
                console.error("Failed to check verification status:", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkStatus();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, id_card: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Pack data into FormData for file upload
            const data = new FormData();
            data.append('matric_no', formData.matric_no);
            if (formData.id_card) {
                data.append('id_card', formData.id_card);
            }

            await api.post('/users/verifications/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Verification Broadcasted! The Council will review your ID.");
            setStep(3); // Success step
        } catch (error) {
            console.error(error);
            setHasError(true);
            setTimeout(() => setHasError(false), 500);
            toast.error(error.response?.data?.detail || "Broadcast failed. Check your data.");
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 3) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="card-clean max-w-md w-full text-center py-16">
                    <div className="w-20 h-20 bg-[#10B981]/10 text-[#10B981] rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <ShieldCheck size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-[#1F2937] mb-4 tracking-tighter">Status: Pending</h2>
                    <p className="text-gray-500 font-bold mb-10 leading-relaxed">
                        The Tribe Council is verifying your student credentials. You'll unlock Hustle HQ as soon as you're cleared.
                    </p>
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="btn-primary w-full"
                    >
                        Return to Marketplace
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-3xl mx-auto pb-32">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-[#1F2937] font-bold mb-8 transition-colors"
            >
                <ChevronLeft size={20} /> Back
            </button>

            <div className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-black text-[#1F2937] tracking-tighter">Upgrade to Plug</h1>
                    <p className="text-gray-500 font-bold">Unlock your campus commerce potential.</p>
                </div>
                <div className="w-14 h-14 bg-[#10B981]/10 text-[#10B981] rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={32} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="card-clean space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Matriculation Number</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. 190805001"
                                    className={`w-full bg-white border border-gray-100 rounded-xl py-4 px-4 focus:border-[#10B981] outline-none transition-all font-bold text-[#1F2937] ${hasError && !formData.matric_no ? 'animate-shake border-red-500' : ''}`}
                                    value={formData.matric_no}
                                    onChange={(e) => setFormData({ ...formData, matric_no: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Student ID Upload</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="id-upload"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="id-upload"
                                        className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-100 rounded-2xl cursor-pointer group-hover:border-[#10B981]/30 transition-all bg-gray-50/50 overflow-hidden"
                                    >
                                        {preview ? (
                                            <div className="relative w-full h-full flex flex-col items-center">
                                                <img src={preview} alt="ID Preview" className="max-h-48 object-contain rounded-lg shadow-md" />
                                                <span className="mt-3 font-bold text-xs text-[#10B981]">Click to change ID</span>
                                            </div>
                                        ) : formData.id_card ? (
                                            <div className="flex flex-col items-center gap-2 text-[#10B981]">
                                                <CheckCircle2 size={32} />
                                                <span className="font-bold text-sm">File Selected</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="text-gray-300 mb-2 group-hover:text-[#10B981] transition-colors" size={32} />
                                                <span className="text-sm font-bold text-gray-400 group-hover:text-gray-500 transition-colors">Click to upload ID Card image</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={isLoading || !formData.id_card || !formData.matric_no}
                            className="w-full btn-primary py-5 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>Broadcasting credentials... <TribeLoader size={24} color="#fff" /></>
                            ) : (
                                <>Submit for Verification <ArrowRight size={24} /></>
                            )}
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="card-clean bg-[#1F2937] text-white border-none">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Info size={16} className="text-[#10B981]" /> Why verify?
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-xs font-medium opacity-80 leading-relaxed">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1 shrink-0"></div>
                                Unlock the Hustle HQ commerce dashboard.
                            </li>
                            <li className="flex gap-3 text-xs font-medium opacity-80 leading-relaxed">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1 shrink-0"></div>
                                Start creating your own Drops and earning.
                            </li>
                            <li className="flex gap-3 text-xs font-medium opacity-80 leading-relaxed">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1 shrink-0"></div>
                                Get the GreenCheck mark on your store.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verify;
