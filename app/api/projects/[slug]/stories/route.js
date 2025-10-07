import { dbConnect } from "@/lib/dbConnect";
import Story from "@/models/Story";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const project = await Project.findOne({ slug: params.slug }).lean();
    if (!project) {
      return new Response(JSON.stringify({ success: false, error: "Project not found" }), { status: 404 });
    }
    const stories = await Story.find({ projectId: project._id }).sort({ createdAt: -1 }).lean();
    return new Response(JSON.stringify({ success: true, data: stories }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function POST(request, { params }) {
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
    const project = await Project.findOne({ slug: params.slug });
    if (!project) {
      return new Response(JSON.stringify({ success: false, error: "Project not found" }), { status: 404 });
    }
    const body = await request.json();
    const story = await Story.create({ ...body, projectId: project._id });
    return new Response(JSON.stringify({ success: true, data: story }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}


