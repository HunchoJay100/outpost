import type { Metadata } from "next";
import { Rajdhani, Geist_Mono, Michroma } from "next/font/google";
import "./globals.css";

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: ["400"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OUTPOST — Content Command Center",
  description: "Content management and creation system for multi-brand operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${michroma.variable} ${rajdhani.variable} ${geistMono.variable} antialiased`}
      >
        <div className="atmosphere" />
        <div className="grid-world" />
        <div className="grid-underwater" />
        <div className="water-shimmer" />
        <div className="reflective-floor" />
        <div className="water-horizon" />
        <div className="light-beam" />
        <div className="light-beam-2" />
        <div className="light-beam-3" />
        <div className="h-scan" />
        <div className="neon-bar-left" />
        <div className="neon-bar-left-2" />
        <div className="neon-bar-right" />
        <div className="neon-bar-right-2" />

        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
