import Link from "next/link";

export default function Navbar({ locale }: { locale: string }) {
  const toggleLocale = locale === "en" ? "cs" : "en";

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="text-xl font-bold tracking-widest text-white"
        >
          KROKBIT <span className="font-light text-gray-400">LABS</span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm text-gray-400">
          {/* Указываем реальный путь до папки library */}
          <Link
            href={`/${locale}/library`}
            className="hover:text-white transition-colors"
          >
            Components
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Templates
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            href={`/${toggleLocale}`}
            className="text-gray-400 hover:text-white transition-colors uppercase"
          >
            {locale} | {toggleLocale}
          </Link>
        </div>
      </div>
    </header>
  );
}
