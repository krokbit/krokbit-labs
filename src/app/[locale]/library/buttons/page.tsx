import { getDictionary } from "@/get-dictionary";
import ComponentViewer from "@/components/ui/ComponentViewer";

const BUTTONS_SOURCE_CODE = `export default function KrokbitButtons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {/* 1. Terminal Emerald Glow Button */}
      <button className="px-6 py-3 rounded-lg bg-emerald-500/10 border border-emerald-400/40 text-emerald-400 font-mono text-sm hover:bg-emerald-400 hover:text-black hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] transition-all duration-300 active:scale-95">
        Deploy Instance
      </button>

      {/* 2. Cyber Shimmer Button */}
      <button className="relative group px-6 py-3 rounded-lg bg-black border border-white/15 text-white text-sm font-medium overflow-hidden transition-all hover:border-[#00f0ff]/60 active:scale-95">
        <span className="relative z-10 group-hover:text-[#00f0ff] transition-colors">
          Initialize WebGL
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>

      {/* 3. Pure Contrast CTA */}
      <button className="px-6 py-3 rounded-lg bg-white text-black font-semibold text-sm shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:bg-gray-100 transition-all duration-200 active:scale-95">
        Request Access
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

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-white mb-3">
          {dict.library.buttonsPage.title}
        </h1>
        <p className="text-gray-400 text-lg">
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
        <div className="flex flex-wrap items-center justify-center gap-6 p-6">
          {/* 1. Terminal Emerald Glow Button */}
          <button className="px-6 py-3 rounded-lg bg-emerald-500/10 border border-emerald-400/40 text-emerald-400 font-mono text-sm hover:bg-emerald-400 hover:text-black hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] transition-all duration-300 active:scale-95">
            Deploy Instance
          </button>

          {/* 2. Cyber Shimmer Button */}
          <button className="relative group px-6 py-3 rounded-lg bg-black border border-white/15 text-white text-sm font-medium overflow-hidden transition-all hover:border-[#00f0ff]/60 active:scale-95">
            <span className="relative z-10 group-hover:text-[#00f0ff] transition-colors">
              Initialize WebGL
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>

          {/* 3. Pure Contrast CTA */}
          <button className="px-6 py-3 rounded-lg bg-white text-black font-semibold text-sm shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:bg-gray-100 transition-all duration-200 active:scale-95">
            Request Access
          </button>
        </div>
      </ComponentViewer>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          {dict.library.buttonsPage.usageTitle}
        </h2>
        <div className="p-4 bg-[#050505] border border-white/10 rounded-xl font-mono text-xs text-gray-300 overflow-x-auto">
          Pure Tailwind CSS — zero external runtime dependencies.
        </div>
      </div>
    </div>
  );
}