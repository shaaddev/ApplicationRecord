import { JobProps } from "@/lib/info";
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge"
import Link from "next/link";
import { UpdateStatusBtn } from "./application-update-btn";
import { Delete } from "./application-delete-btn";

export function ApplicationListView({
  data, statusColours, className
}: { data: JobProps[], statusColours: any, className?: string }) {
  return(
    <div className="space-y-4">
      {data.map((m) => (
        <Card key={m.id} className="">
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
                    'text-blue-500 hover:text-blue-700 underline size-8 ml-7',
                  )}
                >
                  Application Link
                </Link>
              )}
            </div>
            <div className="flex items-center justify-center space-x-4">
              <Badge className={`${statusColours[m.status]} w-full`}>{m.status}</Badge>
              {/* add in the update status here */}
              <UpdateStatusBtn id={m.id!} status={m.status} data={data} statusColours={statusColours} className={className}/>
              <Delete id={Number(m.id!)} />
              <Delete id={Number(m.id!)} /> {/* This will be the edit button */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}