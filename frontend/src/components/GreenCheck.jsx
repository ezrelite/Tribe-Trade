import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { mapTerm } from '../constants/dictionary';

const GreenCheck = ({ size = 20, className = "" }) => {
    return (
        <div className={`flex items-center gap-1 text-accent ${className}`} title={mapTerm('VERIFIED_BADGE')}>
            <CheckCircle2 size={size} className="green-check-glow" />
        </div>
    );
};

export default GreenCheck;
