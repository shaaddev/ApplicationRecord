import { Table, TableBody } from "@/components/ui/table";
import { TableList } from "./table-list";
import { TableH } from "./table-head";

export async function _Table({ data }: any) {
  return (
    <Table>
      <TableH />
      <TableBody>
        <TableList data={data} />
      </TableBody>
    </Table>
  );
}
