"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import WavySphere from "./WavySphere";

const PRESETS = [
  { name: "Cyber", c1: "#00f0ff", c2: "#0022cc" },
  { name: "Matrix", c1: "#34d399", c2: "#065f46" },
  { name: "Plasma", c1: "#e879f9", c2: "#4f46e5" },
];

export default function SpherePreviewCanvas() {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [speed, setSpeed] = useState(1.0);

  return (
    <div className="w-full h-full relative touch-pan-y">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        style={{ touchAction: "pan-y", width: "100%", height: "100%" }}
      >
        <WavySphere
          centered={true}
          color1={preset.c1}
          color2={preset.c2}
          speed={speed}
        />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} mipmapBlur intensity={0.7} />
        </EffectComposer>
      </Canvas>

      {/* Интерактивный пульт управления шейдером */}
      <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 z-10 flex flex-wrap items-center justify-between sm:justify-end gap-3 px-3.5 py-2 rounded-xl bg-black/75 backdrop-blur-xl border border-white/15 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setPreset(p)}
              className={`px-2 py-1 rounded-md transition-all ${
                preset.name === p.name
                  ? "bg-white text-black font-semibold"
                  : "text-gray-400 hover:text-white bg-white/5"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-gray-400 border-l border-white/10 pl-3">
          <span>SPD</span>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-16 accent-emerald-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
