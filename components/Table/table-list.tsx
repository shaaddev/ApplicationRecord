import { JobProps } from "@/lib/info";
import { TableRow, TableCell } from "@/components/ui/table";
import { Detail } from "../table-details/detail"
import Link from "next/link";

export function TableList({ data }: { data: JobProps[] }) {

  return(
    <>
      {data.map((m, index) => (
        <Detail data={m} key={index}>
          <TableRow className="hover:text-pink-500 hover:cursor-pointer">
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