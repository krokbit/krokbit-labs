"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WavySphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const mouseGlobal = useRef(new THREE.Vector2(0, 0));
  const targetRotation = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#00f0ff") },
      uColor2: { value: new THREE.Color("#0022cc") },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  );

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      mouseGlobal.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseGlobal.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame((state) => {
    const { clock, camera } = state;

    if (meshRef.current) {
      // 1. Adaptive Positioning
      const isDesktop = window.innerWidth > 1024;
      const targetX = isDesktop ? 2.2 : 0.0;

      // Desktop: centered (0.0). Mobile: shifted slightly up (0.5) to fill empty space
      const targetY = isDesktop ? 0.0 : 0.5;

      meshRef.current.position.x +=
        (targetX - meshRef.current.position.x) * 0.1;
      meshRef.current.position.y +=
        (targetY - meshRef.current.position.y) * 0.1;

      // 2. 2D to 3D Projection for precise mouse tracking
      const vec = new THREE.Vector3(
        mouseGlobal.current.x,
        mouseGlobal.current.y,
        0.5,
      );
      vec.unproject(camera);
      vec.sub(camera.position).normalize();
      const distance = -camera.position.z / vec.z;
      const worldMousePos = new THREE.Vector3()
        .copy(camera.position)
        .add(vec.multiplyScalar(distance));

      const localMousePos = worldMousePos.sub(meshRef.current.position);

      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
        materialRef.current.uniforms.uMouse.value.x +=
          (localMousePos.x - materialRef.current.uniforms.uMouse.value.x) * 0.1;
        materialRef.current.uniforms.uMouse.value.y +=
          (localMousePos.y - materialRef.current.uniforms.uMouse.value.y) * 0.1;
      }

      // 3. Base Rotation
      targetRotation.current.x = mouseGlobal.current.y * 0.15;
      targetRotation.current.y = mouseGlobal.current.x * 0.15;

      meshRef.current.rotation.x +=
        (targetRotation.current.x - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y +=
        (targetRotation.current.y - meshRef.current.rotation.y) * 0.05 + 0.001;
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.02;
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
        toneMapped={false}
        depthWrite={false}
        vertexShader={`
          uniform float uTime;
          uniform vec2 uMouse; 
          
          varying vec2 vUv;
          varying vec3 vPosition;

          void main() {
            vUv = uv;
            vPosition = position;
            
            vec3 p = position;
            
            // Noise calculations
            float noise = sin(p.x * 2.0 + uTime) * cos(p.y * 2.0 + uTime) * sin(p.z * 2.0 + uTime);
            p += normal * noise * 0.4;
            
            // Mouse interaction pull
            float dist = distance(p.xy, uMouse);
            float pull = smoothstep(1.5, 0.0, dist);
            p += normal * pull * 0.8;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          varying vec2 vUv;
          varying vec3 vPosition;

          void main() {
            float mixValue = (vPosition.y + 1.5) / 3.0 + sin(uTime * 0.5) * 0.2;
            vec3 color = mix(uColor1, uColor2, clamp(mixValue, 0.0, 1.0));
            
            // Neon HDR intensity multiplier
            float intensity = 1.5; 
            gl_FragColor = vec4(color * intensity, 0.3);
          }
        `}
      />
    </mesh>
  );
}
