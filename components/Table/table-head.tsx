import { TableHead, TableRow, TableHeader } from "@/components/ui/table";

export function TableH(){
  return(
    <TableHeader>
      <TableRow>
        <TableHead>Role</TableHead>
        <TableHead>Company</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Date Applied</TableHead>
        <TableHead>Link</TableHead>
        <TableHead>Salary</TableHead>
      </TableRow>
    </TableHeader>
  )
}