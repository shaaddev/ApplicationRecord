import {
  Drawer,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { AiDrawerContent } from "./ai-drawer-content"
import { Button } from "../ui/button"

export function AiDrawer({ children }: { children: React.ReactNode}) {
  return(
    <Drawer>
      <DrawerTrigger>
        {children}
      </DrawerTrigger>
      <AiDrawerContent />
    </Drawer>
  )
}