import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import ComponentViewer from "@/components/ui/ComponentViewer";
import SpotlightBentoGrid from "@/components/ui/SpotlightBentoGrid";
import CliCommandBar from "@/components/ui/CliCommandBar";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}): Promise<Metadata> {
  const isCs = locale === "cs";
  return {
    title: isCs
      ? "Spotlight Bento Grid — React & Tailwind CSS Komponenta"
      : "Spotlight Bento Grid — React & Tailwind CSS Component",
    description: isCs
      ? "Interaktivní B2B Bento mřížka s detekcí zařízení, GPU a živým měřením FPS pro Next.js."
      : "Interactive B2B Spotlight Bento Grid with real-time client device/GPU detection and live FPS telemetry for React & Next.js.",
  };
}

const BENTO_SOURCE_CODE = `"use client";

import { useState, useEffect, useRef } from "react";

interface HardwareSpecs {
  device: string;
  gpu: string;
  cores: number;
  screen: string;
  touch: string;
}

function detectClientHardware(): HardwareSpecs {
  if (typeof window === "undefined") {
    return {
      device: "SSR Node",
      gpu: "WebGL 2.0 Pipeline",
      cores: 8,
      screen: "1920×1080 @2x",
      touch: "Desktop",
    };
  }

  const ua = navigator.userAgent || "";
  let device = "Desktop Workstation";
  if (/iPhone/i.test(ua)) device = "Apple iPhone (iOS)";
  else if (/iPad/i.test(ua)) device = "Apple iPadOS";
  else if (/Android/i.test(ua)) {
    const match = ua.match(/Android\\s([0-9.]+);\\s([^;)]+)/i);
    device = match && match[2] ? \`Android (\${match[2].trim()})\` : "Android Device";
  } else if (/Macintosh|Mac OS X/i.test(ua)) device = "Apple Mac (macOS)";
  else if (/Windows/i.test(ua)) device = "Windows PC (x64)";
  else if (/Linux/i.test(ua)) device = "Linux Workstation";

  let gpu = "WebGL 2.0 Hardware";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const rawGpu = String((gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
        gpu = rawGpu.replace(/ANGLE \\((.+)\\)/i, "$1").split(",")[0].trim();
      }
    }
  } catch {
    gpu = "Hardware Accelerated GPU";
  }

  const cores = navigator.hardwareConcurrency || 8;
  const dpr = Math.round((window.devicePixelRatio || 1) * 10) / 10;
  const screen = \`\${window.screen.width}×\${window.screen.height} @\${dpr}x\`;
  const touchPoints = navigator.maxTouchPoints || 0;
  const touch = touchPoints > 0 ? \`Multi-Touch (\${touchPoints}pt)\` : "Mouse / Precision";

  return { device, gpu, cores, screen, touch };
}

export default function SpotlightBentoGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [specs, setSpecs] = useState<HardwareSpecs>({
    device: "Scanning Device...",
    gpu: "Probing WebGL GPU...",
    cores: 8,
    screen: "---",
    touch: "---",
  });
  const [fps, setFps] = useState<number>(60);
  const [frameMs, setFrameMs] = useState<string>("16.6");
  const [history, setHistory] = useState<number[]>([65, 72, 68, 75, 80, 78, 82, 76, 84, 79]);
  const [stressScore, setStressScore] = useState<string | null>(null);
  const [spotlight, setSpotlight] = useState({ x: 260, y: 160, opacity: 0 });

  useEffect(() => {
    setSpecs(detectClientHardware());
    let frameCount = 0;
    let lastCheck = performance.now();
    let rafId: number;

    const loop = (now: number) => {
      frameCount++;
      const elapsed = now - lastCheck;
      if (elapsed >= 450) {
        const currentFps = Math.min(240, Math.round((frameCount * 1000) / elapsed));
        setFps(currentFps);
        setFrameMs((elapsed / frameCount).toFixed(1));
        setHistory((prev) => [...prev.slice(1), Math.min(100, Math.max(25, Math.round((currentFps / 120) * 85)))]);
        frameCount = 0;
        lastCheck = now;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  };

  const runHardwareBenchmark = () => {
    const t0 = performance.now();
    let acc = 0;
    for (let i = 0; i < 450000; i++) acc += Math.sin(i * 0.01) * Math.cos(i * 0.02);
    const dt = Math.max(0.1, performance.now() - t0 + (acc > 1e9 ? 0.01 : 0));
    setStressScore(\`\${((450000 / dt) / 1000).toFixed(1)}M ops/s (\${dt.toFixed(1)}ms)\`);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2.5 sm:p-6 select-none">
      <div
        ref={gridRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setSpotlight((prev) => ({ ...prev, opacity: 0 }))}
        className="relative w-full max-w-2xl grid grid-cols-1 sm:grid-cols-5 gap-2.5 sm:gap-4 rounded-2xl p-2.5 sm:p-4 bg-white/[0.02] border border-white/10 overflow-hidden touch-pan-y"
      >
        <div
          style={{
            opacity: spotlight.opacity,
            background: \`radial-gradient(380px circle at \${spotlight.x}px \${spotlight.y}px, rgba(0, 240, 255, 0.16), rgba(16, 185, 129, 0.06) 45%, transparent 80%)\`,
          }}
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
        />

        <div className="relative z-10 sm:col-span-3 rounded-xl bg-black/85 backdrop-blur-xl border border-white/10 p-3.5 sm:p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-emerald-400">
              LIVE_CLIENT_HARDWARE
            </span>
            <span className="text-[10px] font-mono text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
              {specs.cores} CPU Threads
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] text-gray-400">Detected Host & GPU</div>
            <div className="text-base sm:text-xl font-bold text-white font-mono truncate">{specs.device}</div>
            <div className="text-xs font-mono text-[#00f0ff] truncate">{specs.gpu}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px] font-mono">
            <div>
              <span className="text-gray-500 block text-[10px]">DISPLAY MATRIX</span>
              <span className="text-gray-200">{specs.screen}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">INPUT ENGINE</span>
              <span className="text-gray-200">{specs.touch}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 sm:col-span-2 rounded-xl bg-black/85 backdrop-blur-xl border border-white/10 p-3.5 sm:p-5 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">REALTIME_RATE</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                {fps} <span className="text-xs font-normal text-emerald-400">FPS</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-2 py-0.5 rounded">
              {frameMs} ms
            </span>
          </div>

          <div className="h-10 sm:h-12 flex items-end gap-1 pt-1">
            {history.map((val, idx) => (
              <div
                key={idx}
                style={{ height: \`\${val}%\` }}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-500/25 via-emerald-400/80 to-[#00f0ff] transition-[height] duration-200"
              />
            ))}
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={runHardwareBenchmark}
              className="w-full py-2 px-3 rounded-lg text-[11px] font-mono uppercase tracking-wider bg-emerald-400/15 hover:bg-emerald-400/25 border border-emerald-400/40 text-emerald-300 font-semibold transition-[transform,background-color] duration-150 active:scale-95 outline-none focus:outline-none"
            >
              Run CPU/GPU Probe ⚡
            </button>
            <div className="text-[10px] font-mono text-center text-gray-400 truncate">
              {stressScore ? \`Result: \${stressScore}\` : \`Cursor: [\${Math.round(spotlight.x)}, \${Math.round(spotlight.y)}]\`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

export default async function BentoPage({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}) {
  const dict = await getDictionary(locale);
  const stackBadges = [
    "React 19",
    "Live GPU & Device API",
    "Real-Time FPS",
    "Radial Spotlight",
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
          {dict.library.bentoPage.title}
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          {dict.library.bentoPage.description}
        </p>
      </div>

      <ComponentViewer
        code={BENTO_SOURCE_CODE}
        previewLabel={dict.library.viewer.preview}
        codeLabel={dict.library.viewer.code}
        copyLabel={dict.library.viewer.copy}
        copiedLabel={dict.library.viewer.copied}
      >
        <SpotlightBentoGrid />
      </ComponentViewer>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white">CLI Installation</h2>
        <CliCommandBar command="npx shadcn@latest add https://labs.krokbit.cz/r/bento.json" />
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          {dict.library.bentoPage.usageTitle}
        </h2>
        <div className="p-4 bg-[#050505] border border-white/10 rounded-xl font-mono text-xs text-gray-300 leading-relaxed break-words">
          WebGL Debug Renderer API + Navigator Hardware Telemetry + Radial CSS
          Spotlight — zero external libraries.
        </div>
      </div>
    </div>
  );
}
