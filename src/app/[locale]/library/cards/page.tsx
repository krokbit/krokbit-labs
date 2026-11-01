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
      ? "Refrakční Bento Karta — React & Tailwind CSS"
      : "Refractive Bento Card — React & Tailwind CSS",
    description: isCs
      ? "Vícevrstvá skleněná telemetrická karta pro moderní B2B rozhraní."
      : "Multi-layered glassmorphism telemetry card component for React and Next.js.",
  };
}

const CARD_SOURCE_CODE = `export default function TelemetryGlassCard() {
  const bars = [38, 62, 45, 80, 55, 92, 70, 85, 60, 96, 74, 88];

  return (
    <div className="relative w-full max-w-sm rounded-2xl p-[1px] bg-gradient-to-b from-white/25 via-white/5 to-transparent shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
      {/* Ambient refraction light behind the glass */}
      <div className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#00f0ff]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative rounded-[15px] bg-black/75 backdrop-blur-2xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
              SHADER_PIPELINE_04
            </span>
          </div>
          <span className="px-2 py-0.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-400/25 rounded">
            60.0 FPS
          </span>
        </div>

        <div>
          <div className="text-xs text-gray-400 mb-1">Frame Draw Time</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">1.42 ms</span>
            <span className="text-xs font-mono text-emerald-400">-0.18ms</span>
          </div>
        </div>

        {/* Telemetry Bar Matrix */}
        <div className="h-16 flex items-end gap-1.5 pt-2 border-b border-white/10 pb-3">
          {bars.map((height, i) => (
            <div
              key={i}
              style={{ height: \`\${height}%\` }}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-500/20 via-emerald-400/60 to-[#00f0ff] opacity-85 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-gray-400">
          <span>VRAM: 48.2 MB</span>
          <span className="text-white">WebGL 2.0</span>
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
  const stackBadges = ["React 19", "Tailwind CSS", "Glassmorphism", "Bento UI"];
  const bars = [38, 62, 45, 80, 55, 92, 70, 85, 60, 96, 74, 88];

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
        <div className="relative w-full h-full flex items-center justify-center p-6">
          <div className="relative w-full max-w-sm rounded-2xl p-[1px] bg-gradient-to-b from-white/25 via-white/5 to-transparent shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
            <div className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#00f0ff]/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-emerald-500/20 blur-3xl" />

            <div className="relative rounded-[15px] bg-black/75 backdrop-blur-2xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
                    SHADER_PIPELINE_04
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-400/25 rounded">
                  60.0 FPS
                </span>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-1">Frame Draw Time</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white tracking-tight">1.42 ms</span>
                  <span className="text-xs font-mono text-emerald-400">-0.18ms</span>
                </div>
              </div>

              <div className="h-16 flex items-end gap-1.5 pt-2 border-b border-white/10 pb-3">
                {bars.map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-500/20 via-emerald-400/60 to-[#00f0ff] opacity-85 hover:opacity-100 transition-opacity"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>VRAM: 48.2 MB</span>
                <span className="text-white">WebGL 2.0</span>
              </div>
            </div>
          </div>
        </div>
      </ComponentViewer>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          {dict.library.cardsPage.usageTitle}
        </h2>
        <div className="p-4 bg-[#050505] border border-white/10 rounded-xl font-mono text-xs text-gray-300 leading-relaxed break-words">
          Pure Tailwind CSS — zero external runtime dependencies.
        </div>
      </div>
    </div>
  );
}