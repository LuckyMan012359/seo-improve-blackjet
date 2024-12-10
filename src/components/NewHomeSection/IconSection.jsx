import { useMediaQuery } from '@mui/material';
import { useBlackJetContext } from 'context/OnboardingContext';
import usePwaNavigation from 'Hook/usePwaNavigation';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PWA_REDIRECTION_LINK, ROUTE_LIST } from 'routes/routeList';
import { goToTop, isDesktopFooterValidRoute } from 'utils';

/**
 * IconSection renders the footer section of the home page which contains the black jet logo, social media links, and a FAQs link.
 *
 * @returns {React.ReactElement} The footer section of the home page.
 */
const IconSection = () => {
  const navigate = useNavigate();
  const { redirect, isPwa } = usePwaNavigation();
  const isMobile = useMediaQuery('(max-width: 699px)');

  const { onboardingForms } = useBlackJetContext();

  const { faqsLocationIds = [] } = onboardingForms?.savedLocation || {};

  /**
   * handleFAQ navigates to the FAQs page based on the user's platform.
   * If the user is on a PWA, then it redirects to the PWA's FAQs page.
   * If the user is not on a PWA, then it navigates to the website's FAQs page.
   */
  const handleFAQ = () => {
    if (isPwa) {
      //When user /app mean he is using pwa then redirect to pwa
      redirect(PWA_REDIRECTION_LINK.FAQ);
      return;
    }
    navigate(ROUTE_LIST.FAQ);
  };

  return (
    <div>
      <div className='social-media-wrap'>
        <Link to='/' onClick={goToTop}>
          {' '}
          <img className='brand-logo' src='/images/img_television.svg' alt='' />
        </Link>
        <div className='social-wrap'>
          <ul>
            <li>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://www.facebook.com/joinBlackJet'
              >
                <img src='/images/img_socialiconfacebook.svg' alt='' />
              </a>
            </li>
            <li>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://www.linkedin.com/company/joinblackjet'
              >
                <img src='/images/img_iconlinkedin.svg' alt='' />
              </a>
            </li>
            <li>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://www.instagram.com/joinblackjet'
              >
                <img src='/images/img_socialiconinstagram.svg' alt='' />
              </a>
            </li>
            <li>
              <a target='_blank' rel='noopener noreferrer' href='https://x.com/joinBlackJet'>
                <img src='/images/img_socialicontwitter.svg' alt='' />
              </a>
            </li>
          </ul>
        </div>

        <div onClick={handleFAQ} className='option-text'>
          <div className='faq-link-wrap'>
            {/* {(isMobileValidRoute(faqsLocationIds) ) && ( */}
            {isMobile && (
              <>
                <p>FAQs </p>
                <img src='/images/img_arrowright.svg' alt='' />
              </>
            )}

            {!isMobile && isDesktopFooterValidRoute(faqsLocationIds) && (
              <>
                <p>FAQs </p>
                <img src='/images/img_arrowright.svg' alt='' />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconSection;
