import React, { lazy, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Loadable from 'components/Loadable';

import NotFound from 'pages/NotFound';

import Careers from 'pages/careers/Careers';
import JobPage from 'pages/jobpage/JobPage';
import OnboardingEmail from 'components/onboarding/OnboardingEmail';
import BasicInfo from 'components/onboarding/BasicInfo';
import PreorderPeriod from 'components/onboarding/PreorderPeriod';
import PhoneRecognized from 'components/onboarding/PhoneRecognized';
import PaymentMethod from 'components/onboarding/PaymentMethod';
import NewsArticle from 'components/newsarticle/NewsArticle';
import Media from 'components/media/Media';
import Invester from 'components/invester/Invester';
import EmailToPhone from 'components/onboarding/EmailToPhone';

import MembershipSelection from 'components/onboarding/MembershipSelection';
import CommonLayout from 'layouts/CommonLayout';
import OnboardingLayout from 'layouts/OnboardingLayout';
import FullScreen from 'components/Adaywithblack/FullScreen';
import Profile from 'pages/ProfilePage/Profile';
import PhoneOnboarding from 'components/phoneonboarding/PhoneOnboarding';
import PhoneOnboardingLayout from 'layouts/PhoneOnboardingLayout';
import { AnimatePresence } from 'framer-motion';
import ChatBox from 'components/Footer/ChatBox';
import AboutUs from 'pages/aboutus/AboutUs';
import Faq from 'pages/faq/Faq';
import Legal from 'pages/legal/Legal';
import GetContact from 'pages/getcontact/GetContact';
import Home from 'pages/Home';

import { ROUTE_LIST } from 'routes/routeList';
import PwaAppLayout from 'layouts/PwaAppLayout';
import EmailVerificationPass from 'pages/emailVerification/EmailVerificationPass';
import EmailVerificationFail from 'pages/emailVerification/EmailVerificationFail';

const Virtualview = Loadable(lazy(() => import('components/Virtualview')));
const Booking = Loadable(lazy(() => import('pages/Booking/Booking')));
const MapAnimation = Loadable(lazy(() => import('components/Svgs')));

const MemoHomeApp = Loadable(lazy(() => import('pages/Home')));
const SharedFlight = Loadable(lazy(() => import('pages/sharedFlight')));

const ProjectRoutes = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return (
    <AnimatePresence mode='wait' initial={false}>
      <ChatBox />

      <Routes location={location} key={location.pathname}>
        {/* this app home route is for web app mobile PWA not for current web */}
        <Route element={<PwaAppLayout />}>
          <Route path={ROUTE_LIST.APP_HOME} element={<MemoHomeApp />} />
        </Route>

        <Route element={<CommonLayout open={open} setOpen={setOpen} />}>
          <Route path={ROUTE_LIST.HOME} element={<Home />} />
          <Route path={ROUTE_LIST.FAQ} element={<Faq />} />
          <Route path={ROUTE_LIST.LEGAL} element={<Legal />} />
          <Route path={ROUTE_LIST.CONTACT_US} element={<GetContact />} />
          <Route path={ROUTE_LIST.CAREERS} element={<Careers />} />
          <Route path={ROUTE_LIST.JOB_PAGE} element={<JobPage />} />
          <Route path={ROUTE_LIST.ABOUT_US} element={<AboutUs />} />
          <Route path={ROUTE_LIST.NEWS} element={<NewsArticle />} />
          <Route path={ROUTE_LIST.MEDIA} element={<Media />} />
          <Route path={ROUTE_LIST.INVESTORS} element={<Invester />} />
          <Route path={ROUTE_LIST.PROFILE} element={<Profile />} />
          <Route path={ROUTE_LIST.BOOKING} element={<Booking open={open} setOpen={setOpen} />} />

          <Route path={ROUTE_LIST.EMAIL_VERIFICATION_PASS} element={<EmailVerificationPass />} />
          <Route path={ROUTE_LIST.EMAIL_VERIFICATION_FAIL} element={<EmailVerificationFail />} />
          <Route path={ROUTE_LIST.SHARED_FLIGHT} element={<SharedFlight />} />
          <Route path='*' element={<NotFound />} />
        </Route>
        <Route element={<OnboardingLayout />}>
          <Route path={ROUTE_LIST.EMAIL_ADDRESS} element={<OnboardingEmail />} />
          <Route path={ROUTE_LIST.COMPENDIUM} element={<BasicInfo />} />
          <Route path={ROUTE_LIST.GRATIAS_TIBI_AGO} element={<PreorderPeriod />} />
          <Route path={ROUTE_LIST.SMART_FIELD} element={<PhoneRecognized />} />
          <Route path={ROUTE_LIST.REFER} element={<PhoneRecognized />} />
          <Route path={ROUTE_LIST.GUEST_INVITE} element={<PhoneRecognized />} />
          <Route path={ROUTE_LIST.REFINED_SELECTION} element={<MembershipSelection />} />
          <Route path={ROUTE_LIST.PHONE_NUMBER} element={<EmailToPhone />} />
          <Route path={ROUTE_LIST.AT_YOUR_CONVENIENCE} element={<PaymentMethod />} />
          <Route path={ROUTE_LIST.A_DAY_WITH_BLACKJET} element={<FullScreen />} />
        </Route>
        <Route element={<PhoneOnboardingLayout />}>
          <Route path={ROUTE_LIST.REFER} element={<PhoneOnboarding />} />
          <Route path={ROUTE_LIST.GUEST_INVITE} element={<PhoneOnboarding />} />
          <Route path={ROUTE_LIST.PHONE_ONBOARDING} element={<PhoneOnboarding />} />
        </Route>
        <Route path={ROUTE_LIST.VIRTUAL_VIEW} element={<Virtualview />} />
        <Route path={ROUTE_LIST.MOBILE_ANIMATION} element={<MapAnimation isRoute={true} />} />
      </Routes>
    </AnimatePresence>
  );
};
export default ProjectRoutes;
