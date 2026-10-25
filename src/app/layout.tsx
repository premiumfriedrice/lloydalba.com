import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  title: "Lloyd Alba - Software Engineer",
  description:
    "Software engineer building products and systems — AI agents, iOS, and tooling that makes engineers faster.",
  icons: {
    icon: "/fighter.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ebGaramond.variable} antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
