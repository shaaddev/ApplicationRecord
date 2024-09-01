import { JobProps } from "@/lib/info";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link";
import { Delete } from "./application-delete-btn";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

export function ApplicationGridView({
  data, statusColours, user
}: { data: JobProps[], statusColours: { [key: string]: string }, user?: User | null } ) {

  return(
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((m) => (
        <Card key={m.id}>
          <CardHeader>
            <CardTitle>{m.role}</CardTitle>
            <CardDescription>{m.company_name}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge className={`${statusColours[m.status]}`}>{m.status}</Badge>
            <p className="my-2">{m.location}</p>
            <p className="mt-2">{m.salary}</p>
            {m.link && (
              <Link href={`${m.link}`} target="_blank"
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  'size-10 mt-1'
                )}
              >
                Apply
              </Link>
            )}
          </CardContent>
          {/* {user ? (
            <CardFooter className="flex justify-between">
              <Link href={`/edit/${m.id}`}>
                <Button type='button'>Update</Button>
              </Link>
              <Delete id={parseInt(m.id!)}/>
            </CardFooter>
          ): null} */}
        </Card>
      ))}
    </div>
  )
}
