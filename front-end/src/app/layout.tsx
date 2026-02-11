import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://goldservice-egypt.com"),
  title: {
    default: "جولد سيرفيس | أسعار الذهب والعملات اليوم في مصر",
    template: "%s | جولد سيرفيس"
  },
  description: "اخر تحديثات وأسعار الذهب والعملات في مصر والعالم. بث مباشر لأسعار عيار 21، 24، 18، وأسعار السبائك والدولار في السوق الموازي والبنك.",
  keywords: ["سعر الذهب اليوم", "سعر الذهب عيار 21", "سعر الذهب في مصر", "سعر الفضة", "سعر الدولار اليوم", "حاسبة الذهب", "السوق السوداء"],
  authors: [{ name: "جولد سيرفيس" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "جولد سيرفيس | أسعار الذهب والعملات مباشر",
    description: "بث مباشر لأسعار الذهب والعملات لحظة بلحظة مع تحليلات احترافية.",
    url: "https://goldservice-egypt.com",
    siteName: "جولد سيرفيس",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "جولد سيرفيس | أسعار الذهب والعملات",
    description: "تعرف على أسعار الذهب والعملات في مصر والوطن العربي لحظة بلحظة.",
  },
  verification: {
    google: "google-site-verification-id", // User should replace this
  }
};

import { LanguageProvider } from "@/components/language-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${cairo.variable} font-cairo antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
