import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { firebaseConfig } from "@/utils/firebase";
import SiteFooter from "@/components/SiteFooter";

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
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-3988829621003546';
  const gaId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || firebaseConfig.measurementId;

  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-3988829621003546" />
        {adsenseClient && (
          <Script
            id="adsense-auto"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {gaId && (
          <>
            <Script
              id="gtag-src"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        {gaId && <AnalyticsTracker measurementId={gaId} />}
        <div className="h-screen flex flex-col overflow-hidden">
          <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
