import "../globals.css";

export default function DonateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="mx-auto max-w-screen-2xl bg-white text-black">
        {children}
      </main>
    </>
  );
}
