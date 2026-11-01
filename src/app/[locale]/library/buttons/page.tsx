import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import ComponentViewer from "@/components/ui/ComponentViewer";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}): Promise<Metadata> {
  const isCs = locale === "cs";
  return {
    title: isCs
      ? "Glassmorphism & Conic Tlačítka — React & Tailwind CSS"
      : "Glassmorphism & Conic Buttons — React & Tailwind CSS",
    description: isCs
      ? "Prémiová skleněná a hardwarová tlačítka pro React a Next.js."
      : "Copy-paste refractive glassmorphism and animated conic-border buttons for React, Next.js, and Tailwind CSS.",
  };
}

const BUTTONS_SOURCE_CODE = `export default function KrokbitButtons() {
  return (
    <div className="relative flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 p-8 overflow-hidden">
      {/* Фоновые световые пятна для преломления через матовое стекло */}
      <div className="pointer-events-none absolute w-56 h-56 rounded-full bg-emerald-500/20 blur-3xl -top-10 -left-10" />
      <div className="pointer-events-none absolute w-56 h-56 rounded-full bg-[#00f0ff]/20 blur-3xl -bottom-10 -right-10" />

      {/* 1. Autonomous Conic-Border Beam Button */}
      <button className="relative inline-flex h-12 overflow-hidden rounded-xl p-[1px] focus:outline-none active:scale-95 transition-transform duration-200 shadow-[0_0_30px_rgba(52,211,153,0.18)]">
        <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#10b981_50%,#00f0ff_75%,#000000_100%)]" />
        <span className="inline-flex h-full w-full items-center justify-center gap-3 rounded-[11px] bg-black/85 px-6 py-2 text-xs font-mono uppercase tracking-wider text-white backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          Deploy Node
        </span>
      </button>

      {/* 2. True Multi-Layer Glassmorphism Button */}
      <button className="relative px-7 h-12 rounded-xl bg-white/[0.07] backdrop-blur-2xl border border-white/20 text-white text-sm font-medium tracking-wide shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-10px_20px_rgba(0,240,255,0.12),0_12px_30px_-6px_rgba(0,0,0,0.7)] hover:bg-white/[0.12] hover:border-white/35 active:scale-95 transition-all duration-200 flex items-center gap-2.5">
        <span className="text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">✦</span>
        <span>Initialize WebGL</span>
      </button>

      {/* 3. Tactile Hardware Command Trigger */}
      <button className="group h-12 px-5 rounded-xl bg-gradient-to-b from-zinc-800/90 to-zinc-950 border border-white/15 text-gray-200 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_20px_rgba(0,0,0,0.8)] hover:text-white hover:border-emerald-400/40 active:scale-95 transition-all duration-150 flex items-center gap-3">
        <span>Execute CLI</span>
        <kbd className="px-2 py-0.5 text-[11px] font-mono text-emerald-400 bg-black/80 border border-emerald-400/30 rounded-md shadow-inner">
          ⌘K
        </kbd>
      </button>
    </div>
  );
}`;

export default async function ButtonsPage({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}) {
  const dict = await getDictionary(locale);
  const stackBadges = ["React 19", "Next.js", "Tailwind CSS", "Zero-JS Glass", "Touch Ready"];

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
          {dict.library.buttonsPage.title}
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          {dict.library.buttonsPage.description}
        </p>
      </div>

      <ComponentViewer
        code={BUTTONS_SOURCE_CODE}
        previewLabel={dict.library.viewer.preview}
        codeLabel={dict.library.viewer.code}
        copyLabel={dict.library.viewer.copy}
        copiedLabel={dict.library.viewer.copied}
      >
        <div className="relative w-full h-full flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 p-8 overflow-hidden">
          {/* Ambient light orbs behind the buttons so frosted glass actually refracts color */}
          <div className="pointer-events-none absolute w-60 h-60 rounded-full bg-emerald-500/20 blur-3xl top-1/4 left-1/4" />
          <div className="pointer-events-none absolute w-60 h-60 rounded-full bg-[#00f0ff]/20 blur-3xl bottom-1/4 right-1/4" />

          {/* 1. Autonomous Conic-Border Beam Button */}
          <button className="relative inline-flex h-12 overflow-hidden rounded-xl p-[1px] focus:outline-none active:scale-95 transition-transform duration-200 shadow-[0_0_30px_rgba(52,211,153,0.18)]">
            <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#10b981_50%,#00f0ff_75%,#000000_100%)]" />
            <span className="inline-flex h-full w-full items-center justify-center gap-3 rounded-[11px] bg-black/85 px-6 py-2 text-xs font-mono uppercase tracking-wider text-white backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Deploy Node
            </span>
          </button>

          {/* 2. True Multi-Layer Glassmorphism Button */}
          <button className="relative px-7 h-12 rounded-xl bg-white/[0.07] backdrop-blur-2xl border border-white/20 text-white text-sm font-medium tracking-wide shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-10px_20px_rgba(0,240,255,0.12),0_12px_30px_-6px_rgba(0,0,0,0.7)] hover:bg-white/[0.12] hover:border-white/35 active:scale-95 transition-all duration-200 flex items-center gap-2.5">
            <span className="text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">✦</span>
            <span>Initialize WebGL</span>
          </button>

          {/* 3. Tactile Hardware Command Trigger */}
          <button className="group h-12 px-5 rounded-xl bg-gradient-to-b from-zinc-800/90 to-zinc-950 border border-white/15 text-gray-200 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_20px_rgba(0,0,0,0.8)] hover:text-white hover:border-emerald-400/40 active:scale-95 transition-all duration-150 flex items-center gap-3">
            <span>Execute CLI</span>
            <kbd className="px-2 py-0.5 text-[11px] font-mono text-emerald-400 bg-black/80 border border-emerald-400/30 rounded-md shadow-inner">
              ⌘K
            </kbd>
          </button>
        </div>
      </ComponentViewer>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          {dict.library.buttonsPage.usageTitle}
        </h2>
        <div className="p-4 bg-[#050505] border border-white/10 rounded-xl font-mono text-xs text-gray-300 leading-relaxed break-words">
          Tailwind CSS v3.4 / v4 — pure utility classes with hardware-accelerated backdrop-blur.
        </div>
      </div>
    </div>
  );
}