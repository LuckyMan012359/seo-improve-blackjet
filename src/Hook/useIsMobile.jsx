import { useState, useEffect } from 'react';

/**
 * useIsMobile
 *
 * A React hook that detects whether the application is currently running on a
 * mobile device or not. The detection is based on the presence of certain
 * strings in the User Agent string, and is configurable by modifying the
 * regular expression used in the `isMobileDevice()` function.
 *
 * @returns {boolean} true if the application is running on a mobile device,
 * false otherwise
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;

    const isMobileDevice = () => {
      // Common mobile device characteristics (adjust as needed)
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    };

    setIsMobile(isMobileDevice());

    // Optional: Handle orientation changes and window resize events
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

export default useIsMobile;