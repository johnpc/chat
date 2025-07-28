import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";
import PWAInitializer from "@/components/PWAInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: "jpc.chat - AI Assistant",
  description: "A modern chat application powered by AWS Bedrock",
  keywords: ["chat", "AI", "assistant", "AWS", "Bedrock", "conversation"],
  authors: [{ name: "jpc.chat" }],
  creator: "jpc.chat",
  publisher: "jpc.chat",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "jpc.chat",
  },
  openGraph: {
    type: "website",
    siteName: "jpc.chat",
    title: "jpc.chat - AI Assistant",
    description: "A modern chat application powered by AWS Bedrock",
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: "jpc.chat Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "jpc.chat - AI Assistant",
    description: "A modern chat application powered by AWS Bedrock",
    images: ["/icons/icon-512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow zooming for better input accessibility
  userScalable: true, // Enable user scaling for input fields
  viewportFit: "cover", // Better handling of safe areas on iOS
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="jpc.chat" />
        <meta name="application-name" content="jpc.chat" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <PWAInitializer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
