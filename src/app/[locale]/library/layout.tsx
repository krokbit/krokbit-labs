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

  return (
    <div className="h-dvh bg-black text-white flex flex-col overflow-hidden">
      <Navbar locale={locale} />

      <div className="flex pt-16 flex-1 h-full overflow-hidden w-full max-w-[100vw]">
        <LibrarySidebar locale={locale} dict={dict.library.sidebar} />

        <main className="flex-1 min-w-0 w-full h-[calc(100dvh-4rem)] overflow-y-auto overflow-x-hidden bg-black bg-grid-pattern pb-28 md:pb-16">
          {children}

          <div className="px-6 sm:px-8 lg:px-12 max-w-5xl mx-auto mt-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/[0.06] via-white/[0.02] to-[#00f0ff]/[0.06] backdrop-blur-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  {dict.library.ctaBanner.badge}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {dict.library.ctaBanner.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {dict.library.ctaBanner.description}
                </p>
              </div>

              <a
                href="https://krokbit.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-black font-semibold text-sm transition-[transform,background-color] duration-150 shadow-[0_0_25px_rgba(52,211,153,0.3)] outline-none focus:outline-none"
              >
                {dict.library.ctaBanner.button}
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
