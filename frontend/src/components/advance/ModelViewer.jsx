import { Canvas } from "@react-three/fiber";
import { useGLTF, PresentationControls, OrbitControls, ContactShadows } from "@react-three/drei";
import Magnet from "./Magnet"
import { useState, useEffect } from "react";

// Mobile detection utility
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
};

function Model({ url, scale, position }) {
    const gltf = useGLTF(url);
    return (
        <primitive object={gltf.scene} scale={scale} position={position} />
    );
}

export default function ModelViewer({ url, width, height, modelXOffset, modelYOffset }) {
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            const mobile = isMobile();
            setIsMobileDevice(mobile);
            // Delay rendering on mobile to improve initial load
            if (mobile) {
                setTimeout(() => setShouldRender(true), 1000);
            } else {
                setShouldRender(true);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Don't render on mobile if not needed
    if (isMobileDevice && !shouldRender) {
        return (
            <div 
                style={{
                    width: "100%",
                    height: "20vh",
                    background: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <div style={{ color: "#666", fontSize: "14px" }}>Loading 3D Model...</div>
            </div>
        );
    }

    // Adjust camera position to fit the model nicely
    const cameraPosition = isMobileDevice ? [0, 0.1, 3] : [0, 0.1, 2.2];

    return (
        <Magnet padding={100} disabled={isMobileDevice} magnetStrength={10} wrapperClassName="w-full h-full relative">

        <Canvas
            dpr={isMobileDevice ? [1, 1] : [1, 2]}
            shadows={!isMobileDevice}
            camera={{ fov: isMobileDevice ? 25 : 30, position: cameraPosition }}
            style={{
              width: "100%",
                height: "20vh",
                margin: "0 auto",
              display: "block",
              background: "transparent",
              cursor: isMobileDevice ? "default" : "grab",
            }}
        >
            <ambientLight intensity={0.7} />
            <directionalLight
                position={[5, 10, 7.5]}
                intensity={1.2}
                castShadow={!isMobileDevice}
                shadow-mapSize-width={isMobileDevice ? 512 : 2048}
                shadow-mapSize-height={isMobileDevice ? 512 : 2048}
            />
            <spotLight
                position={[0, 5, 5]}
                angle={0.3}
                penumbra={1}
                intensity={1.5}
                castShadow={!isMobileDevice}
            />
            <PresentationControls
                speed={isMobileDevice ? 0.8 : 1.5}
                global
                zoom={0.9}
                polar={[-0.4, Math.PI / 2.2]}
                azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}
                enabled={!isMobileDevice}
            >
                <Model
                    url={url}
                    scale={isMobileDevice ? 0.2 : 0.3}
                    position={[modelXOffset || 0, modelYOffset || 0, 0]}
                />
            </PresentationControls>
            {!isMobileDevice && (
                <ContactShadows
                    position={[0, -0.8, 0]}
                    opacity={0.35}
                    scale={10}
                    blur={2.5}
                    far={1.2}
                />
            )}
        </Canvas>
        </Magnet> 
    );
}