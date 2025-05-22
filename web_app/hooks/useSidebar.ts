import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSidebarReturn {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
  isAnimating: boolean;
}

export const useSidebar = (): UseSidebarReturn => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMobileSidebar = useCallback(() => {
    setIsAnimating(true);
    setIsMobileOpen(prev => !prev);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar');
      const trigger = document.querySelector('[data-sidebar-trigger]');
      
      if (
        sidebar && 
        !sidebar.contains(event.target as Node) &&
        !trigger?.contains(event.target as Node)
      ) {
        setIsMobileOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isMobileOpen]);

  return {
    isMobileOpen,
    toggleMobileSidebar,
    isAnimating
  };
};