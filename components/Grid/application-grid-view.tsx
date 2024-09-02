import { JobProps } from "@/lib/info";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link";
import { Delete } from "./application-delete-btn";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { Ellipsis } from "lucide-react";
import { UpdateStatusBtn } from "./application-update-btn";

export function ApplicationGridView({
  data, statusColours, user
}: { data: JobProps[], statusColours: { [key: string]: string }, user?: User | null } ) {

  return(
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((m) => (
        <Card key={m.id} className="flex flex-col justify-between">
          <CardHeader className="relative flex flex-row items-start justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>{m.company_name}</CardTitle>
              <CardDescription>{m.role}</CardDescription>
            </div>
            <div className="flex">
              <Link href={`/edit/${m.id}`}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  '',
                )}
              >
                <Ellipsis />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Badge className={`${statusColours[m.status]}`}>{m.status}</Badge>
            <p className="my-2">{m.location}</p>
            <p className="mt-2">${m.salary}</p>
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
               {/* add in the update status here */}
          </CardContent>
          <CardContent className="flex items-center justify-between py-4">
            <UpdateStatusBtn
              id={m.id!}
              status={m.status}
              data={data}
              statusColours={statusColours}
            />
            <div className="flex space-x-2 mb-6">
              <Delete id={Number(m.id!)} />
              <Delete id={Number(m.id!)} /> {/* This will be the edit button */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}