import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BottomCat } from "@/components/BottomCat";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Lloyd Alba",
  description:
    "Lloyd Alba — software engineer. AI agents, iOS apps, and tools that make engineers faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${ebGaramond.variable}`}>
      <body className="antialiased">
        {children}
        <BottomCat />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
