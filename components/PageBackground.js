'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function PageBackground() {
  const pathname = usePathname();
  const isProjectPage = pathname.startsWith('/projects/') && pathname !== '/projects';
  
  useEffect(() => {
    if (isProjectPage) {
      document.body.classList.add('project-page');
    } else {
      document.body.classList.remove('project-page');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('project-page');
    };
  }, [isProjectPage]);
  
  return (
    <div className="page-bg" aria-hidden="true"></div>
  );
}
