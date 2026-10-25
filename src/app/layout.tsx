import type { Metadata } from "next";
import { DM_Sans, EB_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Lloyd Alba - Software Engineer",
  description:
    "Software engineer building products and systems — AI, iOS, and tooling that makes engineers faster.",
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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${dmSans.variable} ${ebGaramond.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
