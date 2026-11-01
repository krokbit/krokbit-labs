"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import WavySphere from "./WavySphere";

export default function SpherePreviewCanvas() {
  return (
    <div className="w-full h-full relative touch-pan-y">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        style={{ touchAction: "pan-y" }}
      >
        <WavySphere centered={true} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.1}
            mipmapBlur
            intensity={0.7}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}