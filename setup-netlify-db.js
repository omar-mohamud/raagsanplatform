import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Use Netlify database URL if available, otherwise fall back to DATABASE_URL
const DATABASE_URL = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ No database URL found in environment variables');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupNetlifyDatabase() {
  console.log('🔧 Setting up Netlify Neon database...');
  try {
    // Read and execute the schema
    const schemaSql = fs.readFileSync(path.join(process.cwd(), 'lib', 'schema.sql'), 'utf8');
    await pool.query(schemaSql);
    console.log('✅ Database schema created successfully!');

    // Check if projects table is empty and insert default data
    const { rows: projects } = await pool.query('SELECT COUNT(*) FROM projects');
    if (parseInt(projects[0].count) === 0) {
      console.log('Inserting default project data...');
      const defaultProject = {
        _id: 'sepow-project-id',
        slug: 'sepow',
        title: 'Socio-Economic Participation of Women-led Households (SEPOW)',
        summary: 'Understanding how women-led households navigate displacement, livelihoods, and aspirations in Somalia.',
        hero_image: 'https://res.cloudinary.com/dxcjrsrna/image/upload/raagsan/sepow/hero',
        status: 'published',
        visible: true,
        order: 0,
        start_date: new Date('2023-01-01'),
        end_date: new Date('2024-12-31'),
      };
      await pool.query(
        `INSERT INTO projects (_id, slug, title, summary, hero_image, status, visible, "order", start_date, end_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          defaultProject._id,
          defaultProject.slug,
          defaultProject.title,
          defaultProject.summary,
          defaultProject.hero_image,
          defaultProject.status,
          defaultProject.visible,
          defaultProject.order,
          defaultProject.start_date,
          defaultProject.end_date,
        ]
      );
      console.log('✅ Default project inserted.');
    } else {
      console.log('Projects table already contains data, skipping default insert.');
    }

    // Test query
    const testResult = await pool.query('SELECT title FROM projects LIMIT 1');
    console.log(`✅ Test query successful! Found ${testResult.rows.length} projects`);
    if (testResult.rows.length > 0) {
      console.log('📋 Sample project:', testResult.rows[0].title);
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('🔌 Database connection closed');
  }
}

setupNetlifyDatabase();
