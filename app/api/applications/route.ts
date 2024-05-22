import { NextResponse } from "next/server";
import { db } from "@/db";
import { applications } from "@/db/schema/applications";
import { eq } from "drizzle-orm";

export async function DELETE(req: any){
  const id = req.nextUrl.searchParams.get("id");

  await db.delete(applications)
    .where(eq(applications.id, parseInt(id)));

  
  return NextResponse.json({message: 'post deleted'}, {status: 201});
}