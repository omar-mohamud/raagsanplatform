'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/components/Toast';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchProjects();
  }, [session, status, router]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timeout to prevent hanging requests - increased to 15 seconds
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Request timeout - aborting fetch');
        controller.abort();
      }, 15000); // Increased to 15 second timeout
      
      const response = await fetch('/api/admin/projects', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const projectsData = await response.json();
        setProjects(projectsData);
      } else {
        // Try to parse JSON error, but fallback to status text if it fails
        try {
          const errorData = await response.json();
          setError(`Failed to fetch projects: ${errorData.error || 'Unknown error'}`);
        } catch (parseError) {
          setError(`Failed to fetch projects: ${response.status} ${response.statusText}`);
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request was aborted due to timeout');
        setError('Request timed out. The server may be slow. Please try again.');
      } else {
        console.error('Network or other error:', err);
        setError('Failed to fetch projects. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const updateProject = async (projectId, updates) => {
    try {
      // Optimistically update the UI first
      setProjects(prevProjects => 
        prevProjects.map(p => 
          p._id === projectId 
            ? { ...p, ...updates, updatedAt: new Date() }
            : p
        )
      );

      const response = await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, updates })
      });

      if (response.ok) {
        const updatedProject = await response.json();
        // Update with the server response to ensure consistency
        setProjects(prevProjects => 
          prevProjects.map(p => p._id === projectId ? updatedProject : p)
        );
        showToast('Changes saved successfully');
      } else {
        // Revert optimistic update on error
        setProjects(prevProjects => 
          prevProjects.map(p => 
            p._id === projectId 
              ? { ...p, ...updates, updatedAt: new Date() } // Keep the update for now
              : p
          )
        );
        
        // Try to parse JSON error, but fallback to status text if it fails
        try {
          const errorData = await response.json();
          showToast(`Failed to save changes: ${errorData.error || 'Unknown error'}`, 'error');
        } catch (parseError) {
          showToast(`Failed to save changes: ${response.status} ${response.statusText}`, 'error');
        }
      }
    } catch (err) {
      showToast('Failed to save changes', 'error');
      console.error('Error updating project:', err);
    }
  };

  const moveProject = async (projectId, direction) => {
    const currentIndex = projects.findIndex(p => p._id === projectId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= projects.length) return;

    // Create new array with swapped projects
    const newProjects = [...projects];
    [newProjects[currentIndex], newProjects[newIndex]] = [newProjects[newIndex], newProjects[currentIndex]];

    // Update local state immediately
    setProjects(newProjects);

    // Update order in database
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: newProjects })
      });

      if (response.ok) {
        showToast('Project order updated');
      } else {
        // Revert on error
        setProjects(projects);
        // Try to parse JSON error, but fallback to status text if it fails
        try {
          const errorData = await response.json();
          showToast(`Failed to update order: ${errorData.error || 'Unknown error'}`, 'error');
        } catch (parseError) {
          showToast(`Failed to update order: ${response.status} ${response.statusText}`, 'error');
        }
      }
    } catch (err) {
      // Revert on error
      setProjects(projects);
      showToast('Failed to update order', 'error');
      console.error('Error updating order:', err);
    }
  };


  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#035F87] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Toast Notification */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />


               {/* Main Content */}
               <main className="container py-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={fetchProjects} 
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Retry
                </button>
                <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Project Management Section */}
        <section>
          <div className="who-we-are-section">
            <div className="who-we-are-header">
              <h3 className="who-we-are-title">Project Management</h3>
              <div className="who-we-are-line"></div>
            </div>
            <h2 className="who-we-are-main-title">
              Manage Your Content<br />
              and Projects
            </h2>

          {/* Projects Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 max-w-6xl mx-auto">
            {projects.map((project, index) => (
              <div key={project._id} className="homepage-project-card admin-project-card group cursor-pointer" onClick={() => window.open(`/projects/${project.slug}`, '_blank')}>
                {project.heroImage && (
                  <div className="project-image">
                    <img
                      src={project.heroImage}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="project-overlay"></div>
                  </div>
                )}
                <div className="project-content">
                  <h3 className="homepage-project-title">
                    {project.title}
                  </h3>
                  {project.summary && (
                    <p className="homepage-project-summary">
                      {project.summary}
                    </p>
                  )}
                  <div className="project-meta">
                    <span className={`status-badge ${project.status === 'published' ? 'published' : 'draft'}`}>
                      {project.status}
                    </span>
                    <span className="date-text">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Admin Controls */}
                  <div className="admin-controls mt-0 space-y-2" onClick={(e) => e.stopPropagation()}>
                    {/* Status and Visibility */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-white mb-1">Status</label>
                        <select
                          value={project.status}
                          onChange={(e) => updateProject(project._id, { status: e.target.value })}
                          className="w-full"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-white mb-1">Visibility</label>
                        <select
                          value={project.visible ? 'show' : 'hide'}
                          onChange={(e) => updateProject(project._id, { visible: e.target.value === 'show' })}
                          className="w-full"
                        >
                          <option value="show">Show</option>
                          <option value="hide">Hide</option>
                        </select>
                      </div>
                    </div>

                    {/* Date Pickers */}
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-semibold text-white mb-1">Start Date</label>
                        <input
                          type="date"
                          value={project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => updateProject(project._id, { startDate: e.target.value ? new Date(e.target.value) : null })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-white mb-1">End Date</label>
                        <input
                          type="date"
                          value={project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => updateProject(project._id, { endDate: e.target.value ? new Date(e.target.value) : null })}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/20">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveProject(project._id, 'up')}
                          disabled={index === 0}
                          className="px-3 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ↑ Move Up
                        </button>
                        <button
                          onClick={() => moveProject(project._id, 'down')}
                          disabled={index === projects.length - 1}
                          className="px-3 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ↓ Move Down
                        </button>
                      </div>
                      <button
                        onClick={() => updateProject(project._id, {})}
                        className="bg-[#035F87] text-white rounded-md px-4 py-2 text-sm hover:bg-[#046E9C] transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects found.</p>
            </div>
          )}
          </div>
        </section>
      </main>


    </div>
  );
}