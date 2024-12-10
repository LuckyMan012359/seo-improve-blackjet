import useOutsideClick from 'Hook/useOutsideClick';

import { CHANGE_PREORDER_STATUS } from 'constants/actions';
import OnboardingContext, { useBlackJetContext } from 'context/OnboardingContext';
import { handleAboutSlide, handleContactSlide, handleFaqSlide, handleFooterNavbar } from 'helpers';
import React, { memo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTE_LIST } from 'routes/routeList';
import { isMobileValidRoute } from 'utils';
const FooterNavbar = () => {
  const navigate = useNavigate();
  const { dispatchOnboardingForms } = useContext(OnboardingContext);

  const { onboardingForms } = useBlackJetContext();
  const {
    aboutUsLocationIds = [],
    // careersLocationIds = [],
    contactUsLocationIds = [],
    faqsLocationIds = [],
    // investorsLocationIds = [],
    legalLocationIds = [],
    // mediaPressLocationIds = [],
    // newsLocationIds = [],
  } = onboardingForms?.savedLocation || {};

  useOutsideClick('footer-navbar-target', () => {
    const item = document.getElementById('footer-navbar-target');
    if (item.classList.contains('slide-in')) {
      handleFooterNavbar();
    }
  });

  const footerLinks = [
    {
      name: 'FAQ',
      icon: '/images/faq_icon.svg',
      allowRoute: isMobileValidRoute(faqsLocationIds),
      function: () => {
        navigate(ROUTE_LIST.FAQ);

        navigatingFunc(handleFaqSlide);
      },
    },
    {
      name: 'Legal',
      icon: '/images/legal_icon.svg',
      allowRoute: isMobileValidRoute(legalLocationIds),
      function: () => {
        // setTimeout(() => {
        navigate(ROUTE_LIST.LEGAL);
        // }, 250);
        // navigatingFunc(handleLegalSlide);
      },
    },
    {
      name: 'Contact us',
      icon: '/images/contact_us_icon.svg',
      allowRoute: isMobileValidRoute(contactUsLocationIds),
      function: () => {
        setTimeout(() => {
          navigate(ROUTE_LIST.CONTACT_US);
        }, 250);
        navigatingFunc(handleContactSlide);
      },
    },
    {
      name: 'About us',
      icon: '/images/about_us_icon.svg',
      allowRoute: isMobileValidRoute(aboutUsLocationIds),
      function: () => {
        setTimeout(() => {
          navigate('/aboutus');
        }, 250);
        navigatingFunc(handleAboutSlide);
      },
    },
    {
      name: 'Login',
      icon: '/images/login_icon.svg',
      allowRoute: true,
      function: () => handleFreePreview(),
    },
  ];

  const navigatingFunc = (func) => {
    setTimeout(() => {
      func(true);
      handleFooterNavbar();
    }, 1);
  };
  const handleFreePreview = () => {
    // toggleDrawer()
    navigate(ROUTE_LIST.PHONE_ONBOARDING);
    dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: false });
  };

  const handleCreateAccount = () => {
    dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: false });
    handleFooterNavbar();
    // toggleDrawer()
    navigate(ROUTE_LIST.PHONE_ONBOARDING);
  };

  return (
    <div id='footer-navbar-target' className='footer-navbar'>
      <div className='ovelay-footer-menu'></div>
      <div className='close-container'>
        {/* <img src="/images/Close line.svg" alt="close line" /> */}
      </div>
      <div onClick={handleCreateAccount} className='create-account'>
        Create a free account
      </div>
      <div className='footer-links'>
        {footerLinks?.map(
          (link) =>
            link.allowRoute && (
              <div className='links' key={link.name} onClick={() => link.function()}>
                <img alt={link.name} src={link.icon} />
                <span>{link.name}</span>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export default memo(FooterNavbar);
