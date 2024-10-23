"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export default function Theme({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-2 rounded-full"
      type="button"
      size="icon"
      variant="ghost"
    >
      <Sun
        className="h-[1.2rem] w-[1.2rem] text-neutral-800 dark:hidden dark:text-neutral-200"
        aria-label="the sun"
      />
      <Moon
        className="hidden h-[1.2rem] w-[1.2rem] text-neutral-800 dark:block dark:text-neutral-200"
        aria-label="the moon"
      />
    </Button>
  );
}
