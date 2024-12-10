import { useLocation } from 'react-router-dom';
import { ROUTE_LIST } from 'routes/routeList';

/**
 * Hook to detect if the user is currently using the PWA.
 * 
 * @returns an object with the following properties:
 * - `redirect`: a function to redirect to a given link. If the user is on a PWA, it will use the 
 *   `window.location.replace` function to replace the current route with the given link.
 *   If the user is not on a PWA, it will use the `useNavigate` hook to navigate to the given link.
 * - `isPwa`: a boolean indicating whether the user is currently using the PWA or not.
 */
export default function usePwaNavigation() {
  const location = useLocation();
  const isPwa = location?.pathname === ROUTE_LIST.APP_HOME;

  const redirect = (link: string) => {
    if (isPwa) {
      // replace to current route
      window.location.replace(link);
      return;
    }
  };

  return {
    redirect,
    isPwa,
  };
}
