"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarDict {
  gettingStarted: string;
  installation: string;
  cli: string;
  webgl: string;
  wavySphere: string;
  particlesGrid: string;
  uiElements: string;
  buttons: string;
  cards: string;
}

interface LibrarySidebarProps {
  locale: "en" | "cs";
  dict: SidebarDict;
}

export default function LibrarySidebar({ locale, dict }: LibrarySidebarProps) {
  const pathname = usePathname();

  const sections = [
    {
      title: dict.gettingStarted,
      links: [
        { label: dict.installation, href: `/${locale}/library/installation` },
        { label: dict.cli, href: `/${locale}/library/cli` },
      ],
    },
    {
      title: dict.webgl,
      links: [
        { label: dict.wavySphere, href: `/${locale}/library/wavy-sphere` },
        { label: dict.particlesGrid, href: `/${locale}/library/particles` },
      ],
    },
    {
      title: dict.uiElements,
      links: [
        { label: dict.buttons, href: `/${locale}/library/buttons` },
        { label: dict.cards, href: `/${locale}/library/cards` },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-white/10 hidden md:block overflow-y-auto bg-black">
      <nav className="p-6 space-y-8">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h4 className="font-semibold text-white mb-3 text-sm tracking-wide">
              {section.title}
            </h4>
            <ul className="space-y-1 text-sm border-l border-white/10">
              {section.links.map((link, linkIdx) => {
                const isActive = pathname === link.href;

                return (
                  <li key={linkIdx}>
                    <Link
                      href={link.href}
                      className={`block pl-4 py-1.5 -ml-px border-l-2 transition-all duration-200 ${
                        isActive
                          ? "border-emerald-400 text-emerald-400 font-medium drop-shadow-[0_0_8px_rgba(52,211,153,0.35)] bg-emerald-400/[0.03]"
                          : "border-transparent text-gray-400 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}