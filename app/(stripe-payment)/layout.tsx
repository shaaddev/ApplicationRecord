import "../globals.css";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

export default function DonateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Providers>
        <main className="mx-auto max-w-screen-2xl">
          {children}
          <Toaster />
        </main>
      </Providers>
      <Analytics />
    </html>
  );
}
