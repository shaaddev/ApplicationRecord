import { NextRequest, NextResponse } from "next/server";
import { deleteApplication } from "@/db/queries";
import { getUser } from "@/lib/session";

export async function DELETE(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!Number.isInteger(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const deleted = await deleteApplication(id, user.id);
  if (!deleted) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "post deleted" }, { status: 200 });
}
