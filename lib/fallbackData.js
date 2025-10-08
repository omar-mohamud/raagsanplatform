// Fallback data structure for when MongoDB is not available
// This simulates the same admin editing behavior with persistent storage

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

// In-memory storage for fallback data (persists during server session)
let fallbackProjects = [...DEFAULT_FALLBACK_PROJECTS];

export function getFallbackProjects() {
  // Return the current fallback projects (with any updates applied)
  return fallbackProjects.map(project => ({
    ...project,
    startDate: project.startDate ? new Date(project.startDate) : null,
    endDate: project.endDate ? new Date(project.endDate) : null,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt)
  }));
}

export function saveFallbackProjects(projects) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('raagsan-projects', JSON.stringify(projects));
  }
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
  return true;
}
