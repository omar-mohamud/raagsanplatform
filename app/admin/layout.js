import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Unauthorized</h1>
        <p>
          Please <a href="/login">log in</a> to access the admin.
        </p>
      </main>
    );
  }
  return children;
}


