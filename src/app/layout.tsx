import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMNP-Serenity - Gestion Locative Mobil-Home",
  description: "Application de gestion locative pour propriétaires LMNP de mobil-homes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
