import { getDictionary } from "@/get-dictionary";

export default async function CliPage({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}) {
  const dict = await getDictionary(locale);

  return (
    <div className="p-6 sm:p-8 lg:p-12 max-w-4xl mx-auto space-y-10">
      <div>
        <span className="px-2.5 py-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 rounded-md inline-block mb-4">
          {dict.library.cliPage.statusBadge}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          {dict.library.cliPage.title}
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          {dict.library.cliPage.description}
        </p>
      </div>

      <div className="p-6 rounded-xl bg-[#050505] border border-white/10 space-y-4 font-mono text-xs">
        <div className="text-gray-500"># Initialize Krokbit Labs configuration</div>
        <div className="text-white">$ npx @krokbit/labs init</div>
        <div className="text-gray-500 pt-2"># Add specific 3D shader asset</div>
        <div className="text-emerald-400">$ npx @krokbit/labs add wavy-sphere</div>
      </div>

      <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
        <h2 className="text-lg font-semibold text-white">
          {dict.library.cliPage.roadmapTitle}
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          {dict.library.cliPage.roadmapDesc}
        </p>
      </div>
    </div>
  );
}