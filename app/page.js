import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Project";
import Link from 'next/link';

export default async function HomePage() {
  let projects = [];
  
  try {
    const connection = await dbConnect();
    if (connection) {
      projects = await Project.find({ visible: true }).sort({ order: 1, createdAt: -1 }).lean();
    } else {
      // Use fallback data when MongoDB is not available
      const { getFallbackProjects } = await import('@/lib/fallbackData');
      projects = getFallbackProjects().filter(p => p.visible);
    }
  } catch (error) {
    console.warn('Database error, using fallback data:', error.message);
    // Use fallback data when there's an error
    const { getFallbackProjects } = await import('@/lib/fallbackData');
    projects = getFallbackProjects().filter(p => p.visible);
  }

  return (
    <>
      {/* Who We Are Section */}
      <section className="homepage-section">
        <div className="container">
          <div className="who-we-are-section">
            <div className="who-we-are-header">
              <h3 className="who-we-are-title">Who we are</h3>
              <div className="who-we-are-line"></div>
            </div>
            <h2 className="who-we-are-main-title">
              We Provide Strategic and<br />
              Analytical Consulting Services<br />
              across Somalia.
            </h2>
            <div className="services-grid">
              <Link href="https://raagsan.com/monitoring-learning-and-accountability/" target="_blank" rel="noopener noreferrer" className="service-item">
                <div className="service-icon">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <span className="service-text">Monitoring, Validation and Learning</span>
              </Link>
              <Link href="https://raagsan.com/policies-strategy-support/" target="_blank" rel="noopener noreferrer" className="service-item">
                <div className="service-icon">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="service-text">Institutional Systems Building and Governance</span>
              </Link>
              <Link href="https://raagsan.com/daadihiye-citizen-engagement/" target="_blank" rel="noopener noreferrer" className="service-item">
                <div className="service-icon">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-2.01A2.5 2.5 0 0 0 8 8H5.46c-.8 0-1.54.37-2.01.99L1 15.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 9.46 8H12c.8 0 1.54.37 2.01.99L16 11l1.99-2.01A2.5 2.5 0 0 1 20 8h2.54c.8 0 1.54.37 2.01.99L27 15.5V22h-7z"/>
                  </svg>
                </div>
                <span className="service-text">Daadihiye Citizen Engagement</span>
              </Link>
              <Link href="https://raagsan.com/managing-field-research/" target="_blank" rel="noopener noreferrer" className="service-item">
                <div className="service-icon">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                  </svg>
                </div>
                <span className="service-text">Data Production and Management</span>
              </Link>
              <Link href="https://raagsan.com/data-collection-and-analytics/" target="_blank" rel="noopener noreferrer" className="service-item">
                <div className="service-icon">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
                <span className="service-text">Participatory Action Research</span>
              </Link>
            </div>
            
            <div className="cta-row">
              <Link className="btn btn-fill" href="#projects">Explore Our Projects</Link>
              <Link className="btn btn-ghost" href="https://raagsan.com" target="_blank" rel="noopener noreferrer">Visit Main Site</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="homepage-section">
        <div className="container">
          <div className="who-we-are-section text-center">
            <div className="who-we-are-header">
              <h3 className="who-we-are-title">Our Projects</h3>
              <div className="who-we-are-line"></div>
            </div>
            <h2 className="who-we-are-main-title">
              Stories of Community Resilience<br />
              and Collaborative Change
            </h2>
            <p className="homepage-text text-lg max-w-2xl mx-auto mb-8">
              Each project tells a unique story of community resilience, policy impact, and collaborative change.
            </p>

            {projects.length === 0 ? (
              <div className="text-center py-16">
                <div className="homepage-card max-w-md mx-auto">
                  <h3 className="homepage-h3 mb-4">No projects yet</h3>
                  <p className="homepage-text mb-6">Create your first project to start telling stories that matter.</p>
                  <Link href="/admin" className="btn btn-fill">
                    Create Project
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {projects.map((project) => (
                  <Link
                    key={project._id}
                    href={`/projects/${project.slug}`}
                    className="homepage-project-card group"
                  >
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
                        <span className={`project-status ${project.status === 'published' ? 'published' : 'draft'}`}>
                          {project.status}
                        </span>
                        <span className="project-date">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

             {/* About Section */}
             <section id="about" className="homepage-section">
               <div className="container">
                 <div className="who-we-are-section text-center">
                   <div className="who-we-are-header">
                     <h3 className="who-we-are-title">About Raagsan</h3>
                     <div className="who-we-are-line"></div>
                   </div>
                   <h2 className="who-we-are-main-title">
                     Strategic and Analytical Consulting<br />
                     Services across Somalia
                   </h2>
                   <p className="homepage-text text-lg mb-8">
                     RAAGSAN is a social enterprise providing strategic and analytical consulting services across Somalia.
                   </p>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                     <div className="about-stat text-center">
                       <div className="homepage-stat-number">60+</div>
                       <div className="homepage-stat-label">Districts</div>
                     </div>
                     <div className="about-stat text-center">
                       <div className="homepage-stat-number">80+</div>
                       <div className="homepage-stat-label">Projects</div>
                     </div>
                     <div className="about-stat text-center">
                       <div className="homepage-stat-number">100+</div>
                       <div className="homepage-stat-label">Communities</div>
                     </div>
                     <div className="about-stat text-center">
                       <div className="homepage-stat-number">50,000+</div>
                       <div className="homepage-stat-label">Interviews</div>
                     </div>
                   </div>
                 </div>
               </div>
             </section>
    </>
  );
}


< ! - -   D e p l o y m e n t   t r i g g e r   1 0 / 0 8 / 2 0 2 5   0 1 : 2 5 : 5 6   - - >  
 