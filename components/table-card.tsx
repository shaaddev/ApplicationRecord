import { Card, CardContent, } from '@/components/ui/card';

export function TableCard({ children }: { children: React.ReactNode}) {
  return(
    <Card
      className="w-full overflow-x-hidden p-2 lg:p-10 h-[600px]"
    >
      <CardContent className='relative'>
        {children}
      </CardContent>
    </Card>
  )
}