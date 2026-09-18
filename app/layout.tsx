import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import PwaRegister from "@/components/PwaRegister";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-devanagari",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "KrishiBuddy AI (कृषि बडी) | Digital Agriculture Intelligence Network",
  description:
    "An AI-powered digital agriculture platform for Indian farmers featuring satellite crop health monitoring, TensorFlow.js leaf disease diagnosis, NPK soil advisory, hyperlocal weather, and Agristack state collaboration.",
  keywords: [
    "Agriculture AI",
    "Krishi",
    "Indian Farmers",
    "Crop Disease Scanner",
    "TensorFlow.js",
    "Soil NPK Advisory",
    "Leaflet Farm Map",
    "Agristack IDEA",
    "Earth Engine NDVI",
  ],
  authors: [{ name: "KrishiBuddy AI Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${notoSansDevanagari.variable} font-sans bg-slate-50 dark:bg-[#040d0a] text-slate-900 dark:text-slate-100 min-h-screen antialiased selection:bg-emerald-500 selection:text-white`}
      >
        <PwaRegister />
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
