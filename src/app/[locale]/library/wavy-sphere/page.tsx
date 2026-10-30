import { getDictionary } from "@/get-dictionary";
import ComponentViewer from "@/components/ui/ComponentViewer";
import SpherePreviewCanvas from "@/components/3d/SpherePreviewCanvas";

const SPHERE_SOURCE_CODE = `"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WavySphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#00f0ff") },
      uColor2: { value: new THREE.Color("#0022cc") },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 32]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        wireframe={true}
        transparent={true}
        vertexShader={\`
          uniform float uTime;
          varying vec3 vPosition;
          void main() {
            vPosition = position;
            vec3 p = position;
            float noise = sin(p.x * 2.0 + uTime) * cos(p.y * 2.0 + uTime) * sin(p.z * 2.0 + uTime);
            p += normal * noise * 0.4;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        \`}
        fragmentShader={\`
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          varying vec3 vPosition;
          void main() {
            float mixValue = (vPosition.y + 1.5) / 3.0 + sin(uTime * 0.5) * 0.2;
            vec3 color = mix(uColor1, uColor2, clamp(mixValue, 0.0, 1.0));
            gl_FragColor = vec4(color * 1.5, 0.3);
          }
        \`}
      />
    </mesh>
  );
}`;

export default async function WavySpherePage({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}) {
  const dict = await getDictionary(locale);

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-white mb-3">
          {dict.library.wavySpherePage.title}
        </h1>
        <p className="text-gray-400 text-lg">
          {dict.library.wavySpherePage.description}
        </p>
      </div>

      <ComponentViewer
        code={SPHERE_SOURCE_CODE}
        previewLabel={dict.library.viewer.preview}
        codeLabel={dict.library.viewer.code}
        copyLabel={dict.library.viewer.copy}
        copiedLabel={dict.library.viewer.copied}
      >
        <SpherePreviewCanvas />
      </ComponentViewer>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          {dict.library.wavySpherePage.installTitle}
        </h2>
        <div className="p-4 bg-[#050505] border border-white/10 rounded-xl font-mono text-xs text-gray-300 overflow-x-auto">
          npm install three @types/three @react-three/fiber
          @react-three/postprocessing
        </div>
      </div>
    </div>
  );
}
