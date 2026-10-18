"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WavySphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Глобальная мышь для вращения всей сферы (работает по всему экрану)
  const mouseGlobal = useRef(new THREE.Vector2(0, 0));
  // Целевой вектор для плавного lerp-вращения
  const targetRotation = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      // uTime управляет скоростью "кипения" волн
      uTime: { value: 0 },
      // Цвета
      uColor1: { value: new THREE.Color("#00f0ff") },
      uColor2: { value: new THREE.Color("#0022cc") },
      // Вектор мыши для передачи в шейдер (локальный, внутри канваса)
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  );

  // Перехват глобальной мыши только для поворота оси (чтобы сфера следила за курсором всегда)
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      mouseGlobal.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseGlobal.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame((state) => {
    const { clock, pointer } = state;

    if (materialRef.current) {
      // ВОЗВРАЩЕНО: Оригинальная скорость волн (без умножения на 0.25)
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime() * 0.45;

      // Передаем координаты мыши в шейдер.
      // pointer - это внутренние координаты R3F (от -1 до 1 строго внутри Canvas)
      // Lerp здесь делает притяжение вершин чуть более плавным
      materialRef.current.uniforms.uMouse.value.x +=
        (pointer.x - materialRef.current.uniforms.uMouse.value.x) * 0.1;
      materialRef.current.uniforms.uMouse.value.y +=
        (pointer.y - materialRef.current.uniforms.uMouse.value.y) * 0.1;
    }

    if (meshRef.current) {
      // СОХРАНЕНО: Медленное и плавное вращение всей конструкции за мышью
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
        blending={THREE.AdditiveBlending}
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
            
            // 1. БАЗОВАЯ ВОЛНА (Математика искажений)
            float noise = sin(p.x * 2.0 + uTime) * cos(p.y * 2.0 + uTime) * sin(p.z * 2.0 + uTime);
            
            // ВОЗВРАЩЕНО: Оригинальная амплитуда 0.4 (была урезана до 0.25)
            // КРУТИТЬ ЗДЕСЬ: Если волны слишком сильные, уменьшай 0.4 до 0.3
            p += normal * noise * 0.4;
            
            // 2. ВЗАИМОДЕЙСТВИЕ С МЫШЬЮ
            // Масштабируем 2D координаты курсора (-1..1) в 3D пространство (умножение на 3.5)
            // КРУТИТЬ ЗДЕСЬ: Если зона реакции не совпадает с курсором визуально, меняй 3.5
            vec2 mouseScaled = uMouse * 3.5;
            
            // Вычисляем дистанцию от текущей вершины до курсора
            float dist = distance(p.xy, mouseScaled);
            
            // radius определяет, насколько широко от курсора реагируют вершины (1.5 - оптимально)
            float radius = 1.5;
            
            // smoothstep создает плавный градиент притяжения: 
            // 1.0 в самом центре курсора, 0.0 на границе радиуса
            float pull = smoothstep(radius, 0.0, dist);
            
            // Применяем притяжение. Умножаем нормаль на силу тяги.
            // КРУТИТЬ ЗДЕСЬ: 0.8 - это сила притяжения (насколько сильно вершины выпирают)
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
            
            float intensity = 1.2;
            gl_FragColor = vec4(color * intensity, 0.6);
          }
        `}
      />
    </mesh>
  );
}
