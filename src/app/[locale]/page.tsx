import { getDictionary } from "@/get-dictionary";

export default async function Home({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}) {
  const dict = await getDictionary(locale);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">{dict.home.title}</h1>
    </main>
  );
}
