import { Button } from "../ui/button"
import { Chat } from "@/lib/Logos"

export function AiChatBtn(){
  return(
    <Button className="rounded-full outline-black p-2 bg-black border-white dark:outline-white dark:bg-white">
      <Chat className="w-6 h-6"/>
    </Button>
  )
}