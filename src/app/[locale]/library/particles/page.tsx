import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import ComponentViewer from "@/components/ui/ComponentViewer";
import ParticlesPreviewCanvas from "@/components/3d/ParticlesPreviewCanvas";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}): Promise<Metadata> {
  const isCs = locale === "cs";
  return {
    title: isCs
      ? "Particles Grid — WebGL & Three.js Komponenta"
      : "Particles Grid — WebGL & Three.js Component",
    description: isCs
      ? "GPU akcelerované pole 2 500 částic pro React a Next.js."
      : "GPU-accelerated 2,500 vertex wave field for React, Next.js, and Three.js.",
  };
}

const PARTICLES_SOURCE_CODE = `"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WaveParticles() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const positions = useMemo(() => {
    const count = 50;
    const sep = 0.22;
    const array = new Float32Array(count * count * 3);
    let i = 0;
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        array[i] = (xi - count / 2) * sep;
        array[i + 1] = 0;
        array[i + 2] = (zi - count / 2) * sep;
        i += 3;
      }
    }
    return array;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#34d399") },
      uColor2: { value: new THREE.Color("#00f0ff") },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <points rotation={[0.45, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        vertexShader={\`
          uniform float uTime;
          varying float vElevation;
          void main() {
            vec3 p = position;
            float wave = sin(p.x * 1.2 + uTime * 1.6) * cos(p.z * 1.2 + uTime * 1.2) * 0.45;
            p.y += wave;
            vElevation = wave;
            vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (14.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        \`}
        fragmentShader={\`
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          varying float vElevation;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float mixStrength = (vElevation + 0.45) / 0.9;
            vec3 color = mix(uColor2, uColor1, clamp(mixStrength, 0.0, 1.0));
            gl_FragColor = vec4(color, 0.85);
          }
        \`}
      />
    </points>
  );
}`;

export default async function ParticlesPage({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}) {
  const dict = await getDictionary(locale);
  const stackBadges = ["React 19", "Next.js", "Three.js / R3F", "GLSL Shaders", "60 FPS"];

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
          {dict.library.particlesPage.title}
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          {dict.library.particlesPage.description}
        </p>
      </div>

      <ComponentViewer
        code={PARTICLES_SOURCE_CODE}
        previewLabel={dict.library.viewer.preview}
        codeLabel={dict.library.viewer.code}
        copyLabel={dict.library.viewer.copy}
        copiedLabel={dict.library.viewer.copied}
      >
        <ParticlesPreviewCanvas />
      </ComponentViewer>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          {dict.library.particlesPage.installTitle}
        </h2>
        <div className="p-4 bg-[#050505] border border-white/10 rounded-xl font-mono text-xs text-gray-300 leading-relaxed break-words">
          npm install three @types/three @react-three/fiber
        </div>
      </div>
    </div>
  );
}