import { HomePage } from "@/components/landing/home-page";
import Particles from "@/components/ui/particles";
import Meteors from "@/components/ui/meteors";
import { NavBar } from "@/components/landing/nav-bar";
import { Features } from "@/components/landing/features";
import { Donate } from "@/components/landing/donate";
import { Collab } from "@/components/landing/collab";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main>
      <Particles
        className="fixed inset-0"
        quantity={100}
        ease={80}
        color={`${"#fff"}`}
        refresh
      />
      <NavBar />
      <HomePage />
      <Features />
      <Donate />
      <Collab />
      <Footer />
    </main>
  );
}
