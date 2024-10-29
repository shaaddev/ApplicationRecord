import ShineBorder from "@/components/ui/shine-border";
import Link from "next/link";

export function Donate() {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg text-center min-h-full">
      <div className="flex min-h-0 flex-col gap-6 justify-center my-5">
        <h2 className="text-lime-400 uppercase text-xl font-bold">
          Support the project
        </h2>
        <h1 className="text-6xl tracking-tight font-bold">
          We Value Your Support
        </h1>
      </div>
      <div className="my-12 h-72">
        <Link href="/donate-with-elements">
          <ShineBorder
            className="flex flex-col items-center justify-center p-5 gap-12 whitespace-nowrap"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            <h2 className="text-3xl font-bold">Donate Now</h2>
            <p className="text-lg text-muted-foreground">
              Click here to donate and support us through our journey
            </p>
          </ShineBorder>
        </Link>
      </div>
    </div>
  );
}
