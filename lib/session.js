import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/session_options";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  return true;
}


