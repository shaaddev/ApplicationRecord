import { features, FeatureProps } from "@/lib/info";
import Image from "next/image";

export function Features() {
  return (
    <section id="features">
      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg min-h-screen w-full my-48">
        <div className="flex min-h-0 flex-col gap-6 justify-center my-5">
          <h2 className="text-3xl uppercase font-bold text-center">Features</h2>
          <div className="flex flex-col">
            {features.map((feature: FeatureProps) => (
              <div
                key={feature.title}
                className="mx-auto w-full lg:w-3/4 flex flex-col xl:flex-row gap-12 bg-zinc-100 dark:bg-zinc-900 shadow-sm rounded-xl my-12"
              >
                <div className="flex flex-col justify-start p-16">
                  <h2 className="text-4xl font-semibold ">{feature.title}</h2>
                  <p className="mt-4 text-lg">{feature.desc}</p>
                </div>
                <Image
                  src={`${feature.image}`}
                  width={1200}
                  height={900}
                  alt={feature.title}
                  className="rounded-xl object-cover xl:w-1/2 border border-black/10 dark:border-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
