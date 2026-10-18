import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function ComponentsLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar locale={locale} />

      <div className="flex pt-16 h-screen overflow-hidden">
        <aside className="w-64 border-r border-white/10 hidden md:block overflow-y-auto">
          <nav className="p-6 space-y-8">
            <div>
              <h4 className="font-semibold text-white mb-3">Getting Started</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    href={`/${locale}/library/installation`}
                    className="hover:text-white transition-colors"
                  >
                    Installation
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/library/cli`}
                    className="hover:text-white transition-colors"
                  >
                    CLI
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">WebGL & 3D</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    href={`/${locale}/library/wavy-sphere`}
                    className="hover:text-white transition-colors"
                  >
                    Wavy Sphere
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/library/particles`}
                    className="hover:text-white transition-colors"
                  >
                    Particles Grid
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">UI Elements</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    href={`/${locale}/components/buttons`}
                    className="hover:text-white transition-colors"
                  >
                    Buttons
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/components/cards`}
                    className="hover:text-white transition-colors"
                  >
                    Cards
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto bg-black bg-grid-pattern">
          {children}
        </main>
      </div>
    </div>
  );
}
