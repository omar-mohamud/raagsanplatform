import { NextResponse } from "next/server";
import { dbConnect, query } from "@/lib/dbConnect";

export async function GET() {
  try {
    console.log('🧪 Test: Checking database connection...');
    
    // Check environment variables
    const netlifyDbUrl = process.env.NETLIFY_DATABASE_URL;
    const regularDbUrl = process.env.DATABASE_URL;
    
    console.log('🧪 Test: NETLIFY_DATABASE_URL exists:', !!netlifyDbUrl);
    console.log('🧪 Test: DATABASE_URL exists:', !!regularDbUrl);
    
    // Test database connection
    await dbConnect();
    console.log('🧪 Test: Database connection successful');
    
    // Test a simple query
    const result = await query('SELECT NOW() as current_time');
    console.log('🧪 Test: Query successful:', result.rows[0]);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      netlifyDbUrl: !!netlifyDbUrl,
      regularDbUrl: !!regularDbUrl,
      currentTime: result.rows[0].current_time
    });

  } catch (error) {
    console.error('🧪 Test: Database connection failed:', error.message);
    return NextResponse.json({ 
      success: false,
      error: 'Database connection failed', 
      details: error.message,
      netlifyDbUrl: !!process.env.NETLIFY_DATABASE_URL,
      regularDbUrl: !!process.env.DATABASE_URL
    }, { status: 500 });
  }
}
