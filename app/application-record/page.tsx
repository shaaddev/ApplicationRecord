import { _Table } from "@/components/Table/table";
import { TableCard } from "@/components/table-card";
import { Button } from "@/components/ui/button";
import { Pencil } from "@/lib/Logos";
import { FormTrigger } from "@/components/Forms/form-trigger/create-form-trigger";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export default async function ApplicationRecord() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // if (!user) {
  //   redirect("/login");
  // }

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-between p-10 lg:p-16">
        <h1 className="text-2xl font-bold mb-6">Application Record</h1>
        <TableCard>
          <_Table />
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
      </main>
    </>
  );
}

