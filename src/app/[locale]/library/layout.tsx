import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
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
    <div className="min-h-dvh bg-black text-white flex flex-col">
      <Navbar locale={locale} />
      
      <div className="flex pt-16 flex-1 md:h-screen md:overflow-hidden">
        <aside className="w-64 border-r border-white/10 hidden md:block overflow-y-auto shrink-0">
          <nav className="p-6 space-y-8">
            <div>
              <h4 className="font-semibold text-white mb-3">{dict.library.sidebar.gettingStarted}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href={`/${locale}/library/installation`} className="hover:text-white transition-colors">{dict.library.sidebar.installation}</Link></li>
                <li><Link href={`/${locale}/library/cli`} className="hover:text-white transition-colors">{dict.library.sidebar.cli}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">{dict.library.sidebar.webgl}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href={`/${locale}/library/wavy-sphere`} className="hover:text-white transition-colors">{dict.library.sidebar.wavySphere}</Link></li>
                <li><Link href={`/${locale}/library/particles`} className="hover:text-white transition-colors">{dict.library.sidebar.particlesGrid}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">{dict.library.sidebar.uiElements}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href={`/${locale}/library/buttons`} className="hover:text-white transition-colors">{dict.library.sidebar.buttons}</Link></li>
                <li><Link href={`/${locale}/library/cards`} className="hover:text-white transition-colors">{dict.library.sidebar.cards}</Link></li>
              </ul>
            </div>
          </nav>
        </aside>

        <main className="flex-1 md:overflow-y-auto bg-black bg-grid-pattern pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}