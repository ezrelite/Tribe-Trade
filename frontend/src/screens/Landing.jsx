import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Store, Zap } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { mapTerm } from '../constants/dictionary';

const Landing = ({ setUserRole }) => {
    const navigate = useNavigate();

    const selectRole = (role) => {
        setUserRole(role);
        if (role === 'CITIZEN') {
            navigate('/marketplace');
        } else {
            navigate('/hustle-hq');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-vibrant-gradient relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-plug/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-citizen/20 blur-[120px] rounded-full"></div>

            <div className="text-center mb-8 sm:mb-12 z-10 transition-all duration-700">
                <h1
                    className="font-bold tracking-tight mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3"
                    style={{ fontSize: 'clamp(2rem, 8vw, 4.5rem)' }}
                >
                    Tribe <span className="text-accent">Trade</span>
                    <Zap
                        className="text-accent fill-accent"
                        style={{ width: 'clamp(24px, 5vw, 40px)', height: 'clamp(24px, 5vw, 40px)' }}
                    />
                </h1>
                <p
                    className="text-white/60 font-medium"
                    style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)' }}
                >
                    Hyper-Local University Marketplace
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 w-full max-w-4xl z-10">
                <GlassCard
                    onClick={() => selectRole('CITIZEN')}
                    className="group cursor-pointer hover:bg-white/10 flex flex-col items-center text-center"
                    style={{ padding: 'clamp(1.5rem, 4vw, 3rem)' }}
                >
                    <div
                        className="bg-citizen/20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-citizen/30 group-hover:scale-110 transition-transform"
                        style={{ width: 'clamp(60px, 10vw, 80px)', height: 'clamp(60px, 10vw, 80px)' }}
                    >
                        <Users className="text-citizen" style={{ width: 'clamp(28px, 5vw, 40px)', height: 'clamp(28px, 5vw, 40px)' }} />
                    </div>
                    <h2
                        className="font-bold mb-3 sm:mb-4"
                        style={{ fontSize: 'clamp(1.25rem, 4vw, 1.875rem)' }}
                    >
                        {mapTerm('CITIZEN')}
                    </h2>
                    <p className="text-white/50" style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}>
                        Discover the hottest Drops on your campus.
                    </p>
                </GlassCard>

                <GlassCard
                    onClick={() => selectRole('PLUG')}
                    className="group cursor-pointer hover:bg-white/10 flex flex-col items-center text-center"
                    style={{ padding: 'clamp(1.5rem, 4vw, 3rem)' }}
                >
                    <div
                        className="bg-plug/20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-plug/30 group-hover:scale-110 transition-transform"
                        style={{ width: 'clamp(60px, 10vw, 80px)', height: 'clamp(60px, 10vw, 80px)' }}
                    >
                        <Store className="text-plug" style={{ width: 'clamp(28px, 5vw, 40px)', height: 'clamp(28px, 5vw, 40px)' }} />
                    </div>
                    <h2
                        className="font-bold mb-3 sm:mb-4"
                        style={{ fontSize: 'clamp(1.25rem, 4vw, 1.875rem)' }}
                    >
                        {mapTerm('PLUG')}
                    </h2>
                    <p className="text-white/50" style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}>
                        Manage your store and grow your reputation.
                    </p>
                </GlassCard>
            </div>

            <div
                className="mt-8 sm:mt-12 text-white/30 flex items-center gap-2"
                style={{ fontSize: 'clamp(0.625rem, 1.5vw, 0.875rem)' }}
            >
                Powered by <span className="text-white/50 font-bold uppercase tracking-widest">{mapTerm('ESCROW')}</span>
            </div>
        </div>
    );
};

export default Landing;
