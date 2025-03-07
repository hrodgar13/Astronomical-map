import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import './StarBackground.scss';

// Props interface for AnimatedStars
interface AnimatedStarsProps {
    scrollProgress?: number;
}

// This component handles the animated stars
const AnimatedStars: React.FC<AnimatedStarsProps> = ({ scrollProgress = 0 }) => {
    const starsRef = useRef<THREE.Points>(null);

    useFrame(({ clock }) => {
        if (starsRef.current) {
            // Base rotation animation
            starsRef.current.rotation.y = clock.getElapsedTime() * 0.05;

            // If we're scrolling, change the rotation to make stars "fly up"
            if (scrollProgress > 0) {
                // Progressively rotate the stars to look like we're flying "up"
                starsRef.current.rotation.x = -scrollProgress * Math.PI * 0.5; // Rotate up to 90 degrees

                // Move stars a bit closer to create a "flying through" effect
                starsRef.current.position.z = scrollProgress * 10;
            } else {
                // Normal subtle animation when not scrolling
                starsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.025) * 0.1;
                starsRef.current.position.z = 0;
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
