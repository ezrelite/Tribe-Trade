import React from 'react';

const GlassCard = ({ children, className = "", onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`glass-card ${className}`}
        >
            {children}
        </div>
    );
};

export default GlassCard;
