import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set" : "Not set",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "Not set",
    ADMIN_USER: process.env.ADMIN_USER || "admin (default)",
    ADMIN_PASS: process.env.ADMIN_PASS ? "Set" : "admin123 (default)",
    NODE_ENV: process.env.NODE_ENV,
  });
}
