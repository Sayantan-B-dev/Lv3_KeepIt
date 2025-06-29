import { Canvas } from "@react-three/fiber";
import { useGLTF, PresentationControls, OrbitControls, ContactShadows } from "@react-three/drei";
import Magnet from "./Magnet"

function Model({ url, scale, position }) {
    const gltf = useGLTF(url);
    return (
        <primitive object={gltf.scene} scale={scale} position={position} />
    );
}

export default function ModelViewer({ url, width, height, modelXOffset, modelYOffset }) {


    // Adjust camera position to fit the model nicely
    const cameraPosition = [0, 0.1, 2.2];

    return (
        <Magnet padding={100} disabled={false} magnetStrength={10} wrapperClassName="w-full h-full relative">

        <Canvas
            dpr={[1, 2]}
            shadows
            camera={{ fov: 30, position: cameraPosition }}
            style={{
              width: "100%",
                height: "20vh",
                margin: "0 auto",
              display: "block",
              background: "transparent",
              cursor: "grab",
            }}
        >
            <ambientLight intensity={0.7} />
            <directionalLight
                position={[5, 10, 7.5]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <spotLight
                position={[0, 5, 5]}
                angle={0.3}
                penumbra={1}
                intensity={1.5}
                castShadow
            />
            <PresentationControls
                speed={1.5}
                global
                zoom={0.9}
                polar={[-0.4, Math.PI / 2.2]}
                azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}
            >
                <Model
                    url={url}
                    scale={0.3}
                    position={[modelXOffset || 0, modelYOffset || 0, 0]}
                />
            </PresentationControls>
            <ContactShadows
                position={[0, -0.8, 0]}
                opacity={0.35}
                scale={10}
                blur={2.5}
                far={1.2}
            />
        </Canvas>
        </Magnet> 
    );
}