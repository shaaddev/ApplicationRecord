import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { getUserApplications } from "@/db/queries";
import { computeStats } from "@/lib/applications";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ApplicationsView } from "@/components/applications/applications-view";
import { NewApplicationButton } from "@/components/applications/application-dialog";
import { Chatbot } from "@/components/ai-chatbot/chatbot";

export const metadata: Metadata = {
  title: "Applications | Land It",
};

export default async function ApplicationRecord() {
  const user = await getUser();
  if (!user) {
    redirect("/login?next=/application-record");
  }

  const applications = await getUserApplications(user.id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
          <p className="text-sm text-muted-foreground">
            Everything you have applied to, in one place.
          </p>
        </div>
        <NewApplicationButton />
      </div>
      <StatsRow stats={computeStats(applications)} />
      <ApplicationsView applications={applications} />
      <Chatbot />
    </div>
  );
}
