import { useEffect, useRef } from 'react';

export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: options.threshold || 0.1, rootMargin: options.rootMargin || '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useScrollReveal();

  const dirClass = {
    up: 'sr-up',
    down: 'sr-down',
    left: 'sr-left',
    right: 'sr-right',
    scale: 'sr-scale',
  }[direction] || 'sr-up';

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${dirClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
