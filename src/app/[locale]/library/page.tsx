import Link from "next/link";

export default function ComponentsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const categories = [
    {
      title: "Wavy Sphere",
      desc: "Interactive WebGL sphere with Bloom post-processing.",
      href: `/${locale}/components/wavy-sphere`,
    },
    {
      title: "Buttons",
      desc: "Highly optimized interactive buttons.",
      href: `/${locale}/components/buttons`,
    },
    {
      title: "Cards",
      desc: "Glassmorphism and 3D card layouts.",
      href: `/${locale}/components/cards`,
    },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Components Library
        </h1>
        <p className="text-gray-400 text-lg">
          Browse our collection of premium UI and WebGL components. Ready to
          copy-paste into your Next.js project.
        </p>
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
