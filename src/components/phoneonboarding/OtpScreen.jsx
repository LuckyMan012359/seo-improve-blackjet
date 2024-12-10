import Errors from 'components/errors/Errors';
import CommonButton from 'components/formcomponents/CommonButton';
import ResendButton, { INITIAL_TIMING } from 'components/onboarding/components/ResendButton';
import OnboardingContext from 'context/OnboardingContext';
// import { openApp } from 'helpers';
import useQueryParams from 'Hook/useQueryParams';
import { MuiOtpInput } from 'mui-one-time-password-input';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_LIST } from 'routes/routeList';
import {
  apiSendCodeToEmail,
  apiSendOtpEmailRegister,
  loginResendotp,
  loginuserotp,
} from 'services/api';

const OtpScreen = ({
  onboarded,
  isMobile,
  goTo,
  setIsAlready,
  device,
  currentIndex,
  fromWhereData,
}) => {
  const [otp, setOtp] = useState('');
  const [errorOtp, setErrorOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [checkNumber] = useState(true);
  const { onboardingForms } = useContext(OnboardingContext);
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const type = queryParams.type || '';
  const checkRegType = onboardingForms?.loginData?.newUser ? 'registered' : 'login';
  // useEffect(() => {
  //   resendOtp();
  // }, [currentIndex]);

  useEffect(() => {
    if (countdown === 10) {
      resendTimer();
    }
  }, [countdown]);

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp();
    }
    // eslint-disable-next-line
  }, [otp]);

  const handleChange = (newValue) => {
    setOtp(newValue);
  };
  // const goBack = () => {
  //   setOtp('');
  // };

  const otpSend = () => {
    verifyOtp();
  };

  const resendTimer = () => {
    setOtp('');
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        // Ensure the countdown doesn't go below 0
        return prevCountdown > 0 ? prevCountdown - 1 : 0;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  };

  const isSMS = device === 'phone' ? 'SMS' : 'email';

  const verifyOtp = async () => {
    if (!otp) {
      return setErrorOtp(`Please enter ${isSMS} code`);
    }
    if (otp.length < 6) {
      return setErrorOtp(`The ${isSMS} code you’ve entered is incorrect`);
    }
    const verify_from = checkNumber ? 0 : 1;
    let payload = {
      otp: otp,
      // firebase_device_token: 'abc',
      checkRegType,
      verify_from,
      randomString: onboardingForms?.loginData?.randomString,
    };

    //verify otp
    try {
      const res = await loginuserotp(payload);
      if (res?.data?.status_code === 200) {
        localStorage.setItem('blackjet-website', res?.data?.data?.token);
        if (onboarded) {
          if (isMobile) {
            window.location.href = `${process.env.REACT_APP_REDIRECTION_URL}/#/pwa/${res?.data?.data?.token}`;
            // openApp();
            navigate('/');
            return;
          }
        } else {
          // if mobile goto email checking screen
          if (isMobile) {
            if (fromWhereData?.from === 'sendOtpEmailRegister') {
              goTo(5);
              if (isMobile) {
                // mobile -> goto basic info screen
                localStorage.setItem('last', 5);
                setIsAlready(false);
              } else if (type !== 'pre-order') {
                navigate(ROUTE_LIST.COMPENDIUM);
              } else {
                navigate(`${ROUTE_LIST.COMPENDIUM}?type=pre-order`);
              }
              return;
            }

            goTo(currentIndex === 3 ? 5 : 4);
          }
        }
      } else {
        setErrorOtp(res?.data?.message);
      }
      // }
    } catch (error) {
      console.log(error);
    }
  };
  // const checkRegType = onboardingForms?.loginData?.newUser ? 'registered' : 'login';
  const resendOtp = async (setCount) => {
    if (setCount) {
      setCount(INITIAL_TIMING);
    }

    if (fromWhereData?.from === 'sendOtpEmailRegister') {
      await apiSendOtpEmailRegister(fromWhereData.payload);
      return;
    }

    if (fromWhereData?.from === 'emailLogin') {
      await apiSendCodeToEmail({
        ...fromWhereData.payload,
        randomString: onboardingForms?.loginData?.randomString,
      });
      return;
    }

    let payload = {
      phone_code: onboardingForms?.loginData?.phone_code || onboardingForms?.phone?.countryCode,
      phone: onboardingForms?.loginData?.phone || onboardingForms?.phone?.mobile,
      randomString: onboardingForms?.loginData?.randomString,
      checkRegType,
    };
    // let payload = { otp: otp, firebase_device_token: "abc" };
    try {
      const res = await loginResendotp(payload);
      console.log(res.data);
      // showMessage(res?.data?.message);
      setCountdown(INITIAL_TIMING);
    } catch (error) {
      console.log(error);
      // showError(error?.response?.data?.message)
    }
  };
  return (
    <div className='otp-screen'>
      <div className={`otp mt-[24px] ${errorOtp ? 'error-indicator' : ''}`}>
        <div className='otp-instructions text-left text-[16px] mb-1 sm:text-lg sm:mb-4  text-white'>
          {device?.isFullTxt ? device.text : `Enter the 6 digit code sent to your ${device}`}
        </div>
        <MuiOtpInput
          length={6}
          TextFieldsProps={{
            type: 'number',
            inputProps: { inputMode: 'numeric', pattern: '[0-9]*' },
          }}
          value={otp}
          inoutbg='#333333'
          onChange={handleChange}
          display='flex'
          alignItems='center'
          justifyContent='center'
        />
        <Errors error={errorOtp} message={errorOtp} />
      </div>
      <div className='resend-btn otp-3 flex flex-row justify-start mt-3 mb-[48px]  h-10 items-start '>
        <ResendButton resendOtp={resendOtp} />
      </div>

      <div className="form-buttons flex flex-row gap-[48px] w-full font-['Hauora'] items-start">
        <CommonButton
          error={errorOtp || otp?.length < 6}
          text={'Continue'}
          onClick={otpSend}
          className=''
        />
      </div>
    </div>
  );
};

export default OtpScreen;
