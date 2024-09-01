import { signInAnonymouslyAction } from "@/components/Forms/authActions";

export default async function GuestPage() {
  await signInAnonymouslyAction();

  return null;
}
