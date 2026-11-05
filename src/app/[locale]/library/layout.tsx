import Navbar from "@/components/layout/Navbar";
import LibrarySidebar from "@/components/layout/LibrarySidebar";
import { getDictionary } from "@/get-dictionary";

export default async function ComponentsLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: "en" | "cs" };
}) {
  const dict = await getDictionary(locale);
  const isCs = locale === "cs";

  return (
    <div className="h-dvh bg-black text-white flex flex-col overflow-hidden">
      <Navbar locale={locale} />

      <div className="flex pt-16 flex-1 h-full overflow-hidden w-full max-w-[100vw]">
        <LibrarySidebar locale={locale} dict={dict.library.sidebar} />

        <main className="flex-1 min-w-0 w-full h-[calc(100dvh-4rem)] overflow-y-auto overflow-x-hidden bg-black bg-grid-pattern pb-28 md:pb-16">
          {children}

          {/* B2B Conversion Banner: Engineered by Krokbit Studio */}
          <div className="px-6 sm:px-8 lg:px-12 max-w-5xl mx-auto mt-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/[0.06] via-white/[0.02] to-[#00f0ff]/[0.06] backdrop-blur-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  Engineered by Krokbit Studio
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {isCs
                    ? "Potřebujete vlastní 3D/WebGL nebo B2B webovou aplikaci na klíč?"
                    : "Need a custom 3D/WebGL experience or high-performance B2B web app?"}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {isCs
                    ? "Navrhujeme a vyvíjíme produkční Next.js architektury, interaktivní 3D shadery a e-commerce systémy s důrazem na rychlost a konverze."
                    : "We architect and ship production Next.js applications, custom GLSL shaders, and high-conversion B2B interfaces."}
                </p>
              </div>

              <a
                href="https://krokbit.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-black font-semibold text-sm transition-[transform,background-color] duration-150 shadow-[0_0_25px_rgba(52,211,153,0.3)] outline-none focus:outline-none"
              >
                {isCs ? "Poptat vývoj →" : "Book a Project →"}
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
