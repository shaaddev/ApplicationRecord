import "../globals.css";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "@/components/Navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main className="mx-auto max-w-screen-2xl">
            {children}
            <Toaster />
          </main>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
