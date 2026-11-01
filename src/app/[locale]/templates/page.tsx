import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { getDictionary } from "@/get-dictionary";

export default async function TemplatesPage({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}) {
  const dict = await getDictionary(locale);

  return (
    <div className="min-h-dvh bg-black text-white flex flex-col">
      <Navbar locale={locale} />

      <main className="flex-1 pt-24 pb-20 px-6 bg-grid-pattern">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <span className="px-3 py-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 rounded-full inline-block mb-4">
              {dict.templatesPage.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {dict.templatesPage.title}
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              {dict.templatesPage.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 flex flex-col justify-between hover:border-white/25 transition-all">
              <div>
                <div className="h-44 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 via-blue-900/20 to-black border border-white/10 mb-6 flex items-center justify-center relative overflow-hidden">
                  <div className="w-24 h-24 rounded-full border border-[#00f0ff]/50 shadow-[0_0_30px_rgba(0,240,255,0.4)] animate-pulse" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-mono uppercase bg-black/80 text-[#00f0ff] border border-[#00f0ff]/30 rounded">
                    {dict.templatesPage.items.nebula.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {dict.templatesPage.items.nebula.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {dict.templatesPage.items.nebula.desc}
                </p>
              </div>

              <Link
                href={`/${locale}/library`}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-medium text-sm text-center transition-colors"
              >
                {dict.templatesPage.previewBtn}
              </Link>
            </div>

            <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 flex flex-col justify-between hover:border-white/25 transition-all">
              <div>
                <div className="h-44 rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-950/30 to-black border border-white/10 mb-6 flex items-center justify-center relative overflow-hidden">
                  <div className="grid grid-cols-4 gap-2 opacity-70">
                    {Array.from({ length: 12 }).map((_, idx) => (
                      <div key={idx} className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    ))}
                  </div>
                  <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-mono uppercase bg-black/80 text-emerald-400 border border-emerald-400/30 rounded">
                    {dict.templatesPage.items.synthetix.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {dict.templatesPage.items.synthetix.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {dict.templatesPage.items.synthetix.desc}
                </p>
              </div>

              <Link
                href={`/${locale}/library/particles`}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-medium text-sm text-center transition-colors"
              >
                {dict.templatesPage.previewBtn}
              </Link>
            </div>

            <div className="relative rounded-2xl border border-emerald-400/30 bg-gradient-to-b from-emerald-500/[0.07] to-black p-6 flex flex-col justify-between shadow-[0_0_40px_rgba(52,211,153,0.1)]">
              <div>
                <div className="h-44 rounded-xl bg-black/80 border border-emerald-400/20 mb-6 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-1">
                    KROKBIT STUDIO
                  </span>
                  <span className="text-2xl font-bold text-white tracking-tight">
                    Turnkey WebGL & B2B
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-mono uppercase bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 rounded">
                    {dict.templatesPage.items.enterprise.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {dict.templatesPage.items.enterprise.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {dict.templatesPage.items.enterprise.desc}
                </p>
              </div>

              <a
                href="https://krokbit.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-sm text-center transition-colors shadow-[0_0_20px_rgba(52,211,153,0.35)]"
              >
                {dict.templatesPage.customBtn}
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}