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
      ? "Quantum Vortex Morph — WebGL & Three.js Komponenta"
      : "Quantum Vortex Morph — WebGL & Three.js Component",
    description: isCs
      ? "Interaktivní 3D GLSL morfující chameleon (Torus, Trefoil Knot, Astroid) pro React a Next.js."
      : "Interactive 3D GLSL shape-morphing chameleon shader (Torus, Trefoil Knot, Astroid) for React and Next.js.",
  };
}

const VORTEX_SOURCE_CODE = `"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const SHAPE_LABELS = [
  "01 / QUANTUM TORUS",
  "02 / TREFOIL KNOT",
  "03 / ASTROID CORE",
];

function MorphingChameleonMesh({
  pointerRef,
  hoverRef,
  shapeIndex,
}: {
  pointerRef: React.MutableRefObject<THREE.Vector2>;
  hoverRef: React.MutableRefObject<number>;
  shapeIndex: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const morphWeights = useRef(new THREE.Vector3(1, 0, 0));
  const shockRef = useRef(0);
  const prevShapeRef = useRef(shapeIndex);

  if (prevShapeRef.current !== shapeIndex) {
    prevShapeRef.current = shapeIndex;
    shockRef.current = 1.0;
  }

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uHover: { value: 0 },
      uShock: { value: 0 },
      uMorph: { value: new THREE.Vector3(1, 0, 0) },
    }),
    []
  );

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);

    const targetWeights = new THREE.Vector3(
      shapeIndex === 0 ? 1 : 0,
      shapeIndex === 1 ? 1 : 0,
      shapeIndex === 2 ? 1 : 0
    );
    morphWeights.current.lerp(targetWeights, dt * 4.5);
    shockRef.current = Math.max(0, shockRef.current - dt * 2.2);

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uPointer.value.lerp(pointerRef.current, 0.1);
      materialRef.current.uniforms.uHover.value +=
        (hoverRef.current - materialRef.current.uniforms.uHover.value) * 0.08;
      materialRef.current.uniforms.uShock.value = shockRef.current;
      materialRef.current.uniforms.uMorph.value.copy(morphWeights.current);
    }

    if (meshRef.current) {
      const targetRotX = 0.35 - pointerRef.current.y * 0.55;
      const targetRotY = pointerRef.current.x * 0.65 + t * 0.22;
      meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.08;
      meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.08;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1.25, 0.45, 52, 140]} />
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
          uniform float uHover;
          uniform float uShock;
          uniform vec3 uMorph;

          varying float vEnergy;
          varying float vChameleon;
          varying vec3 vPos;

          const float PI2 = 6.2831853;

          vec3 getTorus(float u, float v, float t) {
            float twist = sin(u * 4.0 + t * 2.2 + v * 2.0) * 0.14;
            float R = 1.3 + twist;
            float r = 0.46 + cos(u * 6.0 - t * 1.8) * 0.08;
            return vec3((R + r * cos(v)) * cos(u), (R + r * cos(v)) * sin(u), r * sin(v));
          }

          vec3 getTrefoilKnot(float u, float v, float t) {
            float rTube = 0.28 + 0.06 * sin(u * 6.0 + t * 3.0);
            vec3 center = vec3(
              sin(u) + 2.0 * sin(2.0 * u),
              cos(u) - 2.0 * cos(2.0 * u),
              -sin(3.0 * u)
            ) * 0.52;
            vec3 tangent = normalize(vec3(
              cos(u) + 4.0 * cos(2.0 * u),
              -sin(u) + 4.0 * sin(2.0 * u),
              -3.0 * cos(3.0 * u)
            ));
            vec3 normalVec = normalize(cross(tangent, vec3(0.0, 0.0, 1.0)) + vec3(0.001));
            vec3 binormal = normalize(cross(tangent, normalVec));
            return center + rTube * (normalVec * cos(v) + binormal * sin(v));
          }

          vec3 getAstroidCore(float u, float v, float t) {
            float lat = (uv.y - 0.5) * 3.1415926;
            float spikes = 1.0 + 0.38 * sin(u * 5.0 + t * 2.0) * cos(lat * 4.0 - t * 1.5);
            float rad = 1.45 * spikes;
            return vec3(rad * cos(lat) * cos(u), rad * cos(lat) * sin(u), rad * sin(lat));
          }

          void main() {
            float u = uv.x * PI2;
            float v = uv.y * PI2;
            vec3 p = getTorus(u, v, uTime) * uMorph.x + getTrefoilKnot(u, v, uTime) * uMorph.y + getAstroidCore(u, v, uTime) * uMorph.z;

            vec2 pointerWorld = uPointer * 1.75;
            float distToPointer = distance(p.xy, pointerWorld);
            float bendForce = smoothstep(1.65, 0.0, distToPointer) * (0.35 + uHover * 0.65);

            vec3 pushDir = normalize(vec3(p.xy - pointerWorld, 0.45));
            float ripple = sin(distToPointer * 6.0 - uTime * 7.0) * bendForce * 0.25;
            float shockWave = sin(length(p) * 5.0 - uShock * 10.0) * uShock * 0.32;

            p += pushDir * (bendForce * 0.48 + ripple) + normalize(p) * shockWave;
            vPos = p;
            vEnergy = clamp(bendForce * 1.35 + uShock * 0.9 + (sin(u * 3.0 + uTime * 2.0) * 0.5 + 0.5) * 0.35, 0.0, 1.0);
            vChameleon = fract(uv.x * 1.5 + uv.y * 0.5 + uTime * 0.18 + bendForce * 0.6 + uMorph.y * 0.33 + uMorph.z * 0.66);

            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        \`}
        fragmentShader={\`
          varying float vEnergy;
          varying float vChameleon;
          varying vec3 vPos;

          vec3 chameleonPalette(float t) {
            vec3 a = vec3(0.08, 0.48, 0.68);
            vec3 b = vec3(0.42, 0.38, 0.55);
            vec3 c = vec3(1.0, 1.0, 1.0);
            vec3 d = vec3(0.00, 0.33, 0.67);
            return a + b * cos(6.28318 * (c * t + d));
          }

          void main() {
            vec3 baseEmerald = vec3(0.04, 0.55, 0.48);
            vec3 iridColor = chameleonPalette(vChameleon);
            vec3 hotMagenta = vec3(0.75, 0.22, 0.95);

            vec3 col = mix(baseEmerald, iridColor, 0.55 + vEnergy * 0.45);
            col = mix(col, hotMagenta, smoothstep(0.6, 1.0, vEnergy) * 0.65);

            float depthFade = smoothstep(-1.8, 1.8, vPos.z) * 0.5 + 0.5;
            float alpha = (0.16 + vEnergy * 0.28) * depthFade;
            gl_FragColor = vec4(col * 0.88, alpha);
          }
        \`}
      />
    </mesh>
  );
}

export default function VortexPreviewCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef(new THREE.Vector2(0, 0));
  const hoverRef = useRef(0);
  const [shapeIndex, setShapeIndex] = useState(0);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    hoverRef.current = 1;
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerRef.current.set(0, 0);
        hoverRef.current = 0;
      }}
      onClick={() => setShapeIndex((prev) => (prev + 1) % SHAPE_LABELS.length)}
      className="w-full h-full relative touch-pan-y cursor-pointer select-none"
    >
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[11px] font-mono">
        <span className="px-2.5 py-1 rounded-md bg-black/75 border border-white/15 text-emerald-400 backdrop-blur-md">
          {SHAPE_LABELS[shapeIndex]}
        </span>
        <span className="px-2.5 py-1 rounded-md bg-black/75 border border-white/10 text-gray-300 backdrop-blur-md">
          Click / Tap to Morph ↻
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 4.9], fov: 45 }}
        style={{ touchAction: "pan-y", width: "100%", height: "100%" }}
      >
        <MorphingChameleonMesh
          pointerRef={pointerRef}
          hoverRef={hoverRef}
          shapeIndex={shapeIndex}
        />
        <EffectComposer>
          <Bloom luminanceThreshold={0.42} mipmapBlur intensity={0.38} />
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
    "Shape Morphing",
    "Chameleon GLSL",
    "Touch & Click",
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
