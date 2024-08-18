import {
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Chatbot } from "./chatbot";
import Image from "next/image";
import landy from "@/public/landy.png";

export function AiDialogContent() {
  return (
    <DialogContent className="h-[500px] max-w-[425px] p-5">
      <div className="bg-inherit flex flex-row items-center justify-start border m-0 p-0 pl-3">
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
      <div className="relative w-full p-5">
        <Chatbot />
      </div>
    </DialogContent>
  );
}
