import { _Table } from "@/components/Table/table";
import { TableCard } from "@/components/table-card";
import { Navbar } from "@/components/Navbar";
import { mock_data } from "@/lib/info";

export default async function Demo() {
  return (
    <>
      <Navbar/>
      <main className="flex flex-col items-center justify-between p-10 lg:p-16">
        <h1 className="text-2xl font-bold mb-6">Application Record (Demo)</h1>
        <TableCard>
          <_Table data={mock_data} />
        </TableCard>
      </main>
    </>
  );
}
