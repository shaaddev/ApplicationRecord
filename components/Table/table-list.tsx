import { JobProps } from "@/lib/info";
import { TableRow, TableCell } from "@/components/ui/table";
import { Detail } from "../table-details/detail"

export function TableList({ data }: { data: JobProps[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Applied":
        return "hover:text-gray-800"; 
      case "Applied":
        return "hover:text-yellow-400"; 
      case "Phone Screen":
        return "hover:text-orange-500";
      case "Offer":
        return "hover:text-green-600"; 
      case "Hired":
        return "hover:text-lime-600"; 
      case "Rejected":
        return "hover:text-red-600"; 
      case "Ghosted":
        return "hover:text-gray-500"; 
      default:
        return "hover:text-gray-500"; 
    }
  };

  return(
    <>
      {data.map((m, index) => (
        <Detail data={m} key={index}>
          <TableRow className={`hover:cursor-pointer ${getStatusColor(m.status)}`}>
            <TableCell className="font-medium p-5">{m.role}</TableCell>
            <TableCell>{m.company_name}</TableCell>
            <TableCell>{m.location}</TableCell>
            <TableCell>{m.status}</TableCell>
            <TableCell>{m.date_applied}</TableCell>
            <TableCell className="w-1/12">
              <a 
                href={m.link} 
                target="_blank"
                className="hover:text-emerald-500"
              >{m.link}</a>
            </TableCell>
            <TableCell className="w-1/12">{m.salary}</TableCell>   
          </TableRow>
        </Detail>
      ))}
    </>
  )
}