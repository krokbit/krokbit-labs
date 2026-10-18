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

      <main className="relative h-screen w-full overflow-hidden bg-grid-pattern pt-16">
        <div className="container mx-auto px-6 relative z-10 flex flex-col justify-center h-[calc(100vh-4rem)] pointer-events-none">
          <div className="w-full lg:w-1/2 py-12 lg:py-0 pointer-events-auto">
            <div className="flex gap-3 mb-6">
              <span className="px-3 py-1 text-xs border border-white/10 rounded-full bg-black/40 backdrop-blur-md">
                60 FPS
              </span>
              <span className="px-3 py-1 text-xs border border-white/10 rounded-full bg-black/40 backdrop-blur-md">
                Tailwind CSS
              </span>
              <span className="px-3 py-1 text-xs border border-white/10 rounded-full bg-black/40 backdrop-blur-md">
                WebGL 2.0
              </span>
            </div>

            <h1
              className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white"
              style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
            >
              {dict.home?.title || "High-Performance UI Components"}
            </h1>

            <p
              className="text-lg text-gray-200 mb-8 max-w-lg leading-relaxed"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
            >
              Copy-paste premium, highly optimized interactive 3D & WebGL assets
              to elevate your interfaces.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Explore Library
              </button>
              <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-sm text-gray-300 font-mono w-full sm:w-auto shadow-lg">
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
