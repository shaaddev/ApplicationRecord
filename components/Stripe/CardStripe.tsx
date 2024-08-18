import { Card, CardContent } from "../ui/card";

export function CardStripe({ children }: {
  children: React.ReactNode
}){
  return(
    <Card className="h-[320px] w-full bg-[#8f6ed5] hover:bg-[#6772e5] m-5 shadow-md dark:border-none dark:bg-[#6772e5] dark:hover:bg-[#8f6ed5]">
      <CardContent className="relative p-5 w-full">
        {children}
      </CardContent>
    </Card>
  )
}