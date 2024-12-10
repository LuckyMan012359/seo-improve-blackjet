import { useEffect } from 'react';

/**
 * A React component that scrolls to the top of the page with a smooth animation
 * when it is mounted. This is useful for when you want to reset the scroll position
 * when navigating to a new page.
 *
 * @return {null}
 */
const ScrollToTopOnMount = () => {
  useEffect(() => {
    // Scroll to the top of the page with smooth animation on component mount
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []); // Empty dependency array ensures this effect runs only once after component mount

  return null; // Return null as this component doesn't render anything
};

export default ScrollToTopOnMount;
