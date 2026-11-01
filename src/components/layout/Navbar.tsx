"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const toggleLocale = locale === "en" ? "cs" : "en";

  const getRedirectPath = () => {
    if (!pathname) return `/${toggleLocale}`;
    const segments = pathname.split("/");
    segments[1] = toggleLocale;
    return segments.join("/");
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Components", href: `/${locale}/library` },
    { label: "Templates", href: `/${locale}/templates` },
    { label: "Docs", href: `/${locale}/library/installation` },
  ];

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    const isDocsRoute =
      pathname.startsWith(`/${locale}/library/installation`) ||
      pathname.startsWith(`/${locale}/library/cli`);

    if (href === `/${locale}/library/installation`) {
      return isDocsRoute;
    }
    if (href === `/${locale}/library`) {
      return pathname.startsWith(`/${locale}/library`) && !isDocsRoute;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-xl font-bold tracking-widest text-white relative z-50">
            KROKBIT <span className="font-light text-gray-400">LABS</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm">
            {navLinks.map((link, i) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={i}
                  href={link.href}
                  className={`transition-colors ${
                    active
                      ? "text-emerald-400/75 font-medium drop-shadow-[0_0_6px_rgba(52,211,153,0.2)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link href={getRedirectPath()} className="text-gray-400 hover:text-white transition-colors uppercase">
              {locale} | {toggleLocale}
            </Link>
          </div>

          {/* Mobile Morphing Burger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-[6px]"
          >
            <motion.div
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-6 h-[2px] bg-white origin-center"
            />
            <motion.div
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-6 h-[2px] bg-white"
            />
            <motion.div
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-6 h-[2px] bg-white origin-center"
            />
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(32px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-black/40 flex flex-col justify-center px-8"
          >
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link, i) => {
                const active = isLinkActive(link.href);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-5xl font-light tracking-wide block transition-colors ${
                        active
                          ? "text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.3)]"
                          : "text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: navLinks.length * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="mt-12 pt-8 border-t border-white/10"
              >
                <span className="text-xs text-gray-500 block mb-6 uppercase tracking-widest">Language</span>
                <div className="flex gap-8">
                  <Link
                    href={getRedirectPath()}
                    className={`text-2xl font-medium transition-colors ${
                      locale === "en" ? "text-emerald-400" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    EN
                  </Link>
                  <Link
                    href={getRedirectPath()}
                    className={`text-2xl font-medium transition-colors ${
                      locale === "cs" ? "text-emerald-400" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    CS
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}