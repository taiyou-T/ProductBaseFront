import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SiteGate } from "@/components/site/SiteGate";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { Footer } from "@/components/layout/Footer";
import { SITE_NAME } from "@/lib/constants";
import { DEFAULT_SITE_DESCRIPTION, SITE_KEYWORDS } from "@/lib/seo";
import { getSiteUrl } from "@/lib/api";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`}
        </Script>
        <ThemeProvider>
          <AuthProvider>
            <SiteGate>
              <SiteNavigation />
              <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 pb-24 md:pb-8">{children}</main>
              <Footer />
            </SiteGate>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
