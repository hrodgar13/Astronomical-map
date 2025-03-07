// src/components/hemisphereSelection/HemisphereSelection.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import './HemisphereSelection.scss';

const HemisphereSelection: React.FC = () => {
    const navigate = useNavigate();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);

    const handleHemisphereSelect = (hemisphere: 'north' | 'south') => {
        navigate(`/map/${hemisphere}`);
    };

    const goBackToHome = () => {
        if (isTransitioning) return; // Prevent multiple transitions

        setIsTransitioning(true);

        // Animate transition effect
        setTimeout(() => {
            navigate('/home', { state: { fromSelection: true } });
        }, 800);
    };

    // Configure swipe detection
    const swipeHandlers = useSwipeable({
        onSwipedUp: goBackToHome,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    useEffect(() => {
        // Track scroll position
        const handleScroll = (e: WheelEvent) => {
            // Detect scroll direction (negative deltaY means scrolling up)
            if (e.deltaY < 0) {
                // Increment our upward scroll tracking
                setScrollPosition(prev => {
                    const newPosition = prev + Math.abs(e.deltaY);

                    // If scrolled up enough, go back to home
                    if (newPosition > 300 && !isTransitioning) {
                        goBackToHome();
                    }

                    return newPosition;
                });
            } else {
                // Reset scroll position when scrolling down
                setScrollPosition(0);
            }
        };

        // Set up scroll listener
        window.addEventListener('wheel', handleScroll);

        // Clean up
        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, [navigate, isTransitioning]);

    return (
        <div
            className={`hemisphere-selection ${isTransitioning ? 'transitioning-up' : ''}`}
            {...swipeHandlers}
        >
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

            <div className="scroll-hint">
                <span>Scroll up to return</span>
                <div className="arrow-up"></div>
            </div>
        </div>
    );
};

export default HemisphereSelection;
