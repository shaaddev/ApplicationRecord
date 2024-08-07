import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"

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
        <Providers>
          <Navbar />
          <div className="flex flex-col items-center justify-center mt-20 p-5 text-center gap-12 lg:hidden">
            <p>This web app works better with larger screens (Laptop, Desktop, etc)</p>
            <p>Please try again later</p> 
          </div>
          <main className="hidden lg:block lg:mx-auto lg:max-w-screen-2xl">
            {children}
          </main>
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
