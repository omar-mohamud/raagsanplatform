import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Project";
import { getFallbackProjects, updateFallbackProject, reorderFallbackProjects } from "@/lib/fallbackData";

// GET all projects for admin management
export async function GET() {
  try {
    console.log("Admin projects API called");
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("No session found, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session found, attempting database connection");
    try {
      await dbConnect();
      console.log("Database connected, fetching projects");
      const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
      console.log(`Found ${projects.length} projects in database`);
      return NextResponse.json(projects);
    } catch (dbError) {
      console.warn("MongoDB connection failed, using fallback data:", dbError.message);
      // Fallback to local data when MongoDB is not available
      const fallbackProjects = getFallbackProjects();
      console.log(`Using ${fallbackProjects.length} fallback projects`);
      return NextResponse.json(fallbackProjects);
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH to update project metadata (visibility, status, order, dates)
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, updates } = await request.json();
    
    // Only allow specific fields to be updated
    const allowedFields = ['visible', 'status', 'order', 'startDate', 'endDate'];
    const filteredUpdates = {};
    
    for (const field of allowedFields) {
      if (updates.hasOwnProperty(field)) {
        filteredUpdates[field] = updates[field];
      }
    }

    try {
      await dbConnect();
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        filteredUpdates,
        { new: true, runValidators: true }
      );

      if (!updatedProject) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      return NextResponse.json(updatedProject);
    } catch (dbError) {
      console.warn("MongoDB connection failed, using fallback data:", dbError.message);
      // Fallback to local data when MongoDB is not available
      const updatedProject = updateFallbackProject(projectId, filteredUpdates);
      
      if (!updatedProject) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      return NextResponse.json(updatedProject);
    }
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH to reorder projects
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projects } = await request.json();
    
    try {
      await dbConnect();
      
      // Update order for all projects
      const updatePromises = projects.map((project, index) => 
        Project.findByIdAndUpdate(project._id, { order: index })
      );
      
      await Promise.all(updatePromises);
      
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.warn("MongoDB connection failed, using fallback data:", dbError.message);
      // Fallback to local data when MongoDB is not available
      reorderFallbackProjects(projects);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error reordering projects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
