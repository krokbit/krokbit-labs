import dynamic from "next/dynamic";
import { getDictionary } from "@/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import CliCommandBar from "@/components/ui/CliCommandBar";
import Link from "next/link";

const HeroCanvas = dynamic(() => import("@/components/3d/HeroCanvas"), {
  ssr: false,
});

export default async function Home({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}) {
  const dict = await getDictionary(locale);

  return (
    <>
      <Navbar locale={locale} />

      <main className="relative h-dvh w-full overflow-y-auto overflow-x-hidden bg-grid-pattern pt-16 select-none">
        <div className="container mx-auto px-6 relative z-10 flex flex-col justify-center min-h-[calc(100dvh-4rem)] pointer-events-none">
          <div className="w-full py-8 sm:py-12 lg:py-0">
            <div className="flex gap-3 mb-6">
              <span className="px-3 py-1 text-xs border border-white/10 rounded-full bg-black/40 backdrop-blur-md">
                {dict.home.badges.fps}
              </span>
              <span className="px-3 py-1 text-xs border border-white/10 rounded-full bg-black/40 backdrop-blur-md">
                {dict.home.badges.tailwind}
              </span>
              <span className="px-3 py-1 text-xs border border-white/10 rounded-full bg-black/40 backdrop-blur-md">
                {dict.home.badges.webgl}
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white max-w-2xl"
              style={{ textShadow: "0 4px 30px rgba(0,0,0,1)" }}
            >
              {dict.home.title}
            </h1>

            <p
              className="text-base sm:text-lg text-gray-200 mb-8 max-w-lg leading-relaxed"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
            >
              {dict.home.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pointer-events-auto">
              <Link
                href={`/${locale}/library`}
                className="shrink-0 whitespace-nowrap px-8 py-4 rounded-xl bg-white/[0.14] hover:bg-white/[0.22] active:scale-[0.98] backdrop-blur-2xl backdrop-saturate-150 border border-white/25 text-white font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_10px_30px_-5px_rgba(0,0,0,0.6)] transition-all text-center select-none"
              >
                {dict.home.exploreButton}
              </Link>

              <CliCommandBar command={dict.home.cliCommand} />
            </div>
          </div>
        </div>

        <HeroCanvas />
      </main>
    </>
  );
}
