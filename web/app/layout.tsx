import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TigerSwap — UofM Student Marketplace",
  description:
    "The University of Memphis student marketplace. Give away, sell, or trade items with fellow Tigers. Verified @memphis.edu students only.",
  keywords: ["University of Memphis", "marketplace", "student", "buy", "sell", "trade", "free"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Navbar />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
