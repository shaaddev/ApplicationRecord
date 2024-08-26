import { Button } from "../ui/button"
import { Chat } from "@/lib/Logos"

export function AiChatBtn(){
  return(
    <div className="fixed bottom-0 left-0">
      <Button className="rounded-r-xl flex flex-row justify-between w-[425px] px-7 py-2 bg-black border-white  dark:bg-lime-600 dark:text-slate-200">
        Chat with Me! <Chat className="w-6 h-6"/>
      </Button>
    </div>
    
  )
}