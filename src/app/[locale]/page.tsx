import { getDictionary } from "@/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import HeroCanvas from "@/components/3d/HeroCanvas";

export default async function Home({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}) {
  const dict = await getDictionary(locale);

  return (
    <>
      <Navbar locale={locale} />

      <main className="relative min-h-screen bg-grid-pattern overflow-hidden pt-16">
        <div className="container mx-auto px-6 relative z-10 flex flex-col justify-center min-h-[calc(100vh-4rem)] pointer-events-none">
          <div className="w-full lg:w-1/2 py-12 lg:py-0 pointer-events-auto">
            <div className="flex gap-3 mb-6">
              <span className="px-3 py-1 text-xs border border-white/10 rounded-full bg-white/5 backdrop-blur-md">
                60 FPS
              </span>
              <span className="px-3 py-1 text-xs border border-white/10 rounded-full bg-white/5 backdrop-blur-md">
                Tailwind CSS
              </span>
              <span className="px-3 py-1 text-xs border border-white/10 rounded-full bg-white/5 backdrop-blur-md">
                WebGL 2.0
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
              {dict.home?.title || "High-Performance UI Components"}
            </h1>

            <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed drop-shadow-md">
              Copy-paste premium, highly optimized interactive 3D & WebGL assets
              to elevate your interfaces.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                Explore Library
              </button>
              <div className="flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg text-sm text-gray-300 font-mono w-full sm:w-auto">
                <span>npx @krokbit/labs init</span>
              </div>
            </div>
          </div>
        </div>

        <HeroCanvas />
      </main>
    </>
  );
}
