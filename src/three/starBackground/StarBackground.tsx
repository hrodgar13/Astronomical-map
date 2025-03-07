import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import './StarBackground.scss';

interface AnimatedStarsProps {
    scrollProgress?: number;
}

const AnimatedStars: React.FC<AnimatedStarsProps> = ({ scrollProgress = 0 }) => {
    const starsRef = useRef<THREE.Points>(null);

    useFrame(({ clock }) => {
        if (starsRef.current) {
            // Base rotation animation
            starsRef.current.rotation.y = clock.getElapsedTime() * 0.05;

            // When scrolling down, stars appear to move upward
            if (scrollProgress > 0) {
                // Make stars progressively move up with scroll
                starsRef.current.rotation.x = -scrollProgress * Math.PI * 0.5;

                // Keep position of stars fixed, don't move them closer
                // This ensures they remain visible at the top
            } else {
                // Normal subtle animation when not scrolling
                starsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.025) * 0.1;
            }
        }
    });

    return (
        <Stars
            ref={starsRef}
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
        />
    );
};

// Props interface for StarBackground
interface StarBackgroundProps {
    scrollProgress?: number;
}

const StarBackground: React.FC<StarBackgroundProps> = ({ scrollProgress = 0 }) => {
    return (
        <div className="star-background">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ambientLight intensity={0.1} />
                <AnimatedStars scrollProgress={scrollProgress} />
            </Canvas>
        </div>
    );
};

export default StarBackground;
