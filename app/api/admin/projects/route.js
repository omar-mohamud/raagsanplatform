import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect, query } from "@/lib/dbConnect";

// Disable caching for admin API
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      console.log("🔗 Admin API: Attempting PostgreSQL connection...");
      console.log("🔗 Admin API: NETLIFY_DATABASE_URL exists:", !!process.env.NETLIFY_DATABASE_URL);
      console.log("🔗 Admin API: DATABASE_URL exists:", !!process.env.DATABASE_URL);
      
      await dbConnect();
      console.log("🔗 Admin API: PostgreSQL connected, fetching projects");
      const result = await query('SELECT * FROM projects ORDER BY "order" ASC, created_at DESC');
      const projects = result.rows.map(row => ({
        _id: row._id,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        heroImage: row.hero_image,
        status: row.status,
        visible: row.visible,
        order: row.order,
        startDate: row.start_date,
        endDate: row.end_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
      console.log(`🔗 Admin API: Found ${projects.length} projects in PostgreSQL`);
      return NextResponse.json(projects);
    } catch (dbError) {
      console.error("🔗 Admin API: PostgreSQL connection failed:", dbError.message);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
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
      console.log("🔗 Admin API: Attempting PostgreSQL connection for update...");
      await dbConnect();
      console.log("🔗 Admin API: PostgreSQL connected, updating project");
      
      // Build the SET clause for the UPDATE query
      const setClause = [];
      const values = [];
      let paramCount = 1;

      if (filteredUpdates.visible !== undefined) {
        setClause.push(`visible = $${paramCount++}`);
        values.push(filteredUpdates.visible);
      }
      if (filteredUpdates.status !== undefined) {
        setClause.push(`status = $${paramCount++}`);
        values.push(filteredUpdates.status);
      }
      if (filteredUpdates.order !== undefined) {
        setClause.push(`"order" = $${paramCount++}`);
        values.push(filteredUpdates.order);
      }
      if (filteredUpdates.startDate !== undefined) {
        setClause.push(`start_date = $${paramCount++}`);
        values.push(filteredUpdates.startDate);
      }
      if (filteredUpdates.endDate !== undefined) {
        setClause.push(`end_date = $${paramCount++}`);
        values.push(filteredUpdates.endDate);
      }

      if (setClause.length === 0) {
        return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
      }

      setClause.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(projectId);

      const updateQuery = `
        UPDATE projects 
        SET ${setClause.join(', ')} 
        WHERE _id = $${paramCount}
        RETURNING *
      `;

      const result = await query(updateQuery, values);

      if (result.rows.length === 0) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      const updatedProject = {
        _id: result.rows[0]._id,
        slug: result.rows[0].slug,
        title: result.rows[0].title,
        summary: result.rows[0].summary,
        heroImage: result.rows[0].hero_image,
        status: result.rows[0].status,
        visible: result.rows[0].visible,
        order: result.rows[0].order,
        startDate: result.rows[0].start_date,
        endDate: result.rows[0].end_date,
        createdAt: result.rows[0].created_at,
        updatedAt: result.rows[0].updated_at
      };

      console.log("✅ Admin API: Updated project in PostgreSQL");
      return NextResponse.json(updatedProject);
    } catch (dbError) {
      console.error("🔗 Admin API: PostgreSQL connection failed:", dbError.message);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT to reorder projects
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projects } = await request.json();
    
    try {
      console.log("🔗 Admin API: Attempting PostgreSQL connection for reorder...");
      await dbConnect();
      console.log("🔗 Admin API: PostgreSQL connected, reordering projects");
      
      // Update order for all projects
      const updatePromises = projects.map((project, index) => 
        query(
          'UPDATE projects SET "order" = $1, updated_at = CURRENT_TIMESTAMP WHERE _id = $2',
          [index, project._id]
        )
      );
      
      await Promise.all(updatePromises);
      
      console.log("✅ Admin API: Reordered projects in PostgreSQL");
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error("🔗 Admin API: PostgreSQL connection failed:", dbError.message);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error reordering projects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
