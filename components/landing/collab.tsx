import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import BlurFade from "@/components/ui/blur-fade";

export function Collab({ delay }: { delay?: number }) {
  return (
    <section id="collab">
      <BlurFade delay={delay! * 6}>
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center overflow-hidden rounded-lg text-center">
          <div className="my-5 flex min-h-0 flex-col justify-center gap-6">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-brand-ink uppercase">
              Developers, join us
            </h2>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Contribute to Land It and help build the future with us
            </h1>
          </div>
          <Button
            size="lg"
            variant="outline"
            render={
              <a
                href="https://github.com/shaaddev/ApplicationRecord"
                target="_blank"
                rel="noreferrer"
                aria-label="Contribute on GitHub"
              />
            }
            nativeButton={false}
          >
            <GithubLogoIcon data-icon="inline-start" weight="fill" />
            Contribute on GitHub
          </Button>
        </div>
      </BlurFade>
    </section>
  );
}
