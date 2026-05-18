'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Select all elements that have our custom scroll reveal transition classes
    const revealClasses = ['.reveal-on-scroll', '.reveal-scale', '.reveal-left', '.reveal-right'];
    const selector = revealClasses.join(', ');
    
    // Query elements
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) return;

    // Use Intersection Observer for highly efficient, premium native scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is now visible! Add reveal class
            entry.target.classList.add('reveal-visible');
            // Unobserve so animation runs once smoothly
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05, // Trigger as soon as 5% of the element is visible
        rootMargin: '0px 0px -60px 0px', // Trigger slightly before it enters fully for responsiveness
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [pathname]); // Re-run when client navigates to a new page to bind new elements!

  return null; // This component runs purely as a side-effect manager!
}
