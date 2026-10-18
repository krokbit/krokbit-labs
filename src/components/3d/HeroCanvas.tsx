"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import WavySphere from "./WavySphere";

export default function HeroCanvas() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[-1] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 45 }}
        className="pointer-events-none"
      >
        <WavySphere />
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={0.7} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
