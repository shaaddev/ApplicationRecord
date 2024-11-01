import { Landing } from "@/components/landing/landing";

export default function Page() {
  return (
    <div className="w-full lg:mx-auto lg:max-w-screen-xl flex flex-col justify-between py-12 sm:py-24 bg-background text-primary">
      <Landing />
    </div>
  );
}
