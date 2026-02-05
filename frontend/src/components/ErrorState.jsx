import React from 'react';
import { AlertCircle, RefreshCw, ShieldAlert, Zap, SearchX, Lock } from 'lucide-react';

const ErrorState = ({ message, onRetry, errorCode }) => {
    // Map status codes to user-friendly content
    const errorMap = {
        404: {
            title: "Drop Not Found",
            desc: "This page or item seems to have vanished from the Tribe.",
            icon: SearchX,
            color: "text-orange-500",
            bg: "bg-orange-50"
        },
        401: {
            title: "Access Denied",
            desc: "You need to be logged in to view this HQ sector.",
            icon: Lock,
            color: "text-red-500",
            bg: "bg-red-50"
        },
        403: {
            title: "Access Restricted",
            desc: "The Tribe Council hasn't granted you clearance for this action.",
            icon: ShieldAlert,
            color: "text-red-500",
            bg: "bg-red-50"
        },
        500: {
            title: "Council Error",
            desc: "The Tribe servers are experiencing a heavy load. Stand by.",
            icon: Zap,
            color: "text-purple-500",
            bg: "bg-purple-50"
        },
        'default': {
            title: "Connection Error",
            desc: "We're having trouble reaching the Tribe network right now.",
            icon: AlertCircle,
            color: "text-gray-400",
            bg: "bg-gray-50"
        }
    };

    const config = errorMap[errorCode] || errorMap['default'];
    const Icon = config.icon;

    return (
        <div className="flex flex-col items-center justify-center py-16 px-8 card-clean bg-white shadow-xl shadow-gray-200/50 border-none animate-in fade-in zoom-in-95 duration-500">
            <div className={`w-20 h-20 ${config.bg} ${config.color} rounded-[2rem] flex items-center justify-center mb-8 transform hover:rotate-12 transition-transform`}>
                <Icon size={40} />
            </div>

            <h3 className="text-2xl font-black text-[#1F2937] mb-3 text-center">{config.title}</h3>
            <p className="text-gray-500 font-bold text-center max-w-sm mb-10 leading-relaxed">
                {message || config.desc}
            </p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center gap-3 px-10 py-4 bg-[#10B981] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 shadow-lg shadow-[#10B981]/20 transition-all group"
                >
                    <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorState;
