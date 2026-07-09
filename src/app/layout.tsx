import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import FloatingActions from "@/components/FloatingActions";

import { Inter } from "next/font/google";

const displayFont = localFont({
  src: "../../public/fonts/Boldonse-Regular.ttf",
  variable: "--font-display",
  display: "swap",
  weight: "400",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Official Roger | Designer, Animator & Motion Specialist in Tanzania",
  description:
    "Official Roger — Graphic designer, animator and motion specialist in Tanzania. Logos, video, 2D/3D animation, CGI & UX/UI. View portfolio & hire me.",
  keywords: [
    "graphic designer Tanzania",
    "2D animator Tanzania",
    "3D animation Africa",
    "motion graphics designer",
    "video editor Tanzania",
    "UX UI designer Africa",
  ],
  icons: {
    icon: "/images/logo.jpeg",
    apple: "/images/logo.jpeg",
  },
  openGraph: {
    title: "Official Roger | Designer, Animator & Motion",
    description:
      "Bringing Ideas to Life Through Design, Animation & Motion.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-body antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}
