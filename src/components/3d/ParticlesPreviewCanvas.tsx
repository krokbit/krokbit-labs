"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function WaveParticles() {
  const pointsRef = useRef<THREE.Points>(null);
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
    if (pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.25;
    }
  });

  return (
    <points ref={pointsRef} rotation={[0.45, 0, 0]}>
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
        vertexShader={`
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
        `}
        fragmentShader={`
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
        `}
      />
    </points>
  );
}

export default function ParticlesPreviewCanvas() {
  return (
    <div className="w-full h-full relative touch-pan-y">
      <Canvas
        camera={{ position: [0, 2.2, 6.5], fov: 45 }}
        style={{ touchAction: "pan-y" }}
      >
        <WaveParticles />
      </Canvas>
    </div>
  );
}