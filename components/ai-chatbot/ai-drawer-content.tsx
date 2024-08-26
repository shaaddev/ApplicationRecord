import {
  DrawerContent,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { Chatbot } from "./chatbot";
import Image from "next/image";
import landy from "@/public/landy.png";
import { Theme } from "../theme";
import { Button } from "../ui/button";

export function AiDrawerContent() {
  return (
    <DrawerContent className="h-[600px] max-w-[425px] p-0 m-0 mb-10 bg-slate-100 dark:bg-neutral-900 border-none">
      <div className=" w-full bg-black text-white flex flex-row items-center justify-between  p-2 m-0">
        <div className="flex flex-row ">
        <Image
          src={landy}
          alt="Landy Profile"
          width={32}
          height={32}
          className="rounded-full mr-3"
        />
        <div className="ml-1">
          <p className="text-lg font-medium">Landy</p>
          <p className="text-sm">AI Customer Support</p>
        </div>
        </div>
        <div className="flex items-end justify-end">
          <Theme />
        </div>
      </div>
      <div className="relative w-full p-5">
        <Chatbot />
      </div>
    </DrawerContent>
  );
}
