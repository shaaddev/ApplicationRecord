import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Providers } from "./providers";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Application Record",
  description: "SpreadSheet alternative for managing Job Applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="w-full lg:mx-auto lg:max-w-screen-xl flex flex-col justify-between py-12 sm:py-24 bg-background text-primary">
          <Providers theme="dark">
            <main className="lg:mx-auto">
              {children}
              <Toaster position="bottom-right" />
            </main>
          </Providers>
          <Analytics />
          <GoogleAnalytics />
        </div>
      </body>
    </html>
  );
}
