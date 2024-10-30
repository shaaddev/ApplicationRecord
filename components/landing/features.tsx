import { features, FeatureProps } from "@/lib/info";

export function Features() {
  return (
    <section id="features">
      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg text-center min-h-screen">
        <div className="flex min-h-0 flex-col gap-6 justify-center my-5">
          <h2 className="text-2xl">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center"
              >
                <div className="h-20 w-20 bg-lime-500 rounded-full flex justify-center items-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-2xl">{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
