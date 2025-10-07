// Reveal sections on load
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.section-reveal');
  sections.forEach(section => {
    section.classList.add('is-visible');
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    // Skip empty hash links
    if (href === '#' || href === '') {
      return;
    }
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
