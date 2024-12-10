import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to the top of the page with smooth animation on route change.
 *
 * This hook is useful when you want to reset the scroll position of the page
 * when the route changes. It's commonly used in conjunction with the
 * BrowserRouter component from react-router-dom.
 *
 * @returns {void}
 */
const useScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    scrollToTop();
  }, [location.pathname]);
};

export default useScrollToTop;
