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
    <div className="min-h-dvh bg-black text-white flex flex-col">
      <Navbar locale={locale} />
      
      <div className="flex pt-16 flex-1 md:h-[calc(100dvh-4rem)] md:overflow-hidden w-full max-w-[100vw]">
        <LibrarySidebar locale={locale} dict={dict.library.sidebar} />

        <main className="flex-1 min-w-0 w-full md:overflow-y-auto bg-black bg-grid-pattern pb-28 md:pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}