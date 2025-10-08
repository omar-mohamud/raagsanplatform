// Fallback data structure for when MongoDB is not available
// This simulates the same admin editing behavior with persistent storage

import fs from 'fs';
import path from 'path';

const FALLBACK_DATA_FILE = path.join(process.cwd(), 'data', 'fallback-projects.json');

const DEFAULT_FALLBACK_PROJECTS = [
  {
    _id: 'fallback-1',
    slug: 'sepow',
    title: 'Socio-Economic Participation of Women-led Households (SEPOW)',
    summary: 'Understanding how women-led households navigate displacement, livelihoods, and aspirations in Somalia.',
    heroImage: 'https://res.cloudinary.com/dxcjrsrna/image/upload/raagsan/sepow/hero',
    status: 'published',
    visible: true,
    order: 0,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2024-12-31'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(FALLBACK_DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load fallback projects from file or use defaults
function loadFallbackProjects() {
  try {
    ensureDataDirectory();
    if (fs.existsSync(FALLBACK_DATA_FILE)) {
      const data = fs.readFileSync(FALLBACK_DATA_FILE, 'utf8');
      const projects = JSON.parse(data);
      return projects.map(project => ({
        ...project,
        startDate: project.startDate ? new Date(project.startDate) : null,
        endDate: project.endDate ? new Date(project.endDate) : null,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt)
      }));
    }
  } catch (error) {
    console.error('Error loading fallback projects:', error);
  }
  return DEFAULT_FALLBACK_PROJECTS;
}

// Save fallback projects to file
function saveFallbackProjectsToFile(projects) {
  try {
    ensureDataDirectory();
    const dataToSave = projects.map(project => ({
      ...project,
      startDate: project.startDate ? project.startDate.toISOString() : null,
      endDate: project.endDate ? project.endDate.toISOString() : null,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString()
    }));
    fs.writeFileSync(FALLBACK_DATA_FILE, JSON.stringify(dataToSave, null, 2));
    console.log('Fallback projects saved to file');
  } catch (error) {
    console.error('Error saving fallback projects:', error);
  }
}

// Load initial fallback projects
let fallbackProjects = loadFallbackProjects();

export function getFallbackProjects() {
  // Reload from file to ensure we have the latest data
  fallbackProjects = loadFallbackProjects();
  return fallbackProjects.map(project => ({
    ...project,
    startDate: project.startDate ? new Date(project.startDate) : null,
    endDate: project.endDate ? new Date(project.endDate) : null,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt)
  }));
}

export function updateFallbackProject(projectId, updates) {
  // Find and update the project in the in-memory storage
  const projectIndex = fallbackProjects.findIndex(p => p._id === projectId);
  if (projectIndex !== -1) {
    // Apply updates to the project
    fallbackProjects[projectIndex] = {
      ...fallbackProjects[projectIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    // Save to file for persistence
    saveFallbackProjectsToFile(fallbackProjects);
    
    // Return the updated project with proper date objects
    const updatedProject = {
      ...fallbackProjects[projectIndex],
      startDate: fallbackProjects[projectIndex].startDate ? new Date(fallbackProjects[projectIndex].startDate) : null,
      endDate: fallbackProjects[projectIndex].endDate ? new Date(fallbackProjects[projectIndex].endDate) : null,
      createdAt: new Date(fallbackProjects[projectIndex].createdAt),
      updatedAt: new Date(fallbackProjects[projectIndex].updatedAt)
    };
    
    return updatedProject;
  }
  return null;
}

export function reorderFallbackProjects(newOrder) {
  // Update the order of projects in the in-memory storage
  fallbackProjects = newOrder.map((project, index) => ({
    ...project,
    order: index,
    updatedAt: new Date()
  }));
  
  // Save to file for persistence
  saveFallbackProjectsToFile(fallbackProjects);
  
  return true;
}
