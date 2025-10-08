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
      console.log("🔗 Admin API: Attempting MongoDB connection...");
      await dbConnect();
      console.log("🔗 Admin API: MongoDB connected, fetching projects");
      const mongoProjects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
      console.log(`🔗 Admin API: Found ${mongoProjects.length} projects in MongoDB`);
      return NextResponse.json(mongoProjects);
    } catch (dbError) {
      console.error("🔗 Admin API: MongoDB connection failed:", dbError.message);
      console.error("🔗 Admin API: Using fallback data as last resort");
      // Use fallback data only as a last resort
      const fallbackProjects = getFallbackProjects();
      console.log(`🔗 Admin API: Using ${fallbackProjects.length} fallback projects`);
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
      console.log("🔗 Admin API: Attempting MongoDB connection for update...");
      await dbConnect();
      console.log("🔗 Admin API: MongoDB connected, updating project");
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        filteredUpdates,
        { new: true, runValidators: true }
      );

      if (!updatedProject) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      
      console.log("✅ Admin API: Updated project in MongoDB");
      return NextResponse.json(updatedProject);
    } catch (dbError) {
      console.error("🔗 Admin API: MongoDB connection failed:", dbError.message);
      console.error("🔗 Admin API: Using fallback data as last resort");
      // Use fallback data only as a last resort
      const fallbackUpdatedProject = updateFallbackProject(projectId, filteredUpdates);
      
      if (!fallbackUpdatedProject) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      
      console.log("✅ Admin API: Updated project in fallback data");
      return NextResponse.json(fallbackUpdatedProject);
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
