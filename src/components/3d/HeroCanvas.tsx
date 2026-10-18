"use client";

import { Canvas } from "@react-three/fiber";
import WavySphere from "./WavySphere";

export default function HeroCanvas() {
  return (
    <div className="w-full h-[500px] lg:h-screen lg:absolute lg:top-0 lg:right-0 lg:w-[65%] z-0 pointer-events-none">
      {/* pointer-events-auto возвращает интерактивность только самой сцене */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        className="pointer-events-auto"
      >
        <WavySphere />
      </Canvas>
    </div>
  );
}
