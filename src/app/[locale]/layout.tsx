import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://labs.krokbit.cz"),
  title: {
    default: "Krokbit Labs | High-Performance UI Components",
    template: "%s | Krokbit Labs",
  },
  description:
    "Copy-paste premium, highly optimized interactive 3D & WebGL assets for Next.js to elevate your B2B interfaces.",
  keywords: [
    "WebGL",
    "Three.js",
    "React 19",
    "Next.js 14",
    "UI Components",
    "Tailwind CSS",
    "R&D",
    "Frontend",
  ],
  openGraph: {
    title: "Krokbit Labs | UI & WebGL Library",
    description: "Premium WebGL & UI Components for Next.js.",
    url: "https://labs.krokbit.cz",
    siteName: "Krokbit Labs",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Krokbit Labs Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krokbit Labs",
    description: "Premium WebGL & UI Components",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={locale}>
      <body className="antialiased bg-black text-white">{children}</body>
    </html>
  );
}
