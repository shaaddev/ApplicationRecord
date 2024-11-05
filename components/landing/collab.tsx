import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export function Collab() {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg text-center max-w-6xl mx-auto min-h-screen">
      <div className="flex min-h-0 flex-col gap-6 justify-center my-5">
        <h2 className="text-lime-400 uppercase text-xl font-bold">
          Developers, Join us
        </h2>
        <h1 className="text-4xl sm:text-6xl tracking-tight font-bold">
          Contribute to Landit and help build the future with us
        </h1>
      </div>
      <Button className="rounded-full px-4 py-6 bg-lime-500 text-primary-foreground hover:bg-lime-500 font-bold">
        <Link
          href="https://github.com/shaaddev/ApplicationRecord"
          className="flex flex-row items-center gap-2"
          target="_blank"
          rel="noreferrer"
        >
          Contribute on Github
          <div className="rounded-full bg-lime-600 p-2">
            <MoveRight className="inline" />
          </div>
        </Link>
      </Button>
    </div>
  );
}
