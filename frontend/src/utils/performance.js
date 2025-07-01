// Mobile detection utility
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
};

// Check if device has low performance
export const isLowPerformanceDevice = () => {
  const mobile = isMobile();
  const cores = navigator.hardwareConcurrency || 1;
  const memory = navigator.deviceMemory || 4; // GB
  
  return mobile && (cores <= 2 || memory <= 2);
};

// Throttle function for performance
export const throttle = (func, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

// Debounce function for performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Check if element is in viewport
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name} took ${end - start}ms`);
  }
  
  return result;
};

// Reduce animation complexity on mobile
export const getMobileOptimizedSettings = (desktopSettings) => {
  if (!isMobile()) return desktopSettings;
  
  return {
    ...desktopSettings,
    // Reduce animation complexity
    frameRate: Math.min(desktopSettings.frameRate || 60, 30),
    quality: Math.min(desktopSettings.quality || 1, 0.5),
    // Reduce particle count, animation speed, etc.
    particleCount: Math.floor((desktopSettings.particleCount || 100) * 0.3),
    animationSpeed: (desktopSettings.animationSpeed || 1) * 0.7,
  };
}; 