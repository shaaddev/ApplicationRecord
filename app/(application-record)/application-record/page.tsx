import { _Table } from "@/components/Table/table";
import { TableCard } from "@/components/table-card";
import { Button } from "@/components/ui/button";
import { Pencil } from "@/lib/Logos";
import { FormTrigger } from "@/components/Forms/form-trigger/create-form-trigger";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { applications } from '@/db/schema/applications';
import { db } from '@/db';
import { desc } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { AiChatBtn } from "@/components/ai-chatbot/ai-chat-btn";
import { AiDrawer } from "@/components/ai-chatbot/ai-drawer";

export default async function ApplicationRecord() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const id = user?.id
  let apps: any;

  if (id){
    apps = await db.select().from(applications).where(eq(applications.user_id, id)).orderBy(desc(applications.id))
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex flex-col items-center justify-between p-10 lg:p-16">
      <h1 className="text-2xl font-bold mb-6">Application Record</h1>
      <TableCard>
        <_Table data={apps}/>
      </TableCard>
      <div className="hidden md:flex mt-5 md:flex-row items-center gap-6 justify-between">
        {user && (
          <FormTrigger>
            <Button type='button' className='flex flex-row gap-2 dark:bg-slate-500 dark:text-black'>
              Add <Pencil className="w-4 h-4 inline" />
            </Button>
          </FormTrigger>
        )}
      </div>
      <div className="fixed bottom-10 right-20">
        <AiDrawer>
          <AiChatBtn />
        </AiDrawer>
      </div>
    </main>
  );
}

