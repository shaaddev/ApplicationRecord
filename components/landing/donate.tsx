import ShineBorder from "@/components/ui/shine-border";
import Link from "next/link";
import BlurFade from "@/components/ui/blur-fade";

export function Donate({ delay }: { delay?: number }) {
  return (
    <section id="donate">
      <BlurFade delay={delay! * 5}>
        <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg text-center min-h-full">
          <div className="flex min-h-0 flex-col gap-6 justify-center my-5">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-brand-ink uppercase">
              Support the project
            </h2>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">We value your support</h1>
          </div>
          <div className="my-12 h-72">
            <Link href="https://donate.stripe.com/aEUaI65a5fpjgTe144">
              <ShineBorder
                className="flex flex-col items-center justify-center p-5 gap-12 whitespace-nowrap"
                color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
              >
                <h2 className="text-3xl font-bold">Donate Now</h2>
                <p className="text-xs sm:text-lg text-muted-foreground">
                  Click here to donate and support us through our journey
                </p>
              </ShineBorder>
            </Link>
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
