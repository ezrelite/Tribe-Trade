import React from 'react';
import { motion } from 'framer-motion';

const TribeLoader = ({ size = 40, color = "#10B981" }) => {
    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <motion.div
                className="absolute inset-0 rounded-xl border-t-2 border-r-2"
                style={{ borderColor: color }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="w-1/2 h-1/2 bg-[#10B981] rounded-lg shadow-lg shadow-[#10B981]/30"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
};

export default TribeLoader;
