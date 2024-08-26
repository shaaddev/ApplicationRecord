import "../globals.css";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"
import { Navbar } from "@/components/Navbar";


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <div className="flex flex-col items-center justify-center mt-20 p-5 text-center gap-12 lg:hidden">
            <p>This web app works better with larger screens (Laptop, Desktop, etc)</p>
            <p>Please try again later</p> 
          </div>
          <main className="hidden lg:block lg:mx-auto">
            {children}
          </main>
          <Toaster />
        </Providers>
        <Analytics />
    </html>
  );
}
