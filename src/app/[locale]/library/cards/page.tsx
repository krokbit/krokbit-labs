import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import ComponentViewer from "@/components/ui/ComponentViewer";
import InteractiveTelemetryCard from "@/components/ui/InteractiveTelemetryCard";

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
// Интерактивная 3D-карточка с расчетом углов наклона (rotateX/rotateY),
// голографическим бликом и живой симуляцией нагрузки GPU.
// Полный исходный код находится в src/components/ui/InteractiveTelemetryCard.tsx`;

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