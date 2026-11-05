"use client";

import { useState, useRef } from "react";

interface ClusterNode {
  id: string;
  region: string;
  ping: string;
  throughput: string;
  load: number;
}

const CLUSTERS: ClusterNode[] = [
  {
    id: "PRG-01",
    region: "EU Central",
    ping: "4.2 ms",
    throughput: "14.8 GB/s",
    load: 34,
  },
  {
    id: "FRA-02",
    region: "EU West",
    ping: "7.8 ms",
    throughput: "22.1 GB/s",
    load: 62,
  },
  {
    id: "NYC-04",
    region: "US East",
    ping: "68.4 ms",
    throughput: "19.4 GB/s",
    load: 48,
  },
];

export default function SpotlightBentoGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCluster, setActiveCluster] = useState<number>(0);
  const [spotlight, setSpotlight] = useState({ x: 260, y: 160, opacity: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handlePointerLeave = () => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  const current = CLUSTERS[activeCluster];

  return (
    <div className="w-full h-full flex items-center justify-center p-3 sm:p-6 select-none">
      <div
        ref={gridRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative w-full max-w-2xl grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4 rounded-2xl p-3 sm:p-4 bg-white/[0.02] border border-white/10 overflow-hidden touch-pan-y"
      >
        {/* Dynamic Radial Spotlight Overlay */}
        <div
          style={{
            opacity: spotlight.opacity,
            background: `radial-gradient(380px circle at ${spotlight.x}px ${spotlight.y}px, rgba(0, 240, 255, 0.14), rgba(16, 185, 129, 0.05) 45%, transparent 80%)`,
          }}
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
        />

        {/* Bento Card 1: Edge Routing Control (3 cols) */}
        <div className="relative z-10 sm:col-span-3 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 hover:border-white/25 transition-colors p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-300">
                EDGE_ROUTER_MESH
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-2 py-0.5 rounded">
              {current.ping}
            </span>
          </div>

          <div>
            <div className="text-xs text-gray-400 mb-1">
              Active Cluster Node
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
              {current.id}{" "}
              <span className="text-xs font-normal text-gray-400">
                / {current.region}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {CLUSTERS.map((node, idx) => {
              const isSelected = idx === activeCluster;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveCluster(idx)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-mono border transition-[transform,border-color,background-color,color] duration-150 active:scale-95 outline-none focus:outline-none ${
                    isSelected
                      ? "bg-emerald-400/15 border-emerald-400/50 text-emerald-400 font-semibold shadow-[0_0_15px_rgba(52,211,153,0.2)]"
                      : "bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:border-white/25"
                  }`}
                >
                  {node.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento Card 2: Shader & Bandwidth Telemetry (2 cols) */}
        <div className="relative z-10 sm:col-span-2 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 hover:border-white/25 transition-colors p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-1">
              THROUGHPUT
            </span>
            <div className="text-2xl font-bold font-mono text-white">
              {current.throughput}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-gray-400">NODE_LOAD</span>
              <span className="text-emerald-400">{current.load}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                style={{ width: `${current.load}%` }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-[#00f0ff] transition-[width] duration-300"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>TLS 1.3 / QUIC</span>
            <span className="text-emerald-400">99.99% SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
