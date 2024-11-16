import "../globals.css";
import { Navbar } from "@/components/Navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-screen-2xl">{children}</main>
    </>
  );
}
