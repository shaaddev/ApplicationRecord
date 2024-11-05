import Link from "next/link";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SparklesText from "@/components/ui/sparkles-text";
import BlurFade from "@/components/ui/blur-fade";

export function HomePage({ delay }: { delay?: number }) {
  return (
    <section id="home">
      <BlurFade delay={delay}>
        <div className="min-h-96 relative flex flex-col items-center justify-center overflow-hidden rounded-lg text-center">
          <div className="flex min-h-0 flex-col gap-6 justify-center my-5">
            <h2 className="text-lime-400 uppercase text-xl font-bold">
              Organize your job hunt
            </h2>
            <SparklesText
              text="Take Control of Your Job Search with Landit"
              className="text-5xl sm:text-6xl lg:text-7xl text-primary"
            />
            <p className="text-md sm:text-xl font-medium">
              Seamless, Secure, and Smart. Your All-in-One Job Application
              Tracker
            </p>
          </div>
          <Button className="rounded-full px-4 py-6 bg-lime-500 text-primary-foreground hover:bg-lime-500 font-bold">
            <Link
              href="/application-record"
              className="flex flex-row items-center gap-2"
            >
              Open App
              <div className="rounded-full bg-lime-600 p-2">
                <MoveRight className="inline" />
              </div>
            </Link>
          </Button>
        </div>
      </BlurFade>
    </section>
  );
}
