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

const colors = {
  'Not Applied': 'bg-red-500',
  'Applied': 'bg-yellow-500',
  'Phone Screen': 'bg-orange-500',
  'Interview': 'bg-blue-500',
  'Offer': 'bg-green-500',
  'Hired': 'bg-lime-500',
  'Rejected': 'bg-red-500',
  'Ghosted': 'bg-gray-500',
  'Blacklist': 'bg-red-500',
};

export function ApplicationGridView({
  data, statusColours, user
}: { data: JobProps[], statusColours: { [key: string]: string }, user?: User | null } ) {

  const [statuses, setStatuses] = useState<JobProps[]>(data);
  const handleUpdateStatus = (id: string, newStatus: keyof typeof colors) => {
    setStatuses(prevStatuses =>
      prevStatuses.map(job =>
        job.id === id ? { ...job, status: newStatus } : job
      )
    );
  };
  

  return(
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((m) => (
        <Card key={m.id}>
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
                    'text-blue-500 hover:text-blue-700 underline',
                    'size-8'
                  )}
                >
                  Application Link
                </Link>
              )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
