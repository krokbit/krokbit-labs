import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import ComponentViewer from "@/components/ui/ComponentViewer";
import InteractiveTelemetryCard from "@/components/ui/InteractiveTelemetryCard";
import CliCommandBar from "@/components/ui/CliCommandBar";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}): Promise<Metadata> {
  const isCs = locale === "cs";
  return {
    title: isCs
      ? "3D Holo Bento Karta — React & Tailwind CSS"
      : "3D Holo Bento Card — React & Tailwind CSS",
    description: isCs
      ? "Interaktivní 3D skleněná telemetrická karta s reakcí na dotyk a myš."
      : "Interactive 3D tilt glassmorphism telemetry card with live GPU stress-test state for React and Next.js.",
  };
}

const CARD_SOURCE_CODE = `"use client";

import { useState, useEffect, useRef } from "react";

export default function InteractiveTelemetryCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [overclock, setOverclock] = useState(false);
  const [phase, setPhase] = useState(0);
  const [pointerRatio, setPointerRatio] = useState<number | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setPhase((prev) => prev + dt * (overclock ? 7.5 : 2.8));
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [overclock]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;

    setPointerRatio(x / rect.width);
    setTilt({
      rotateX,
      rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handlePointerLeave = () => {
    setPointerRatio(null);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const activeLoad = pointerRatio !== null ? pointerRatio * 0.25 : 0;
  const baseFrameMs = overclock ? 0.64 : 1.42;
  const liveFrameMs = (baseFrameMs + Math.sin(phase * 1.5) * 0.08 - activeLoad * 0.15).toFixed(2);
  const liveDeltaMs = (overclock ? -0.78 - activeLoad * 0.1 : -0.18 - activeLoad * 0.05).toFixed(2);
  const liveFps = (
    (overclock ? 143.6 : 59.8) +
    Math.sin(phase * 2.1) * 0.3 +
    (pointerRatio !== null ? 0.2 : 0)
  ).toFixed(1);
  const liveVram = (
    (overclock ? 114.2 : 48.4) +
    Math.sin(phase) * 1.6 +
    activeLoad * 18
  ).toFixed(1);

  const barCount = 16;
  const bars = Array.from({ length: barCount }, (_, i) => {
    const normIdx = i / (barCount - 1);
    const wave = Math.sin(phase + i * 0.45) * 22 + Math.cos(phase * 0.7 - i * 0.3) * 12;
    const baseHeight = overclock ? 64 : 46;

    const distToFinger = pointerRatio !== null ? Math.abs(normIdx - pointerRatio) : 1;
    const fingerBoost = pointerRatio !== null ? Math.max(0, 1 - distToFinger * 3.2) * 38 : 0;

    return Math.min(100, Math.max(16, baseHeight + wave + fingerBoost));
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 select-none">
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          transform: \`perspective(1000px) rotateX(\${tilt.rotateX}deg) rotateY(\${tilt.rotateY}deg)\`,
          transition: tilt.rotateX === 0 ? "transform 0.5s ease-out" : "transform 0.06s linear",
        }}
        className="relative w-full max-w-sm rounded-2xl p-[1px] bg-gradient-to-b from-white/30 via-white/10 to-transparent shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] cursor-pointer touch-pan-y"
      >
        <div className="relative rounded-[15px] bg-black/80 backdrop-blur-2xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] space-y-5 overflow-hidden">
          <div
            style={{
              background: \`radial-gradient(circle at \${tilt.glareX}% \${tilt.glareY}%, rgba(255,255,255,0.16) 0%, transparent 60%)\`,
            }}
            className="pointer-events-none absolute inset-0 z-20"
          />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={\`h-2.5 w-2.5 rounded-full transition-colors duration-300 \${
                  overclock
                    ? "bg-[#00f0ff] shadow-[0_0_12px_#00f0ff]"
                    : "bg-emerald-400 shadow-[0_0_10px_#34d399]"
                }\`}
              />
              <span className="text-xs font-mono uppercase tracking-widest text-gray-300">
                {overclock ? "TURBO_PIPELINE_X" : "SHADER_PIPELINE_04"}
              </span>
            </div>
            <span className="px-2 py-0.5 text-[11px] font-mono rounded border text-emerald-400 bg-emerald-500/10 border-emerald-400/25">
              {liveFps} FPS
            </span>
          </div>

          <div className="relative z-10 flex items-end justify-between">
            <div>
              <div className="text-xs text-gray-400 mb-1">Frame Draw Time</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight font-mono">
                  {liveFrameMs} ms
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  {liveDeltaMs}ms
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOverclock(!overclock)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider border bg-white/5 text-gray-300 border-white/15 hover:border-white/35 transition-all active:scale-95"
            >
              {overclock ? "Boost: ON" : "Boost GPU"}
            </button>
          </div>

          <div className="relative z-10 h-20 flex items-end gap-1 pt-2 border-b border-white/10 pb-3">
            {bars.map((height, i) => (
              <div
                key={i}
                style={{ height: \`\${height}%\` }}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-500/20 via-emerald-400/70 to-[#00f0ff]"
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>VRAM: {liveVram} MB</span>
            <span className="text-emerald-400">
              VEC2 [{((tilt.glareX - 50) / 50).toFixed(2)}, {((tilt.glareY - 50) / 50).toFixed(2)}]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}`;

export default async function CardsPage({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}) {
  const dict = await getDictionary(locale);
  const stackBadges = ["React 19", "3D Perspective Tilt", "Live State", "Touch & Mouse"];

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
          {dict.library.cardsPage.title}
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          {dict.library.cardsPage.description}
        </p>
      </div>

      <ComponentViewer
        code={CARD_SOURCE_CODE}
        previewLabel={dict.library.viewer.preview}
        codeLabel={dict.library.viewer.code}
        copyLabel={dict.library.viewer.copy}
        copiedLabel={dict.library.viewer.copied}
      >
        <InteractiveTelemetryCard />
      </ComponentViewer>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white">CLI Installation</h2>
        <CliCommandBar command="npx shadcn@latest add https://labs.krokbit.cz/r/cards.json" />
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          {dict.library.cardsPage.usageTitle}
        </h2>
        <div className="p-4 bg-[#050505] border border-white/10 rounded-xl font-mono text-xs text-gray-300 leading-relaxed break-words">
          Pure React state + CSS 3D Matrix Perspective — zero external libraries.
        </div>
      </div>
    </div>
  );
}