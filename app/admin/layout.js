import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";

export default async function AdminLayout({ children }) {
  // Don't check session here - let individual pages handle authentication
  // This allows the login page to display properly
  return children;
}


