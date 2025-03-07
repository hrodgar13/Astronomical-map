// src/components/AstronomicalMap.tsx
import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import StarBackground from '../../three/StarBackground/StarBackground';
import './AstronomicalMap.scss';

type AppState = 'home' | 'selection' | 'map';

const AstronomicalMap: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('home');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [selectedHemisphere, setSelectedHemisphere] = useState<'north' | 'south' | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Handle scrolling to update progress
    useEffect(() => {
        if (isTransitioning) return;

        const handleScroll = () => {
            if (appState === 'home') {
                // Forward transition (home to selection)
                const scrollPosition = window.scrollY;
                const windowHeight = window.innerHeight;
                const progress = Math.min(scrollPosition / windowHeight, 1);

                setScrollProgress(progress);

                // Transition to selection when scrolled enough
                if (progress >= 0.8 && !isTransitioning) {
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setAppState('selection');
                        setIsTransitioning(false);
                    }, 500);
                }
            } else if (appState === 'selection') {
                // Check if scrolling up from selection
                if (window.scrollY <= 0 && !isTransitioning) {
                    // Implement logic for scrolling up to go back to home
                    const handleUpScroll = (e: WheelEvent) => {
                        if (e.deltaY < 0) { // Scrolling up
                            window.removeEventListener('wheel', handleUpScroll);

                            setIsTransitioning(true);

                            // Animate progress back down
                            const animateBack = () => {
                                setScrollProgress(prev => {
                                    const newProgress = prev - 0.05;
                                    if (newProgress <= 0) {
                                        setAppState('home');
                                        setIsTransitioning(false);
                                        return 0;
                                    }
                                    requestAnimationFrame(animateBack);
                                    return newProgress;
                                });
                            };

                            animateBack();
                        }
                    };

                    window.addEventListener('wheel', handleUpScroll);
                    return () => window.removeEventListener('wheel', handleUpScroll);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Enable scrolling for home screen
        if (appState === 'home') {
            document.body.style.overflow = 'auto';
            document.body.style.height = '200vh';
        } else {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [appState, isTransitioning]);

    // Handle swipe gestures
    const swipeHandlers = useSwipeable({
        onSwipedUp: () => {
            if (appState === 'home' && !isTransitioning) {
                // Swipe up to go to selection
                setIsTransitioning(true);

                const animateForward = () => {
                    setScrollProgress(prev => {
                        const newProgress = prev + 0.05;
                        if (newProgress >= 1) {
                            setAppState('selection');
                            setIsTransitioning(false);
                            return 1;
                        }
                        requestAnimationFrame(animateForward);
                        return newProgress;
                    });
                };

                animateForward();
            }
        },
        onSwipedDown: () => {
            if (appState === 'selection' && !isTransitioning) {
                // Swipe down to go back to home
                setIsTransitioning(true);

                const animateBack = () => {
                    setScrollProgress(prev => {
                        const newProgress = prev - 0.05;
                        if (newProgress <= 0) {
                            setAppState('home');
                            setIsTransitioning(false);
                            return 0;
                        }
                        requestAnimationFrame(animateBack);
                        return newProgress;
                    });
                };

                animateBack();
            }
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    // Handle hemisphere selection
    const selectHemisphere = (hemisphere: 'north' | 'south') => {
        setSelectedHemisphere(hemisphere);
        // Further implementation for map view goes here
    };

    return (
        <div className="astronomical-map" {...swipeHandlers}>
            {/* Star background remains as a constant element */}
            <StarBackground scrollProgress={scrollProgress} />

            {/* Home page content */}
            <div
                className={`home-content ${appState !== 'home' ? 'hidden' : ''}`}
                style={{ opacity: 1 - scrollProgress * 2 }}
            >
                <h1>Astronomical Map</h1>
                <p>Explore the stars and constellations of our universe</p>
                <div className="scroll-indicator">
                    <span>Scroll down or swipe up to explore</span>
                    <div className="arrow"></div>
                </div>
            </div>

            {/* Hemisphere selection interface */}
            <div
                className={`hemisphere-selection ${appState === 'selection' ? 'visible' : ''}`}
                style={{
                    transform: `translateY(${(1 - scrollProgress) * 100}%)`,
                    opacity: scrollProgress
                }}
            >
                <div className="selection-divider"></div>

                <div
                    className="hemisphere north"
                    onClick={() => selectHemisphere('north')}
                >
                    <span className="hemisphere-label">North</span>
                </div>

                <div
                    className="hemisphere south"
                    onClick={() => selectHemisphere('south')}
                >
                    <span className="hemisphere-label">South</span>
                </div>

                <div className="scroll-hint">
                    <span>Scroll up to return</span>
                    <div className="arrow-up"></div>
                </div>
            </div>
        </div>
    );
};

export default AstronomicalMap;
