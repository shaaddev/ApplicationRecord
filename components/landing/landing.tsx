"use client";
import { HomePage } from "@/components/landing/home-page";
import { Features } from "@/components/landing/features";
import { Donate } from "@/components/landing/donate";
import { Collab } from "@/components/landing/collab";
import { Footer } from "@/components/landing/footer";
import Particles from "@/components/ui/particles";
import { useTheme } from "next-themes";
import { NavBar } from "@/components/landing/nav-bar";

export function Landing() {
  const { theme } = useTheme();
  const delay = 0.3;

  return (
    <div>
      <Particles
        className="fixed inset-0"
        quantity={100}
        ease={80}
        color={theme === "dark" ? "#fff" : "#000"}
        refresh
      />
      <NavBar />
      <HomePage delay={delay} />
      <Features delay={delay} />
      <Donate delay={delay} />
      <Collab delay={delay} />
      <Footer />
    </div>
  );
}
