// "use client";
import { HomePage } from "@/components/landing/home-page";
import Particles from "@/components/ui/particles";
import { NavBar } from "@/components/landing/nav-bar";
import { Features } from "@/components/landing/features";
import { Donate } from "@/components/landing/donate";
import { Collab } from "@/components/landing/collab";
import { Footer } from "@/components/landing/footer";
import { useTheme } from "next-themes";

export default function Home() {
  // const { theme } = useTheme();

  return (
    <div>
      {/* <Particles
        className="fixed inset-0"
        quantity={100}
        ease={80}
        color={theme === "dark" ? "#fff" : "#000"}
        refresh
      /> */}
      <NavBar />
      <HomePage />
      <Features />
      <Donate />
      <Collab />
      <Footer />
    </div>
  );
}
