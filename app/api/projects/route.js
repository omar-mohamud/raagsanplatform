import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find().sort({ createdAt: -1 }).lean();
    return new Response(JSON.stringify({ success: true, data: projects }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Unauthorized" 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await dbConnect();
    const body = await request.json();
    const project = await Project.create(body);
    return new Response(JSON.stringify({ success: true, data: project }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


