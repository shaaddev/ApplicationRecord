import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";


const inter = Inter({ subsets: ["latin"] });

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
          <div className="flex flex-col items-center justify-center mt-20 lg:hidden">
            <p>This web app works better with a larger screens (Laptop, Desktop, etc)</p>
            <p>Please try again later</p> 
          </div>
          <main className="hidden lg:block lg:mx-auto lg:max-w-screen-2xl">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
