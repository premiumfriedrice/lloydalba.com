import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Side from "@/components/Side";
import Credit from "@/components/Credit";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Lloyd Alba",
  description:
    "Lloyd Alba — software engineer. AI agents, iOS, and tooling that makes engineers faster.",
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
      <body className={`${archivo.variable} antialiased`}>
        <div className="shell">
          <Side />
          {children}
          <Credit />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
