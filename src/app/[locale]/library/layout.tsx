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
    <div className="min-h-screen bg-black text-white">
      <Navbar locale={locale} />
      
      <div className="flex pt-16 h-screen overflow-hidden">
        <LibrarySidebar locale={locale} dict={dict.library.sidebar} />

        <main className="flex-1 overflow-y-auto bg-black bg-grid-pattern">
          {children}
        </main>
      </div>
    </div>
  );
}