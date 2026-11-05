"use client";

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
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uPointer.value.lerp(
        pointerRef.current,
        0.08,
      );
    }

    if (meshRef.current) {
      const targetRotX = 0.55 + pointerRef.current.y * 0.35;
      const targetRotY = pointerRef.current.x * 0.45;
      meshRef.current.rotation.x +=
        (targetRotX - meshRef.current.rotation.x) * 0.08;
      meshRef.current.rotation.y +=
        (targetRotY - meshRef.current.rotation.y) * 0.08;
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
        vertexShader={`
          uniform float uTime;
          uniform vec2 uPointer;
          varying float vPulse;
          varying vec2 vUv;

          void main() {
            vUv = uv;
            vec3 p = position;

            float twist = sin(uv.x * 18.84955 + uTime * 2.4 + uv.y * 6.28318);
            float pointerEnergy = length(uPointer) * 0.45;
            float displacement = twist * (0.09 + pointerEnergy * 0.08);

            p += normal * displacement;
            vPulse = (twist + 1.0) * 0.5;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
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
        `}
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

  const handlePointerLeave = () => {
    pointerRef.current.set(0, 0);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
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
}
