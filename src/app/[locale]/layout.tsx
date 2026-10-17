import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Krokbit Labs",
  description: "B2B UI Components & R&D",
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
