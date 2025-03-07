// src/components/hemisphereSelection/HemisphereSelection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HemisphereSelection.scss';

const HemisphereSelection: React.FC = () => {
    const navigate = useNavigate();

    const handleHemisphereSelect = (hemisphere: 'north' | 'south') => {
        navigate(`/map/${hemisphere}`);
    };

    return (
        <div className="hemisphere-selection">
            <div className="selection-divider"></div>

            <div
                className="hemisphere north"
                onClick={() => handleHemisphereSelect('north')}
            >
                <span className="hemisphere-label">North</span>
            </div>

            <div
                className="hemisphere south"
                onClick={() => handleHemisphereSelect('south')}
            >
                <span className="hemisphere-label">South</span>
            </div>
        </div>
    );
};

export default HemisphereSelection;
