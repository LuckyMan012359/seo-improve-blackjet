import { LinearProgress, useMediaQuery } from '@mui/material';
import useScrollToTop from 'Hook/useScrollToTop';

import Footer from 'components/Footer';
import FooterNavbar from 'components/Footer/FooterNavbar';
import Header from 'components/Header';
import { useBlackJetContext } from 'context/OnboardingContext';
import NotFound from 'pages/NotFound';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ROUTE_LIST } from 'routes/routeList';
import { isDesktopValidRoute, isMobileValidRoute } from 'utils';

/**
 * CommonLayout component
 *
 * This component renders the Header, Footer, FooterNavbar and the content of the page.
 * It also handles the logic of showing/hiding the Header and Footer based on the current route.
 *
 * @param {boolean} open - prop to control the state of the header
 * @param {function} setOpen - function to set the state of the header
 * @returns {ReactElement} - the rendered component
 */
const CommonLayout = ({ open, setOpen, ...props }) => {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:699px)');
  const pathname = location.pathname;
  useScrollToTop();

  const isShowHeaderFooter = () => {
    if (
      isMobile &&
      (pathname === ROUTE_LIST.FAQ ||
        pathname === ROUTE_LIST.LEGAL ||
        pathname === ROUTE_LIST.CONTACT_US ||
        pathname === ROUTE_LIST.ABOUT_US ||
        pathname === ROUTE_LIST.PHONE_ONBOARDING)
    ) {
      return false;
    }
    return true;
  };

  return (
    <>
      <div style={{ display: isShowHeaderFooter() ? 'block' : 'none' }}>
        {<Header open={open} setOpen={setOpen} />}
      </div>
      <div className={`${isMobile && 'min-h-screen bg-transparent'}`}>
        {isMobile ? <MobileLayout /> : <DesktopLayout />}
      </div>

      {isShowHeaderFooter() && <Footer />}
      <FooterNavbar />
    </>
  );
};

const MobileLayout = () => {
  const location = useLocation();
  const { onboardingForms } = useBlackJetContext();
  const {
    aboutUsLocationIds = [],
    careersLocationIds = [],
    contactUsLocationIds = [],
    // faqsLocationIds = [],
    investorsLocationIds = [],
    // legalLocationIds = [],
    mediaPressLocationIds = [],
    newsLocationIds = [],
  } = onboardingForms?.savedLocation || {};
  const pathname = location.pathname;

  const isRoutesVisibleMobile = () => {
    switch (pathname) {
      case ROUTE_LIST.ABOUT_US:
        return isMobileValidRoute(aboutUsLocationIds);
      case ROUTE_LIST.CAREERS:
        return isMobileValidRoute(careersLocationIds);
      case ROUTE_LIST.CONTACT_US:
        return isMobileValidRoute(contactUsLocationIds);
      // case ROUTE_LIST.FAQ:
      //   return isMobileValidRoute(faqsLocationIds);
      case ROUTE_LIST.INVESTORS:
        return isMobileValidRoute(investorsLocationIds);
      // case ROUTE_LIST.LEGAL:
      //   return isMobileValidRoute(legalLocationIds);
      case ROUTE_LIST.MEDIA:
        return isMobileValidRoute(mediaPressLocationIds);
      case ROUTE_LIST.NEWS:
        return isMobileValidRoute(newsLocationIds);
      default:
        return true;
    }
  };

  console.log(onboardingForms?.savedLocation, 'onBoarding_form');

  if (!onboardingForms?.savedLocation) {
    return (
      <div className='loader-wrap-editor'>
        <LinearProgress color='#000' />
      </div>
    );
  }
  return isRoutesVisibleMobile() ? (
    <Outlet />
  ) : (
    <>
      <Header open={false} setOpen={() => {}} />
      <NotFound />
      <Footer />
    </>
  );
};

const DesktopLayout = () => {
  const location = useLocation();
  const { onboardingForms } = useBlackJetContext();
  const {
    aboutUsLocationIds = [],
    careersLocationIds = [],
    contactUsLocationIds = [],
    faqsLocationIds = [],
    investorsLocationIds = [],
    legalLocationIds = [],
    mediaPressLocationIds = [],
    newsLocationIds = [],
  } = onboardingForms?.savedLocation || {};
  const pathname = location.pathname;

  const isRoutesVisibleDesktop = () => {
    switch (pathname) {
      case ROUTE_LIST.ABOUT_US:
        return isDesktopValidRoute(aboutUsLocationIds);
      case ROUTE_LIST.CAREERS:
        return isDesktopValidRoute(careersLocationIds);
      case ROUTE_LIST.CONTACT_US:
        return isDesktopValidRoute(contactUsLocationIds);
      case ROUTE_LIST.FAQ:
        return isDesktopValidRoute(faqsLocationIds);
      case ROUTE_LIST.INVESTORS:
        return isDesktopValidRoute(investorsLocationIds);
      case ROUTE_LIST.LEGAL:
        return isDesktopValidRoute(legalLocationIds);
      case ROUTE_LIST.MEDIA:
        return isDesktopValidRoute(mediaPressLocationIds);
      case ROUTE_LIST.NEWS:
        return isDesktopValidRoute(newsLocationIds);
      default:
        return true;
    }
  };
  console.log(onboardingForms?.savedLocation, 'onBoarding_form');
  if (!onboardingForms?.savedLocation) {
    return (
      <div className='loader-wrap-editor'>
        <LinearProgress color='#000' />
      </div>
    );
  }
  return isRoutesVisibleDesktop() ? <Outlet /> : <NotFound />;
};

export default CommonLayout;
