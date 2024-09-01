import { JobProps } from "@/lib/info";
import { CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDownIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "@/components/ui/button"; // Make sure you're importing the correct Button
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

export function UpdateStatusBtn({
  data, statusColours, user
}: { data: JobProps[], statusColours: { [key: string]: string }, user?: User | null }) {

  const [statuses, setStatuses] = useState<JobProps[]>(data);

  const handleUpdateStatus = (id: string, newStatus: keyof typeof colors) => {
    setStatuses(prevStatuses =>
      prevStatuses.map(job =>
        job.id === id ? { ...job, status: newStatus } : job
      )
    );
  };

  return (
    <>
      {statuses.map((m) => (
        <div
          key={m.id}
          className={`p-4 rounded-md border ${statusColours[m.status]}`} // Dynamically set the card background color
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{m.company_name}</h3>
            <Badge className={`${statusColours[m.status]}`}>{m.status}</Badge> {/* Badge with dynamic color */}
          </div>
          <CardFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  Update Status
                  <ChevronDownIcon className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* not sure if this is supposed to be data or status */}
                <DropdownMenuItem onClick={() => handleUpdateStatus(m.id, "Applied")}>Applied</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus(m.id, "Interview")}>Interview</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus(m.id, "Hired")}>Hired</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus(m.id, "Offer")}>Offer</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus(m.id, "Rejected")}>Rejected</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus(m.id, "Ghosted")}>Ghosted</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus(m.id, "Not Applied")}>Not Applied</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus(m.id, "Phone Screen")}>Phone Screen</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus(m.id, "Blacklist")}>Blacklist</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </div>
      ))}
    </>
  );
}
