import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Providers } from "./providers";
import { ViewTransitions } from "next-view-transitions";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Land It",
  description: "A calmer way to track job applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans`}>
          <Providers>
            {children}
            <Analytics />
            <GoogleAnalytics />
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}
