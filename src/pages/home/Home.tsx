// Modified src/components/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import StarBackground from '../../three/starBackground/StarBackground';
import './Home.scss';

const Home: React.FC = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isEntering, setIsEntering] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Function to navigate to selection page
    const goToSelection = () => {
        // Animate to 100% progress
        const animateProgress = () => {
            setScrollProgress(prev => {
                const newProgress = prev + 0.05;
                if (newProgress >= 1) {
                    navigate('/select');
                    return 1;
                }
                requestAnimationFrame(animateProgress);
                return newProgress;
            });
        };

        animateProgress();
    };

    // Set up swipe handlers
    const swipeHandlers = useSwipeable({
        onSwipedUp: () => goToSelection(),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    useEffect(() => {
        // Check if we're coming from selection page
        const comingFromSelection = location.state && location.state.fromSelection;

        if (comingFromSelection) {
            // Set initial animation state
            setScrollProgress(1);
            setIsEntering(true);

            // Animate stars coming down
            const animateEntry = () => {
                setScrollProgress(prev => {
                    const newProgress = prev - 0.05;
                    if (newProgress <= 0) {
                        setIsEntering(false);
                        return 0;
                    }
                    requestAnimationFrame(animateEntry);
                    return newProgress;
                });
            };

            requestAnimationFrame(animateEntry);
        }

        // Function to handle scrolling
        const handleScroll = () => {
            if (isEntering) return; // Don't respond to scroll during entrance animation

            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const progress = Math.min(scrollPosition / windowHeight, 1);

            setScrollProgress(progress);

            if (progress >= 0.8) {
                navigate('/select');
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Enable scrolling
        if (!isEntering) {
            document.body.style.overflow = 'auto';
            document.body.style.height = '200vh';
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = '';
            document.body.style.height = '';
        };
    }, [navigate, location, isEntering]);

    return (
        <div className="home-page" {...swipeHandlers}>
            <StarBackground scrollProgress={scrollProgress} />
            <div
                className="home-content"
                style={{
                    opacity: isEntering
                        ? (1 - scrollProgress) * 2 // Fade in when coming from selection
                        : 1 - scrollProgress * 2   // Fade out when going to selection
                }}
            >
                <h1>Astronomical Map</h1>
                <p>Explore the stars and constellations of our universe</p>
                <div className="scroll-indicator">
                    <span>Scroll down or swipe up to explore</span>
                    <div className="arrow"></div>
                </div>
            </div>
        </div>
    );
};

export default Home;
