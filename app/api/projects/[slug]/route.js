import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const project = await Project.findOne({ slug: params.slug });
    if (!project) {
      return new Response(JSON.stringify({ success: false, error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: project }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function PATCH(request, { params }) {
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
    const updates = await request.json();
    const project = await Project.findOneAndUpdate({ slug: params.slug }, updates, { new: true });
    if (!project) {
      return new Response(JSON.stringify({ success: false, error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: project }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
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
    const deleted = await Project.findOneAndDelete({ slug: params.slug });
    if (!deleted) {
      return new Response(JSON.stringify({ success: false, error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}


