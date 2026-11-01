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

        {/* Скролл работает внутри main независимо от браузера */}
        <main className="flex-1 min-w-0 w-full h-[calc(100dvh-4rem)] overflow-y-auto overflow-x-hidden bg-black bg-grid-pattern pb-28 md:pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}