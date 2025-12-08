import { Table, TableBody } from "@/components/ui/table";
import { TableList } from "./table-list";
import { TableH } from "./table-head";
import { mock_data } from "@/lib/info";
import { applications } from "@/db/schema/applications";
import { db } from "@/db";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function _Table({ data }: any) {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const authed = await isAuthenticated().catch(() => false);
  const user = authed ? await getUser() : null;
  const id = user?.id;
  let apps: any;

  if (id) {
    apps = await db
      .select()
      .from(applications)
      .where(eq(applications.user_id, id))
      .orderBy(desc(applications.id));
  }

  return (
    <Table>
      <TableH />
      <TableBody>
        <TableList data={data} />
      </TableBody>
    </Table>
  );
}
