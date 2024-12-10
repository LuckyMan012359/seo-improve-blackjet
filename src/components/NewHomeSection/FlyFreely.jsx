import { useMediaQuery } from '@mui/material';
import DownArrow from 'components/Home/DownArrow';
import CommonButton from 'components/formcomponents/CommonButton';
import { CHANGE_PREORDER_STATUS } from 'constants/actions';
import OnboardingContext from 'context/OnboardingContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import screenShotJet from './screenShotJet.png';
import { PWA_REDIRECTION_LINK, ROUTE_LIST } from 'routes/routeList';
import usePwaNavigation from 'Hook/usePwaNavigation';
import { flyFreelyVideo } from 'assets';

// import useLowPowerModeEnabled from 'Hook/useLowPowerModeEnabled';

/**
 * Component for the "Fly freely" section of the home page.
 * Includes a looping video, a heading, a paragraph, and a call-to-action button.
 * The video will only play if the browser supports it, and will be
 * replaced with a screenshot if not.
 * The call-to-action button is only shown if the user has not yet pre-ordered.
 * If the user has pre-ordered, the button will be replaced with a message saying
 * "Thank you for your interest in BlackJet. We will be in touch soon."
 *
 * @returns {React.ReactElement} The JSX element for the "Fly freely" section.
 */
const FlyFreely = () => {
  const isMobile = useMediaQuery('(max-width : 699px)');
  const navigate = useNavigate();
  const videoCurrent = useRef(null);
  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);
  const details = onboardingForms?.membershipData;
  // const isLowPower = useLowPowerModeEnabled();

  const [showVideo, setShowVideo] = useState(false);
  const { redirect, isPwa } = usePwaNavigation();
  // console.log(isPwa, 'this_is_pwaNavigate');

  /**
   * Handles the pre-order click event.
   * Dispatches the CHANGE_PREORDER_STATUS action, then navigates to the appropriate
   * route depending on whether the user is on a mobile device or not.
   * If the user is on a mobile device, will navigate to the phone onboarding route.
   * If the user is not on a mobile device, will navigate to the smart field route with the
   * pre-order type as a query parameter.
   */
  const handlePreOrder = () => {
    dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: true });
    if (isPwa) {
      //When user /app mean he is using pwa then redirect to pwa
      redirect(PWA_REDIRECTION_LINK.MEMBERSHIP);
      return;
    }
    if (isMobile) {
      navigate(ROUTE_LIST.PHONE_ONBOARDING);
    } else {
      navigate(`${ROUTE_LIST.SMART_FIELD}?type=pre-order`);
    }
  };

  /**
   * Handles the canplay event of the video element.
   * Tries to play the video, and if successful, sets the showVideo state to true.
   * If an error occurs, sets showVideo to false.
   */
  const handleCanPlay = async () => {
    try {
      if (videoCurrent.current) {
        await videoCurrent.current?.play();
        setShowVideo(true);
      }
    } catch (error) {
      console.log(error);
      setShowVideo(false);
    }
  };

  /**
   * Handles the play event of the video element.
   * Sets the showVideo state to true, and sets the opacity of the video element to 0.4
   * to indicate that the video is playing.
   */
  const handlePlay = () => {
    setShowVideo(true);
    videoCurrent.current.style.opacity = 0.4; // Show the video on successful playback
  };

  /**
   * Handles the error event of the video element.
   * Hides the video element to prevent it from showing an error message,
   * and sets the showVideo state to true to trigger the fallback image.
   */
  const handleError = () => {
    videoCurrent.current.style.display = 'none'; // Hide the video on error
    setShowVideo(true);
  };

  /**
   * Handles the suspend event of the video element.
   * If the video is paused due to low power mode, dims the video instead of hiding it,
   * and tries to resume playback. If resuming playback fails, sets the showVideo state to
   * false to trigger the fallback image.
   */
  const handleSuspend = () => {
    if (videoCurrent.current.paused) {
      // Low power mode might have paused the video
      console.warn('Video playback suspended in low power mode');
      videoCurrent.current.style.opacity = 0.4; // Dim the video instead of hiding
      try {
        videoCurrent.current.play();
      } catch (error) {
        console.log('Low_power_mode', error);
        setShowVideo(false);
      }
    }
  };

  useEffect(() => {
    if (videoCurrent && videoCurrent.current) {
      videoCurrent.current.addEventListener('canplay', handleCanPlay);
      videoCurrent.current.addEventListener('play', handlePlay);
      videoCurrent.current.addEventListener('error', handleError);
      videoCurrent.current.addEventListener('suspend', handleSuspend);
    }

    return () => {
      // Cleanup function to remove event listeners
      if (videoCurrent && videoCurrent.current) {
        videoCurrent.current.removeEventListener('canplay', handleCanPlay);
        videoCurrent.current.removeEventListener('play', handlePlay);
        videoCurrent.current.removeEventListener('error', handleError);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        videoCurrent.current.removeEventListener('suspend', handleSuspend);
      }
    };
  }, []);

  return (
    <div>
      <div className='fly-freely relative'>
        <>
          <video
            className='custom-video object-cover w-full h-full opacity-40'
            autoPlay
            loop
            muted
            controlsList='nofullscreen'
            webkit-playsinline
            playsInline
            ref={videoCurrent}
            poster={screenShotJet}
            role='img'
            data-inline-media-loop-to='true'
            data-inline-media-basepath={flyFreelyVideo}
            style={{
              display: showVideo ? 'block' : 'none',
            }}
          >
            <source
              // src={
              //   'https://blackjetstoragebuck.s3.ap-southeast-2.amazonaws.com/1713160165357Black+Jet+Cut+720P+Low+Bitrate+2024.3.mp4'
              // }
              src={flyFreelyVideo}
              type='video/mp4'
              className='custom-video'
            />
          </video>
        </>

        <img
          style={{ display: showVideo ? 'none' : 'block' }}
          className='object-cover w-full h-full opacity-40'
          src={screenShotJet}
          alt='thumb'
        />

        <div className='fly-txt'>
          <p className='main-heading'>
            Fly freely
            <img
              className='object-cover  vector-des w-full h-6'
              src='/images/img_stroke.svg'
              alt='stroke'
            />
            <img
              className='vector-mobile w-full h-6'
              src='/images/vector-mobile.svg'
              alt='stroke'
            />
          </p>
          <p className='second-p '>Unlimited Sydney-Melbourne flights for a flat monthly price</p>
          <div className='top-up-btn'>
            <p className='personal-p' size='txtHauoraBold32'>
              Your Personal Aviation
            </p>
            <CommonButton
              className={'preorder-button mx-auto'}
              text={!details?.preOrder ? 'Become a member' : 'Pre-order now'}
              onClick={handlePreOrder}
            />
          </div>
          <DownArrow />
        </div>
      </div>
    </div>
  );
};

export default FlyFreely;
