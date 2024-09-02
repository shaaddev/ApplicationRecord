import { JobProps } from "@/lib/info";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link";
import { Delete } from "./application-delete-btn";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "react-day-picker";
import { useState } from "react";
import { UpdateStatusBtn } from "./application-update-btn";

export function ApplicationGridView({
  data, statusColours, user
}: { data: JobProps[], statusColours: { [key: string]: string }, user?: User | null } ) {

  const [statuses, setStatuses] = useState<JobProps[]>(data);
  const handleUpdateStatus = (id: string, newStatus: keyof typeof statusColours) => {
    setStatuses((prevStatuses: any) =>
      prevStatuses.map((job: any) =>
        job.id === id ? { ...job, status: newStatus } : job
      )
    );
  };
  

  return(
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((m) => (
        <Card key={m.id} className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>{m.company_name}</CardTitle>
            <CardDescription>{m.role}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge className={`${statusColours[m.status]}`}>{m.status}</Badge>
            <p className="my-2">{m.location}</p>
            <p className="mt-2">{m.salary}</p>
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
          <UpdateStatusBtn id={m.id!} status={m.status} data={data} statusColours={statusColours} />
        </Card>
      ))}
    </div>
  )
}