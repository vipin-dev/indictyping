import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://indictyping.in";

export const metadata: Metadata = {
  title: "IndicTyping · Malayalam InScript Practice",
  description:
    "Practice Malayalam typing with the InScript layout. Live accuracy, speed, on-screen keyboard guidance, and grapheme-aware validation.",
  keywords: [
    "Malayalam typing",
    "InScript keyboard",
    "Indic typing practice",
    "Malayalam keyboard tutor",
    "typing speed",
    "accuracy test",
  ],
  authors: [{ name: "IndicTyping" }],
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "IndicTyping · Malayalam InScript Practice",
    description:
      "Improve your Malayalam typing with live guidance, on-screen InScript keyboard, and accuracy metrics.",
    url: siteUrl,
    siteName: "IndicTyping",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IndicTyping · Malayalam InScript Practice",
    description:
      "Practice Malayalam typing with InScript, live stats, and guided on-screen keyboard highlights.",
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#312e81",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {adClient && (
          <Script
            id="adsense"
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
          />
        )}
        {children}
      </body>
    </html>
  );
}
