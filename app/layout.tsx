import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Luqman Azri | Portfolio",
  description: "Portfolio of Luqman Azri, a Computer Science Graduate. Explore my projects, skills, and professional experience.",
  keywords: [
    "Luqman Azri",
    "Frontend Developer",
    "Full Stack Developer",
    "Web Developer",
    "Portfolio",
    "React",
    "Next.js"
  ],
  authors: [{ name: "Luqman Azri" }],
  creator: "Luqman Azri",
  openGraph: {
    title: "Luqman Azri | Software Engineer Portfolio",
    description: "Portfolio of Luqman Azri, a Software Engineer and Computer Science Graduate. Explore my projects, skills, and professional experience.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Luqman Azri Portfolio',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Luqman Azri | Software Engineer Portfolio",
    description: "Software Engineer & Computer Science Graduate",
    images: ['/og-image.png'],
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE", // Replace with your actual Google Search Console code
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-transparent text-slate-800 selection:bg-cyan-200 selection:text-slate-900">{children}</body>
    </html>
  );
}
