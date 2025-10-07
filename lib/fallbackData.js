// Fallback data structure for when MongoDB is not available
// This simulates the same admin editing behavior with local storage

const FALLBACK_PROJECTS = [
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

export function getFallbackProjects() {
  // Always return the static fallback data for server-side usage
  return FALLBACK_PROJECTS;
}

export function saveFallbackProjects(projects) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('raagsan-projects', JSON.stringify(projects));
  }
}

export function updateFallbackProject(projectId, updates) {
  // For server-side usage, just return the updated project data
  const project = FALLBACK_PROJECTS.find(p => p._id === projectId);
  if (project) {
    return { ...project, ...updates, updatedAt: new Date() };
  }
  return null;
}

export function reorderFallbackProjects(newOrder) {
  // For server-side usage, just return success
  // The actual reordering will be handled by the client-side state
  return true;
}
