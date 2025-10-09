import { NextResponse } from "next/server";
import { query } from "@/lib/dbConnect";

export async function GET() {
  try {
    console.log('🔍 Debug: Checking database contents...');
    
    // Check all projects in database
    const result = await query('SELECT _id, title, visible, status, "order" FROM projects ORDER BY "order" ASC');
    
    console.log('🔍 Debug: Found projects:', result.rows);
    
    // Check visible projects specifically
    const visibleResult = await query('SELECT _id, title, visible, status FROM projects WHERE visible = true ORDER BY "order" ASC');
    
    console.log('🔍 Debug: Visible projects:', visibleResult.rows);
    
    return NextResponse.json({
      allProjects: result.rows,
      visibleProjects: visibleResult.rows,
      totalCount: result.rows.length,
      visibleCount: visibleResult.rows.length
    });

  } catch (error) {
    console.error('🔍 Debug: Error checking database:', error.message);
    return NextResponse.json({ 
      error: 'Database check failed', 
      details: error.message 
    }, { status: 500 });
  }
}
