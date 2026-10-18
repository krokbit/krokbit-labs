import Link from "next/link";
import { getDictionary } from "@/get-dictionary";

export default async function ComponentsPage({
  params: { locale },
}: {
  params: { locale: "en" | "cs" };
}) {
  const dict = await getDictionary(locale);

  const categories = [
    {
      title: dict.library.page.components.wavySphere.title,
      desc: dict.library.page.components.wavySphere.desc,
      href: `/${locale}/library/wavy-sphere`,
    },
    {
      title: dict.library.page.components.buttons.title,
      desc: dict.library.page.components.buttons.desc,
      href: `/${locale}/library/buttons`,
    },
    {
      title: dict.library.page.components.cards.title,
      desc: dict.library.page.components.cards.desc,
      href: `/${locale}/library/cards`,
    },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          {dict.library.page.title}
        </h1>
        <p className="text-gray-400 text-lg">{dict.library.page.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <Link
            key={i}
            href={cat.href}
            className="group block p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all hover:border-white/20"
          >
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#00f0ff] transition-colors">
              {cat.title}
            </h3>
            <p className="text-sm text-gray-400">{cat.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
