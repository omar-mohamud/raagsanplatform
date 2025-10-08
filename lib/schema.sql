-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    _id VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    hero_image TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    visible BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    _id VARCHAR(255) UNIQUE NOT NULL,
    project_id VARCHAR(255) REFERENCES projects(_id),
    title TEXT NOT NULL,
    content TEXT,
    media_url TEXT,
    media_type VARCHAR(50),
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_visible ON projects(visible);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects("order");
CREATE INDEX IF NOT EXISTS idx_stories_project_id ON stories(project_id);
CREATE INDEX IF NOT EXISTS idx_stories_order ON stories("order");

-- Insert default SEPOW project
INSERT INTO projects (_id, slug, title, summary, hero_image, status, visible, "order", start_date, end_date)
VALUES (
    'fallback-1',
    'sepow',
    'Socio-Economic Participation of Women-led Households (SEPOW)',
    'Understanding how women-led households navigate displacement, livelihoods, and aspirations in Somalia.',
    'https://res.cloudinary.com/dxcjrsrna/image/upload/raagsan/sepow/hero',
    'published',
    true,
    0,
    '2023-01-01',
    '2024-12-31'
) ON CONFLICT (_id) DO NOTHING;
