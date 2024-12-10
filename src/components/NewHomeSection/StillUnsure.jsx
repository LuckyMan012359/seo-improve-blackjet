import { useMediaQuery } from '@mui/material';
import CommonButton from 'components/formcomponents/CommonButton';
import usePwaNavigation from 'Hook/usePwaNavigation';
import React from 'react';
import {  useNavigate } from 'react-router-dom';
import { PWA_REDIRECTION_LINK, ROUTE_LIST } from 'routes/routeList';

/**
 * StillUnsure
 * @description A component that displays a call to action for users to register.
 * @returns {ReactElement} A div containing the text and a button to navigate to the membership page.
 */
const StillUnsure = () => {
  const isMobile = useMediaQuery('(max-width:699px)');
  const navigate = useNavigate();
  const { redirect, isPwa } = usePwaNavigation();

  const segmentIdentification = isMobile ? ROUTE_LIST.PHONE_ONBOARDING : ROUTE_LIST.SMART_FIELD
  /**
   * Handles the click event for the register button.
   * If the user is on a pwa, redirects to the pwa membership page.
   * If the user is not on a pwa, navigates to the smart field page.
   */
  const handleClick = () => {
    if (isPwa) {
      //When user /app mean he is using pwa then redirect to pwa
      redirect(PWA_REDIRECTION_LINK.MEMBERSHIP);
      return;
    }
    navigate(segmentIdentification)
  }
  return (
    <div>
      <div className='still-unsure-wrap'>
        <h2>
          <span> Still unsure? </span> Register for free <p>and explore the app</p>
        </h2>
        <>
          <CommonButton
            pressedClass='pressed-arrow'
            text={'Create a free account'}
            onClick={handleClick}
            className='dark-btn'
          />
        </>
      </div>
    </div>
  );
};

export default StillUnsure;
