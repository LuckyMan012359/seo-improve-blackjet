import React, { useState } from 'react';
import CommonButton from 'components/formcomponents/CommonButton';
import { useBlackJetContext } from 'context/OnboardingContext';
import { CHANGE_PREORDER_STATUS } from 'constants/actions';
import useOutsideClick from 'Hook/useOutsideClick';
import Share from 'components/share/Share';
import { useNavigate } from 'react-router-dom';
import { Entermobilegetapp } from 'components/Popup';

import { useMediaQuery } from '@mui/material';
import useIsMobile from 'Hook/useIsMobile';
import Landscape from 'components/phoneonboarding/Landscape';
import { ROUTE_LIST } from 'routes/routeList';

/**
 * Profile component
 *
 * This component renders the profile page.
 *
 * @returns {React.ReactNode} The Profile component
 * @example
 * <Profile />
 */
const Profile = () => {
  const [type, setType] = useState('reusable');

  const navigate = useNavigate();
  const orientation = useMediaQuery('(orientation: portrait)');
  const isMobile = useIsMobile();
  const { onboardingForms, dispatchOnboardingForms } = useBlackJetContext();
  const details = onboardingForms?.membershipData;

  useOutsideClick('share-btn', () => {
    const element = document.getElementById('share-btn');
    if (element) {
      if (element.classList.contains('open')) {
        element.classList.toggle('open');
      }
    }
  });

  /**
   * Handles the free preview click event.
   *
   * Navigates to the phone onboarding route and sets the pre-order status to false.
   */
  const handleFreePreview = () => {
    // toggleDrawer()
    navigate(ROUTE_LIST.PHONE_ONBOARDING);
    dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: false });
  };
  /**
   * Handles the become a member click event.
   *
   * Navigates to the phone onboarding route and sets the pre-order status to true.
   */
  const handleBecomeMember = () => {
    // toggleDrawer()
    navigate(ROUTE_LIST.PHONE_ONBOARDING);
    dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: true });
  };

  /**
   * Handles the tooltip open event.
   *
   * Finds the element with id tooltip-item and toggles the open class on click.
   */
  const handleTooltipOpen = () => {
    const element = document.getElementById('tooltip-item');
    if (element) {
      element.classList.toggle('open');
    }
  };

  /**
   * Handles the share button click event.
   *
   * Tries to use the navigator.share API to share the app's URL.
   * If the API is not supported, logs the error to the console.
   */
  const handleShare = async () => {
    // const element = document.getElementById("share-btn")
    // if (element) {
    //   element.classList.toggle("open");
    // }
    // async () => {
    try {
      if (navigator.share && typeof navigator.share === 'function') {
        await navigator.share({
          title: 'Black Jet Australia ',
          text: 'Black Jet Australia!',
          url: 'https://blackjet.au',
        });
      }
    } catch (error) {
      console.error('Unsupported', error);
    }
    // }
  };

  /**
   * Handles the reusable button click event.
   *
   * Sets the type state to reusable and toggles the tooltip.
   */
  const handleReusableClick = () => {
    setType('reusable');
    handleTooltipOpen();
  };

  /**
   * Handles the guest button click event.
   *
   * Sets the type state to guest and toggles the tooltip.
   */
  const handleGuestClick = () => {
    setType('guest');
    handleTooltipOpen();
  };

  if (!orientation && isMobile) {
    return <Landscape />;
  }

  return (
    <>
      <Entermobilegetapp />
      <div className='mob-profile-wrap'>
        <div className='profile-image'>
          <img src='/images/generic-user.svg' alt='generic-user' />
        </div>
        <div className='create-account-chip'>
          <span onClick={handleFreePreview}>Create a free account</span>
        </div>
        <div className='booking-passes-wrap'>
          <div className='booking-pass-card'>
            <p> Reusable Bookings</p>
            <div className='available-flights'>
              <p>
                <img
                  className='flight-search-icon'
                  src='/images/flight-icon.svg'
                  alt='flight-icon'
                />{' '}
                0
              </p>{' '}
              <span> of 0 available</span>
            </div>
            <div className='tooltip-text'>
              <img
                src='/images/tooltip-icon.svg'
                onClick={handleReusableClick}
                alt='tooltip-icon'
              />
            </div>
          </div>
          <div className='booking-pass-card guest-card'>
            <p>Guest Passes</p>
            <div className='available-flights'>
              <p>
                <img
                  className='flight-search-icon'
                  src='/images/guest-users.svg'
                  alt='guest-users'
                />{' '}
                0
              </p>{' '}
              <span>
                AWARDED EVERY <br /> 3 MONTHS
              </span>
            </div>
            <div className='tooltip-text'>
              <img src='/images/tooltip-icon.svg' onClick={handleGuestClick} alt='tooltip-icon' />
            </div>
          </div>
        </div>
        <div id={'tooltip-item'} className='open-tooltip'>
          <div className='close-tool-tip'>
            {' '}
            <img src='/images/close-icon.svg' onClick={handleTooltipOpen} alt='close-icon' />{' '}
          </div>
          <p className='tooltip-heading'>
            <img src='/images/tooltip-icon.svg' alt='tooltip-icon' />{' '}
            {type === 'reusable' ? 'Reusable Booking' : 'Guest Passes'}
          </p>
          {type === 'reusable' ? (
            <>
              <span>Each</span> Reusable Booking <span> allows you to</span> reserve <span>a</span>{' '}
              flight <span>and can be</span> reused unlimited number <span>of times</span>. After{' '}
              <span>each</span> flight, <span>the Reusable Booking immediately becomes</span>{' '}
              available <span>again to</span> book another flight.
            </>
          ) : (
            <span>
              Guest Passes are single-use tickets enabling you to bring a guest on your flight.
              However, the Guest Pass is more than a ticket—it's an emblem of the Black Jet prestige
              you can share. <br /> <br />
              Every three months a complementary Guest Pass is reserved for you, letting you
              introduce a chosen one to the echelons of our community. With an active Black Jet
              membership, your yet-to-be-used Guest Passes never expire.
            </span>
          )}
        </div>
        <div className='membner-wrap-btn'>
          <div role='button' className='become-btn-wrap' onClick={handleBecomeMember}>
            <div className='member-btn-group '>
              <span> What is your time and ease worth?</span>
              <CommonButton
                text={
                  <div className='flex items-center justify-evenly w-full'>
                    <img src='/images/Black Jet Logo.svg' alt='blackjet logo' />
                    {!details?.preOrder ? 'Become a member' : 'Pre-order now'}
                    {/* Become a member */}
                  </div>
                }
                type='submit'
              />
            </div>
            <div className='right-arrow'>
              <img src='/images/Chevron.svg' alt='Chevron' />
            </div>
          </div>
          <div className='become-btn-wrap' role='button' onClick={handleFreePreview}>
            <div className='member-btn-group'>
              <span>
                <img alt='Login' src='/images/login_icon.svg' /> Log in
              </span>
            </div>
            <div className='right-arrow'>
              <img src='/images/Chevron.svg' alt='Chevron' />
            </div>
          </div>
        </div>
        <div className='membner-wrap-btn'>
          <div className='become-btn-wrap share-btn'>
            <div className='member-btn-group'>
              <span>Share with a friend!</span>
              <CommonButton
                onClick={handleShare}
                text={
                  <>
                    <img src='/images/Share.svg' alt='share icon' /> Share
                  </>
                }
                type='submit'
              />
            </div>
          </div>
        </div>
        <Share />
      </div>
    </>
  );
};

export default Profile;
