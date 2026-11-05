import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import ComponentViewer from "@/components/ui/ComponentViewer";
import VortexPreviewCanvas from "@/components/3d/VortexPreviewCanvas";
import CliCommandBar from "@/components/ui/CliCommandBar";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}): Promise<Metadata> {
  const isCs = locale === "cs";
  return {
    title: isCs
      ? "Quantum Vortex Torus — WebGL & Three.js Komponenta"
      : "Quantum Vortex Torus — WebGL & Three.js Component",
    description: isCs
      ? "Interaktivní 3D GLSL toroidní vír s HDR Bloom post-processingem pro React a Next.js."
      : "Interactive 3D GLSL twisted torus vortex with pointer reactivity and HDR Bloom for React and Next.js.",
  };
}

const VORTEX_SOURCE_CODE = `"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function QuantumVortexMesh({
  pointerRef,
}: {
  pointerRef: React.MutableRefObject<THREE.Vector2>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uColorCore: { value: new THREE.Color("#00f0ff") },
      uColorEdge: { value: new THREE.Color("#10b981") },
      uColorDeep: { value: new THREE.Color("#001a66") },
    }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uPointer.value.lerp(pointerRef.current, 0.08);
    }

    if (meshRef.current) {
      const targetRotX = 0.55 + pointerRef.current.y * 0.35;
      const targetRotY = pointerRef.current.x * 0.45;
      meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.08;
      meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.08;
      meshRef.current.rotation.z = t * 0.18;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1.35, 0.48, 64, 160]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        wireframe={true}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={\`
          uniform float uTime;
          uniform vec2 uPointer;
          varying float vPulse;
          varying vec2 vUv;

          void main() {
            vUv = uv;
            vec3 p = position;
            float twist = sin(uv.x * 18.84955 + uTime * 2.4 + uv.y * 6.28318);
            float pointerEnergy = length(uPointer) * 0.45;
            p += normal * (twist * (0.09 + pointerEnergy * 0.08));
            vPulse = (twist + 1.0) * 0.5;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        \`}
        fragmentShader={\`
          uniform vec3 uColorCore;
          uniform vec3 uColorEdge;
          uniform vec3 uColorDeep;
          varying float vPulse;
          varying vec2 vUv;

          void main() {
            float ringFade = sin(vUv.y * 3.14159);
            vec3 col = mix(uColorDeep, uColorEdge, vPulse);
            col = mix(col, uColorCore, smoothstep(0.55, 1.0, vPulse));
            gl_FragColor = vec4(col * 1.4, 0.28 + vPulse * 0.45 * ringFade);
          }
        \`}
      />
    </mesh>
  );
}

export default function VortexPreviewCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef(new THREE.Vector2(0, 0));

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => pointerRef.current.set(0, 0)}
      className="w-full h-full relative touch-pan-y"
    >
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        style={{ touchAction: "pan-y", width: "100%", height: "100%" }}
      >
        <QuantumVortexMesh pointerRef={pointerRef} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={0.75} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}`;

export default async function VortexPage({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}) {
  const dict = await getDictionary(locale);
  const stackBadges = [
    "React 19",
    "Next.js",
    "Three.js / R3F",
    "GLSL Torus",
    "HDR Bloom",
  ];

  return (
    <div className="p-6 sm:p-8 lg:p-12 max-w-5xl mx-auto space-y-8 sm:space-y-10">
      <div>
        <div className="flex flex-wrap gap-2 mb-4">
          {stackBadges.map((badge) => (
            <span
              key={badge}
              className="px-2.5 py-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 rounded-md"
            >
              {badge}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          {dict.library.vortexPage.title}
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          {dict.library.vortexPage.description}
        </p>
      </div>

      <ComponentViewer
        code={VORTEX_SOURCE_CODE}
        previewLabel={dict.library.viewer.preview}
        codeLabel={dict.library.viewer.code}
        copyLabel={dict.library.viewer.copy}
        copiedLabel={dict.library.viewer.copied}
      >
        <VortexPreviewCanvas />
      </ComponentViewer>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white">CLI Installation</h2>
        <CliCommandBar command="npx shadcn@latest add https://labs.krokbit.cz/r/vortex.json" />
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          {dict.library.vortexPage.installTitle}
        </h2>
        <div className="p-4 bg-[#050505] border border-white/10 rounded-xl font-mono text-xs text-gray-300 leading-relaxed break-words">
          npm install three @types/three @react-three/fiber
          @react-three/postprocessing
        </div>
      </div>
    </div>
  );
}
