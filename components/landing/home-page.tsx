import { Link as ViewLink } from "next-view-transitions";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import SparklesText from "@/components/ui/sparkles-text";
import BlurFade from "@/components/ui/blur-fade";

export function HomePage({ delay }: { delay?: number }) {
  return (
    <section id="home">
      <BlurFade delay={delay}>
        <div className="relative flex min-h-96 flex-col items-center justify-center overflow-hidden rounded-lg text-center">
          <div className="my-5 flex min-h-0 flex-col justify-center gap-6">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-brand-ink uppercase">
              Organize your job hunt
            </h2>
            <SparklesText
              text="Take control of your job search with Land It"
              className="text-5xl text-foreground sm:text-6xl lg:text-7xl"
            />
            <p className="text-md font-medium text-muted-foreground sm:text-xl">
              A calm, fast tracker for every application you send.
            </p>
          </div>
          <Button size="lg" render={<ViewLink href="/application-record" />} nativeButton={false}>
            Open app
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </BlurFade>
    </section>
  );
}
