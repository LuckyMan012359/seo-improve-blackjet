// import { useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
// import { ROUTE_LIST } from 'routes/routeList';

/**
 * Layout for the phone onboarding screens.
 *
 * This component renders the Outlet and an optional Legal component at the bottom.
 * The Legal component is only rendered if the user is on a mobile device and the
 * current route is the phone onboarding route.
 * @component
 */
const PhoneOnboardingLayout = () => {
  // const isMobile = useMediaQuery('(max-width:699px)');
  // const location = useLocation();
  return (
    <>
      <Outlet />
    </>
  );
};

export default PhoneOnboardingLayout;
