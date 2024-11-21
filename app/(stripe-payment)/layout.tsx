import "../globals.css";

export default function DonateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="mx-auto bg-white text-black w-full">{children}</main>
    </>
  );
}
