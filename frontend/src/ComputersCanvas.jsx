import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import CanvasLoader from "./Loader.jsx";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./motorbike/scene.gltf"); // your model path

  return (
    <>
      <hemisphereLight intensity={0.3} groundColor="#444444" />
      <spotLight
        position={[-20, 50, 15]}
        angle={0.15}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-mapSize={2048}
      />
      <pointLight intensity={1.2} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 1 : 1.3}  
        position={isMobile ? [0, -2, -1.5] : [0, -3, -1]}  
        rotation={[-0.01, -0.2, -0.1]}
      />
    </>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  const handleChange = () => {
    navigate("/peter");
  };

  return (
    <div
      style={{
        width: "100%",
        height: isMobile ? "400px" : "600px",  // responsive height
        background:
          "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",  // smooth blue gradient background
        borderRadius: "20px",
        boxShadow: "0 15px 30px rgba(0,0,0,0.5)",
        margin: "auto",
        maxWidth: "900px",
      }}
    >
      <Canvas
        frameloop="demand"
        shadows
        dpr={[1, 2]}
        camera={{ position: [20, 3, 5], fov: 30 }}
        gl={{ preserveDrawingBuffer: true }}
        style={{ borderRadius: "20px" }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Computers isMobile={isMobile} />
        </Suspense>
        <Preload all />
      </Canvas>

      <button
        onClick={handleChange}
        className="
          mt-6
          px-6
          py-3
          bg-blue-700
          text-white
          rounded-xl
          shadow-lg
          hover:bg-blue-800
          transition
          duration-300
          ease-in-out
          text-lg
          font-semibold
          w-full
          sm:w-auto
          block
          mx-auto
          sm:mx-0
        "
      >
        Go to Home
      </button>
    </div>
  );
};

export default ComputersCanvas;
