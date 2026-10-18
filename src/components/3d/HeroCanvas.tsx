"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

export default function HeroCanvas() {
  return (
    <div className="w-full h-[500px] lg:h-screen lg:absolute lg:top-0 lg:right-0 lg:w-1/2 z-0 pointer-events-auto cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <mesh>
          <icosahedronGeometry args={[1.5, 2]} />
          <meshStandardMaterial color="#4f46e5" wireframe />
        </mesh>

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
