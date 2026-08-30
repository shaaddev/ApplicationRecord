ALTER TABLE "applications" ADD COLUMN "planned_date" timestamp;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "follow_up_date" timestamp;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "notes" text;