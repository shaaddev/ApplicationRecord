import { JobProps } from "@/lib/info";
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge"
import Link from "next/link";

export function ApplicationListView({
  data, statusColours
}: { data: JobProps[], statusColours: any }) {
  return(
    <div className="space-y-4">
      {data.map((m) => (
        <Card key={m.id}>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <h3 className="font-semibold">{m.company_name}</h3>
              <p className="text-sm text-gray-500">{m.role}</p>
              <p className="text-sm text-gray-500">{m.location}</p>
              <p className="text-sm text-gray-500">${m.salary}</p>
              {m.link && (
                <Link href={`${m.link}`} target="_blank"
                  className={cn(
                    buttonVariants({ variant: 'link', size: 'sm' }),
                    'text-blue-500 hover:text-blue-700 underline',
                    'size-8'
                  )}
                >
                  Application Link
                </Link>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={`${statusColours[m.status]}`}>{m.status}</Badge>
              
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}