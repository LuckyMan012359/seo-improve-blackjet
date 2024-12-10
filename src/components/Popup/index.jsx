import React, { useEffect, useState } from 'react';
import './Popup.css';
import CommonButton from 'components/formcomponents/CommonButton';
import { sendApp } from 'api/onboarding';
import MobileEmailSmartField from 'components/formcomponents/MobileEmailSmartField';
import Tick from 'components/ui/Tick';
import { openApp } from 'helpers';
import { useMediaQuery } from '@mui/material';
import useOutsideClick from 'Hook/useOutsideClick';

/**
 * A popup component to be used every where at desktop mid right and mobile mid bottom right of the page.
 *
 * It displays a "Get App" button that can be clicked to open a popup with a mobile field.
 * When a valid mobile number is entered, it sends the app to the mobile number.
 *
 * @returns A JSX element representing the popup component
 */
export const Entermobilegetapp = () => {
  const isMobile = useMediaQuery('(max-width:699px)');
  const [animating, setAnimating] = useState(false);
  const [checkNumber, setCheckNumber] = useState(true);
  const [email, setEmail] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [mobile, setMobile] = useState('');

  const [flag, setFlag] = useState('https://flagcdn.com/au.svg');
  const [countryCode, setCountryCode] = useState('+61');

  const [counter, setCounter] = useState(0);

  // const ref = useRef(null);

  useEffect(() => {
    if (animating) {
      const interval = setTimeout(() => {
        setAnimating(false);
        setCounter(15);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [animating]);

  useEffect(() => {
    if (counter > 0) {
      const interval = setTimeout(() => {
        setCounter((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);

      return () => clearTimeout(interval);
    }
  }, [counter]);

  const [isOpen, setIsOpen] = useState(false);

  /**
   * Toggles the visibility of the popup component. If the user is on a
   * mobile device, the openApp function is called instead of toggling the
   * popup's visibility.
   */
  function togglePopup() {
    if (isMobile) {
      openApp();
      return;
    }
    if (isOpen) {
      document.getElementById('get-app-popup').classList.remove('visible-in');
      document.getElementById('get-app-popup').classList.add('visible-out');
    } else {
      document.getElementById('get-app-popup').classList.add('visible-in');
      document.getElementById('get-app-popup').classList.remove('visible-out');
    }

    setIsOpen(!isOpen);
  }

  /**
   * Closes the popup and removes the visible-in class and adds the visible-out class to the popup element.
   * Also sets the isOpen state to false.
   */
  function closePopup() {
    if (isOpen) {
      document.getElementById('get-app-popup').classList.remove('visible-in');
      document.getElementById('get-app-popup').classList.add('visible-out');
      setIsOpen(!isOpen);
    }
  }
  useOutsideClick('get-app-popup', closePopup);

  /**
   * Handles the resend button click. It checks if the mobile number is valid and
   * if the counter is 0. If both conditions are met, it sends a request to the
   * server to send the app link via SMS and sets the animating state to true.
   * @function
   */
  const handleResend = async () => {
    if (mobile?.length < 9) {
      setErrorMessage('Please enter a valid mobile number');
      return;
    }
    const payload = {
      type: 'home',
      phone_code: countryCode,
      phone: mobile,
    };
    if (counter === 0) {
      await sendApp(payload);
      setAnimating(true);
    }
  };

  const isError = () => {
    if (mobile.length === 0) {
      return true;
    }
    if (mobile?.length < 9) {
      return true;
    }
    if (counter !== 0) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className='popup-container'>
        {!isOpen && (
          <div onClick={togglePopup} className='sm:bottom-[21%] sm:top-0' id='mybutton'>
            <span className='get_app'>Get App</span>
          </div>
        )}

        <div id='get-app-popup' className={`popup sm:top-[10%]`}>
          <span className='closebutton' onClick={togglePopup}>
            <img src={'/images/Dismiss.svg'} alt='Dismiss' />
          </span>
          <img src={'/images/popup-vector-31.svg'} alt='popup-vector' className='verticle_image' />
          <div className='inner-card-popup'>
            <p>Get the Black Jet App</p>
            <div className='inner-first-div sm:w-[90%] mobile-field'>
              <label htmlFor=''>Mobile phone</label>
              <MobileEmailSmartField
                email={email}
                setEmail={setEmail}
                mobile={mobile}
                setMobile={setMobile}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                checkNumber={checkNumber}
                setCheckNumber={setCheckNumber}
                flag={flag}
                setFlag={setFlag}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                checkOtp={false}
                isPhone={true}
                containerClassName='getapp-inputfield'
              />

              <CommonButton
                error={isError()}
                // disabled={isError()}
                onClick={handleResend}
                className={'get-app-button'}
                text={
                  animating ? (
                    // true
                    <>
                      Sent <Tick />
                    </>
                  ) : counter === 0 ? (
                    'Send me the app'
                  ) : (
                    `Resend in ${counter}s`
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
