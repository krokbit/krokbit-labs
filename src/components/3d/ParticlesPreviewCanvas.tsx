"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function InteractiveForceField() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseGlobal = useRef(new THREE.Vector2(0, 0));

  const positions = useMemo(() => {
    const pts: number[] = [];
    const rings = 38;
    const maxRadius = 4.2;

    for (let r = 1; r <= rings; r++) {
      const radius = (r / rings) * maxRadius;
      const circumference = 2 * Math.PI * radius;
      const count = Math.floor(circumference / 0.14);

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
      uColorBase: { value: new THREE.Color("#0044ff") },
      uColorActive: { value: new THREE.Color("#00f0ff") },
      uColorPeak: { value: new THREE.Color("#34d399") },
    }),
    []
  );

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      mouseGlobal.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseGlobal.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;

      const targetX = mouseGlobal.current.x * 3.5;
      const targetZ = -mouseGlobal.current.y * 3.5;

      materialRef.current.uniforms.uMouse.value.x +=
        (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.12;
      materialRef.current.uniforms.uMouse.value.y +=
        (targetZ - materialRef.current.uniforms.uMouse.value.y) * 0.12;
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.08 + mouseGlobal.current.x * 0.25;
      pointsRef.current.rotation.x = 0.55 + mouseGlobal.current.y * 0.15;
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

            // Радиальная пульсация из центра
            float baseWave = sin(distFromCenter * 2.2 - uTime * 2.4) * 0.25;

            // Гравитационный импульс от пальца или мыши
            float distToMouse = distance(p.xz, uMouse);
            float force = smoothstep(2.0, 0.0, distToMouse);
            float ripple = sin(distToMouse * 5.0 - uTime * 6.0) * force * 0.55;

            p.y += baseWave + ripple + (force * 0.65);
            vEnergy = clamp((p.y + 0.4) / 1.4 + force * 0.8, 0.0, 1.0);

            vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (18.0 + force * 16.0) / -mvPosition.z;
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

            // Мягкое свечение каждой частицы
            float glow = smoothstep(0.5, 0.05, d);
            vec3 col = mix(uColorBase, uColorActive, vEnergy);
            col = mix(col, uColorPeak, smoothstep(0.6, 1.0, vEnergy));

            // Плавное растворение краев диска
            float edgeFade = smoothstep(4.2, 2.8, vDistCenter);
            gl_FragColor = vec4(col * 1.4, glow * edgeFade * 0.9);
          }
        `}
      />
    </points>
  );
}

export default function ParticlesPreviewCanvas() {
  return (
    <div className="w-full h-full relative touch-pan-y">
      <Canvas
        camera={{ position: [0, 3.2, 6.2], fov: 45 }}
        style={{ touchAction: "pan-y" }}
      >
        <InteractiveForceField />
        <EffectComposer>
          <Bloom luminanceThreshold={0.15} mipmapBlur intensity={0.65} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}