import { TableCard } from "@/components/table-card";
import { Button } from "@/components/ui/button";
import { Pencil } from "@/lib/Logos";
import { FormTrigger } from "@/components/Forms/form-trigger/create-form-trigger";
import { ChatbotUI } from "@/components/ai-chatbot/chatbot";
import { GridListToggle } from "@/components/Grid/grid-list-toggle";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { getUserApplications } from "@/db/queries";

export default async function ApplicationRecord() {
  const user = await getUser();

  if (!user) {
    redirect("/login?next=/application-record");
  }

  const apps = await getUserApplications(user.id);

  return (
    <main className="flex flex-col items-center justify-between p-10 lg:p-16">
      <h1 className="text-2xl font-bold mb-6">Application Record</h1>
      <TableCard>
        <div className="flex mt-5 md:flex-row items-center gap-6 justify-between">
          <GridListToggle data={apps}>
            <FormTrigger>
              <Button
                type="button"
                className="flex flex-row gap-2 dark:bg-slate-500 dark:text-black"
              >
                Add <span className="hidden md:flex">Application</span>{" "}
                <Pencil className="w-4 h-4 inline " />
              </Button>
            </FormTrigger>
          </GridListToggle>
        </div>
      </TableCard>
      <div className="fixed bottom-10 right-20">
        <ChatbotUI />
      </div>
    </main>
  );
}
