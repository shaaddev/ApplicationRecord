import { EditForm } from "@/components/Forms/edit-form";
import { db } from "@/db";
import { applications } from "@/db/schema/applications";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Edit({params}: {params: {id: string}}){
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user){
    redirect('/login')
  }

  const { id } = params;
  const application = await db.select().from(applications).where(eq(applications.id, parseInt(id)) && eq(applications.user_id, user.id));
  const { role, company_name, location, status, date_applied, link, salary } = application[0];
  return (
    <div className="flex items-center justify-center mx-auto max-w-screen-xl">
      <EditForm 
        id={id}
        role={role}
        company_name={company_name}
        location={location}
        status={status}
        date_applied={date_applied}
        link={link!}
        salary={salary!}
      />
    </div>
  )
}