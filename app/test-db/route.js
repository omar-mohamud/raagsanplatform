import { dbConnect } from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    return new Response(JSON.stringify({ success: true, message: "MongoDB Connected" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}


