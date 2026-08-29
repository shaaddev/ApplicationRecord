import { AppHeader } from "@/components/dashboard/app-header";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-80 bg-radial-[ellipse_70%_60%_at_50%_0%] from-brand/25 via-brand/5 to-transparent"
      />
      <AppHeader />
      <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
