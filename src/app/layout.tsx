import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import type { Language } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TrafficTracker from "@/components/TrafficTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrayNow | Anonymous Prayer",
  description: "Share your prayer — request, praise, or thanksgiving — anonymously with believers around the world.",
  manifest: "/manifest.json",
  verification: {
    google: "7Vre7fauvKAW_4h69ZJvRZYmtIoswEAD1VIgkycwuxA",
  },
  icons: {
    apple: "/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PrayNow",
    startupImage: [
      "/splash.png",
    ],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import PWARegistration from "@/components/PWARegistration";
import OfflineIndicator from "@/components/OfflineIndicator";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value ?? "en") as Language;
  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <TrafficTracker />
        <LanguageSwitcher currentLang={lang} />
        <PWARegistration />
        <OfflineIndicator />
      </body>
    </html>
  );
}
