import { getDictionary } from "@/get-dictionary";

export default async function InstallationPage({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}) {
  const dict = await getDictionary(locale);

  return (
    <div className="p-6 sm:p-8 lg:p-12 max-w-4xl mx-auto space-y-10">
      <div>
        <span className="px-2.5 py-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 rounded-md inline-block mb-4">
          Architecture Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          {dict.library.installationPage.title}
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          {dict.library.installationPage.description}
        </p>
      </div>

      <div className="space-y-8">
        <section className="p-6 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            {dict.library.installationPage.step1Title}
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            {dict.library.installationPage.step1Desc}
          </p>
          <div className="p-4 bg-[#050505] border border-emerald-400/30 rounded-lg font-mono text-xs text-emerald-400 break-all leading-relaxed">
            npx shadcn@latest add https://labs.krokbit.cz/r/wavy-sphere.json
          </div>
        </section>

        <section className="p-6 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            {dict.library.installationPage.step2Title}
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            {dict.library.installationPage.step2Desc}
          </p>
          <div className="p-4 bg-[#050505] border border-white/10 rounded-lg font-mono text-xs text-gray-300 break-words leading-relaxed">
            npm install three @types/three @react-three/fiber @react-three/postprocessing framer-motion
          </div>
        </section>

        <section className="p-6 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
          <h2 className="text-lg font-semibold text-white">
            {dict.library.installationPage.step3Title}
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            {dict.library.installationPage.step3Desc}
          </p>
        </section>
      </div>
    </div>
  );
}