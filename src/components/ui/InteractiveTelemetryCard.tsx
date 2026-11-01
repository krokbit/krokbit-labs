"use client";

import { useState, useEffect, useRef } from "react";

export default function InteractiveTelemetryCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [overclock, setOverclock] = useState(false);
  const [bars, setBars] = useState<number[]>([38, 62, 45, 80, 55, 92, 70, 85, 60, 96, 74, 88]);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  // Живая симуляция нагрузки GPU
  useEffect(() => {
    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((val) => {
          const delta = Math.floor(Math.random() * 26) - 12;
          const min = overclock ? 55 : 20;
          const max = overclock ? 100 : 88;
          return Math.min(max, Math.max(min, val + delta));
        })
      );
    }, overclock ? 180 : 650);

    return () => clearInterval(interval);
  }, [overclock]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handlePointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-6 select-none">
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: tilt.rotateX === 0 ? "transform 0.5s ease-out" : "transform 0.08s linear",
        }}
        className="relative w-full max-w-sm rounded-2xl p-[1px] bg-gradient-to-b from-white/30 via-white/10 to-transparent shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] cursor-pointer touch-pan-y"
      >
        {/* Динамическое фоновое свечение */}
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
          {/* Голографический луч, следующий за пальцем / мышью */}
          <div
            style={{
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.14) 0%, transparent 60%)`,
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
              {overclock ? "144.0 FPS" : "60.0 FPS"}
            </span>
          </div>

          <div className="relative z-10 flex items-end justify-between">
            <div>
              <div className="text-xs text-gray-400 mb-1">Frame Draw Time</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight font-mono">
                  {overclock ? "0.68 ms" : "1.42 ms"}
                </span>
                <span
                  className={`text-xs font-mono ${
                    overclock ? "text-[#00f0ff]" : "text-emerald-400"
                  }`}
                >
                  {overclock ? "-0.74ms" : "-0.18ms"}
                </span>
              </div>
            </div>

            {/* Интерактивная кнопка разгона прямо на карточке */}
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

          {/* Живая матрица телеметрии */}
          <div className="relative z-10 h-20 flex items-end gap-1.5 pt-2 border-b border-white/10 pb-3">
            {bars.map((height, i) => (
              <div
                key={i}
                style={{ height: `${height}%` }}
                className={`flex-1 rounded-t-sm transition-all duration-200 ${
                  overclock
                    ? "bg-gradient-to-t from-blue-600/30 via-[#00f0ff]/80 to-white shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                    : "bg-gradient-to-t from-emerald-500/20 via-emerald-400/60 to-[#00f0ff]"
                }`}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs font-mono text-gray-400">
            <span>VRAM: {overclock ? "112.8 MB" : "48.2 MB"}</span>
            <span className="text-white">{overclock ? "WebGL 2.0 // OC" : "Touch / Tilt Ready"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}