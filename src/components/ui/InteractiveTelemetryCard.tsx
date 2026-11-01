"use client";

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
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: tilt.rotateX === 0 ? "transform 0.5s ease-out" : "transform 0.06s linear",
        }}
        className="relative w-full max-w-sm rounded-2xl p-[1px] bg-gradient-to-b from-white/30 via-white/10 to-transparent shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] cursor-pointer touch-pan-y"
      >
        <div
          className={`pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl transition-colors duration-500 ${
            overclock ? "bg-[#00f0ff]/40" : "bg-emerald-500/25"
          }`}
        />
        <div
          className={`pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-3xl transition-colors duration-500 ${
            overclock ? "bg-blue-600/35" : "bg-[#00f0ff]/20"
          }`}
        />

        <div className="relative rounded-[15px] bg-black/80 backdrop-blur-2xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] space-y-5 overflow-hidden">
          <div
            style={{
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.16) 0%, transparent 60%)`,
            }}
            className="pointer-events-none absolute inset-0 z-20"
          />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                  overclock
                    ? "bg-[#00f0ff] shadow-[0_0_12px_#00f0ff]"
                    : "bg-emerald-400 shadow-[0_0_10px_#34d399]"
                }`}
              />
              <span className="text-xs font-mono uppercase tracking-widest text-gray-300">
                {overclock ? "TURBO_PIPELINE_X" : "SHADER_PIPELINE_04"}
              </span>
            </div>
            <span
              className={`px-2 py-0.5 text-[11px] font-mono rounded border transition-colors duration-300 ${
                overclock
                  ? "text-[#00f0ff] bg-[#00f0ff]/10 border-[#00f0ff]/40"
                  : "text-emerald-400 bg-emerald-500/10 border-emerald-400/25"
              }`}
            >
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
                <span
                  className={`text-xs font-mono ${
                    overclock ? "text-[#00f0ff]" : "text-emerald-400"
                  }`}
                >
                  {liveDeltaMs}ms
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOverclock(!overclock)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider border transition-all active:scale-95 ${
                overclock
                  ? "bg-[#00f0ff] text-black font-semibold border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.5)]"
                  : "bg-white/5 text-gray-300 border-white/15 hover:border-white/35"
              }`}
            >
              {overclock ? "Boost: ON" : "Boost GPU"}
            </button>
          </div>

          <div className="relative z-10 h-20 flex items-end gap-1 pt-2 border-b border-white/10 pb-3">
            {bars.map((height, i) => (
              <div
                key={i}
                style={{ height: `${height}%` }}
                className={`flex-1 rounded-t-sm ${
                  overclock
                    ? "bg-gradient-to-t from-blue-600/30 via-[#00f0ff]/85 to-white shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                    : "bg-gradient-to-t from-emerald-500/20 via-emerald-400/70 to-[#00f0ff]"
                }`}
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
}