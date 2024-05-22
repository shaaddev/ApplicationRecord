import { Table, TableBody } from '@/components/ui/table';
import { TableList } from "./table-list";
import { TableH } from './table-head';
import { mock_data } from '@/lib/info';
import { applications } from '@/db/schema/applications';
import { db } from '@/db';
import { desc } from 'drizzle-orm';
import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';

export async function _Table(){

  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const id = user?.id
  let apps: any;

  if (id){
    apps = await db.select().from(applications).where(eq(applications.user_id, id)).orderBy(desc(applications.id))
  }


  return(
    <Table>
      <TableH />
      <TableBody>
        <TableList 
          data={user ? apps : mock_data}
        />
      </TableBody>
    </Table>
  )
}