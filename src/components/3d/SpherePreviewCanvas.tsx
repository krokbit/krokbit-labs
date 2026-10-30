"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import WavySphere from "./WavySphere";

export default function SpherePreviewCanvas() {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <WavySphere centered={true} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} mipmapBlur intensity={0.7} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
