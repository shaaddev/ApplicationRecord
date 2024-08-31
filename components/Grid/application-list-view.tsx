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
              <h3 className="font-semibold">{m.role}</h3>
              <p className="text-sm text-gray-500">{m.company_name}</p>
              <p className="text-sm text-gray-500">{m.location}</p>
              {m.link && (
                <Link href={`${m.link}`} target="_blank"
                  className={cn(
                    buttonVariants({ variant: 'link', size: 'sm' }),
                    'size-8'
                  )}
                >
                  Apply
                </Link>
              )}
              <p className="text-sm text-gray-500">${m.salary}</p>
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