"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function InteractiveForceField({
  pointerRef,
}: {
  pointerRef: React.MutableRefObject<THREE.Vector2>;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const positions = useMemo(() => {
    const pts: number[] = [];
    const rings = 44;
    const maxRadius = 4.8;

    for (let r = 1; r <= rings; r++) {
      const radius = (r / rings) * maxRadius;
      const circumference = 2 * Math.PI * radius;
      const count = Math.floor(circumference / 0.13);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        pts.push(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      }
    }
    return new Float32Array(pts);
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorBase: { value: new THREE.Color("#0033cc") },
      uColorActive: { value: new THREE.Color("#00f0ff") },
      uColorPeak: { value: new THREE.Color("#34d399") },
    }),
    []
  );

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;

      const targetX = pointerRef.current.x * 3.2;
      const targetZ = -pointerRef.current.y * 3.2;

      materialRef.current.uniforms.uMouse.value.x +=
        (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.12;
      materialRef.current.uniforms.uMouse.value.y +=
        (targetZ - materialRef.current.uniforms.uMouse.value.y) * 0.12;
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.08 + pointerRef.current.x * 0.25;
      pointsRef.current.rotation.x = 0.48 + pointerRef.current.y * 0.15;
    }

    camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={pointsRef}>
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
        blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uTime;
          uniform vec2 uMouse;
          varying float vEnergy;
          varying float vDistCenter;

          void main() {
            vec3 p = position;
            float distFromCenter = length(p.xz);
            vDistCenter = distFromCenter;

            float baseWave = sin(distFromCenter * 2.0 - uTime * 2.2) * 0.28;

            float distToMouse = distance(p.xz, uMouse);
            float force = smoothstep(2.2, 0.0, distToMouse);
            float ripple = sin(distToMouse * 4.5 - uTime * 6.0) * force * 0.6;

            p.y += baseWave + ripple + (force * 0.7);
            vEnergy = clamp((p.y + 0.4) / 1.3 + force * 0.85, 0.0, 1.0);

            vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (24.0 + force * 20.0) / -mvPosition.z;
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 uColorBase;
          uniform vec3 uColorActive;
          uniform vec3 uColorPeak;
          varying float vEnergy;
          varying float vDistCenter;

          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;

            float glow = smoothstep(0.5, 0.05, d);
            vec3 col = mix(uColorBase, uColorActive, vEnergy);
            col = mix(col, uColorPeak, smoothstep(0.55, 1.0, vEnergy));

            float edgeFade = smoothstep(4.8, 3.2, vDistCenter);
            gl_FragColor = vec4(col * 1.5, glow * edgeFade * 0.95);
          }
        `}
      />
    </points>
  );
}

export default function ParticlesPreviewCanvas() {
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
      className="w-full h-full relative touch-pan-y"
    >
      <Canvas
        camera={{ position: [0, 2.3, 4.4], fov: 50 }}
        style={{ touchAction: "pan-y", width: "100%", height: "100%" }}
      >
        <InteractiveForceField pointerRef={pointerRef} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.12} mipmapBlur intensity={0.75} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}