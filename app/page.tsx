"use client";
import { HomePage } from "@/components/landing/home-page";
import { Features } from "@/components/landing/features";
import { Donate } from "@/components/landing/donate";
import { Collab } from "@/components/landing/collab";
import { Footer } from "@/components/landing/footer";
import Particles from "@/components/ui/particles";
import { useTheme } from "next-themes";
import { NavBar } from "@/components/landing/nav-bar";

export default function LandingPage() {
  const { theme } = useTheme();

  return (
    <div>
      <Particles
        className="fixed inset-0"
        quantity={100}
        ease={80}
        color={theme === "dark" ? "#fff" : "#000"}
        refresh
      />
      <div>
        <NavBar />
        <HomePage />
        <Features />
        <Donate />
        <Collab />
        <Footer />
      </div>
    </div>
  );
}
