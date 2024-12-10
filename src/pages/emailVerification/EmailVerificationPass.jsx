import React from 'react';
import { BorderLine } from './EmailVerificationFail';
import MobileWrapper from 'components/CardSection/MobileWrapper';
import { useMediaQuery } from '@mui/material';
import CommonButton from 'components/formcomponents/CommonButton';
import { openApp } from 'helpers';
import { Entermobilegetapp } from 'components/Popup';

const EmailVerificationPass = () => {
  const isMobile = useMediaQuery('(max-width : 699px)');

  const handleClick = () => {
    openApp();
  };
  return (
    <MobileWrapper key={'email-verification'}>
      {!isMobile && <Entermobilegetapp />}
      <div className='email-verification-container'>
        <svg xmlns='http://www.w3.org/2000/svg' class='svg-success' viewBox='0 0 24 24'>
          <g stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10'>
            <circle class='success-circle-outline' cx='12' cy='12' r='11.5' />
            <circle class='success-circle-fill' cx='12' cy='12' r='11.5' fill='none' />
            <polyline class='success-tick' points='17,8.5 9.5,15.5 7,13' />
          </g>
        </svg>

        <h2 className='thank-you-message'>Thank you</h2>
        <BorderLine />
        <p className='verification-message'>Your email is verified</p>
        {isMobile && (
          <div className='email-verification-pass-btn'>
            <CommonButton
              onClick={handleClick}
              text={'Open app'}
              className='email-verification-btn'
            />
          </div>
        )}
      </div>
    </MobileWrapper>
  );
};

export default EmailVerificationPass;
