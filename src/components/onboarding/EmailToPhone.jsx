import React, { useContext, useEffect, useState } from 'react';

import { MuiOtpInput } from 'mui-one-time-password-input';

import { loginResendotp, loginuser, loginuserotp, loginWithToken } from 'services/api';
import { showError } from 'utils/notify';
import { useLocation, useNavigate } from 'react-router-dom';
import ScrollToTopOnMount from 'components/layout/ScrollToTopOnMount';
import { MOBILE_NUMBER_VALIDATION } from 'constants/regex';
import useQueryParams from 'Hook/useQueryParams';
import CommonLabel from 'components/formcomponents/CommonLabel';
import CommonButton from 'components/formcomponents/CommonButton';
import MobileEmailSmartField from 'components/formcomponents/MobileEmailSmartField';
import OnboardingContext from 'context/OnboardingContext';
import {
  CHANGE_PREORDER_STATUS,
  INITIAL_LOGIN_INFO,
  UPDATE_EMAIL,
  UPDATE_PHONE,
} from 'constants/actions';
import { checkValidAustralianNumber } from 'helpers';
import Errors from 'components/errors/Errors';
import ResendButton, { INITIAL_TIMING } from './components/ResendButton';
import { allCountryList } from './country';
import { ROUTE_LIST } from 'routes/routeList';
import { error_flag } from 'assets/images';

/**
 * Component for handling the phone number to otp screen transition.
 * Based on isMobile prop, it renders either the phone number or email input field.
 * Based on checkNumber prop, it renders either the phone number or email input field.
 * It also renders the resend button and the countdown timer for the otp screen.
 * Handles the goBack navigation and otpSend actions.
 * @param {boolean} isMobile - Indicates whether the component is rendered on a mobile device or not.
 * @param {boolean} isOnboarded - Indicates whether the user is already onboarded or not.
 * @param {string} type - Indicates the type of the user.
 * @param {function} goTo - Function to navigate to the next screen.
 * @param {function} setIsAlready - Function to set the isAlready state.
 * @param {function} setCommonOnboarded - Function to set the commonOnboarded state.
 * @param {function} setDevice - Function to set the device state.
 * @return {JSX.Element} Component to render the phone number to otp screen transition.
 */
const EmailToPhone = ({ goTo, isMobile, setIsAlready, setCommonOnboarded, setDevice }) => {
  const queryParams = useQueryParams();
  const type = queryParams.type || '';
  // const { countries } = useCountries();
  // const [country, setCountry] = useState(157);
  // const { name, flags, countryCallingCode } = countries[country];
  const [otp, setOtp] = useState('');
  const [checkNumber, setCheckNumber] = useState(true);
  const [checkOtp, setCheckOtp] = useState(false);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [errorOtp, setErrorOtp] = useState('');
  // default country flag
  const [flag, setFlag] = useState('https://flagcdn.com/au.svg');
  const [countryCode, setCountryCode] = useState('+61');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const location = useLocation();
  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);
  // const [countryShort, setCountryShort] = useState(null);
  // https://api.first.org/data/v1/countries?limit=300

  // const getCountryShort = async () => {
  //   try {
  //     const response = await fetch('https://api.first.org/data/v1/countries?limit=300');
  //     const data = await response.json();
  //     setCountryShort(data?.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    // getCountryShort();
    if (location.pathname === ROUTE_LIST.PHONE_NUMBER && !onboardingForms?.sessionToken) {
      dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: false });
      navigate(ROUTE_LIST.SMART_FIELD);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (onboardingForms?.phone?.mobile) {
      setCheckNumber(true);
      setMobile(onboardingForms?.phone?.mobile || '');
      setFlag(onboardingForms?.phone?.flag || 'https://flagcdn.com/au.svg');
      setCountryCode(onboardingForms?.phone?.countryCode || '+61');
      setEmail('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  /**
   * Handles the change event of the OTP input field.
   * Sets the state of the otp with the new value.
   * @param {string} newValue - The new value of the OTP input field.
   */
  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  /**
   * Handles the go back navigation from the otp screen to the previous screen.
   * If the user is on the otp screen, it resets the otp state and navigates back to the phone number screen.
   * If the user is on the phone number screen, it navigates back to the previous screen in the history stack.
   */
  const goBack = () => {
    if (checkOtp) {
      setCheckOtp(false);
      setOtp('');
    } else {
      if (isMobile) {
        goTo(0);
      } else {
        navigate(-1); // Navigate back one step in the history stack
      }
    }
  };
  function isValidMobileNumber(phoneNumber) {
    return MOBILE_NUMBER_VALIDATION.test(phoneNumber);
  }

  const otpSend = () => {
    if (checkOtp) {
      verifyOtp();
    } else {
      if (mobile && countryCode === '+61' && !checkValidAustralianNumber(mobile)) {
        setErrorMessage(
          "Phone number not recognized.  Start with '+' followed by the country code (e.g., +61 412 345 678).",
        );
      } else if (mobile && !isValidMobileNumber(mobile)) {
        setErrorMessage(
          "Phone number not recognized.  Start with '+' followed by the country code (e.g., +61 412 345 678).",
        );
      } else if (mobile) {
        setErrorMessage('');
        loggedin();
        dispatchOnboardingForms({ type: UPDATE_PHONE, payload: { mobile, flag, countryCode } });
      }
    }
  };
  // const fullCountryName = countries.find((c) => c.countryCallingCode === countryCode)?.name
  // // const countryShortString = countryShort.map((c) => JSON.stringify(c))
  // const findCountryShort = () => {

  // }

  // console.log(
  //   allCountryList.find((c) => c.countryCallingCode === countryCode).countryCode,
  //   'this_is_countries',
  // );

  const loggedin = async () => {
    const checkRegType = onboardingForms?.loginData?.newUser ? 'registered' : 'login';
    const inviteLink = localStorage.getItem('inviteLink');
    let payload;
    if (checkNumber) {
      payload = {
        checkRegType,
        link_code: inviteLink || '',
        phone: mobile,
        country_code: allCountryList.find((c) => c.countryCallingCode === countryCode).countryCode,
        phone_code: countryCode,
        email: '',
        randomString: onboardingForms?.loginData?.randomString,
      };
    } else {
      payload = {
        link_code: inviteLink || '',
        checkRegType,
        phone: '',
        country_code: '',
        phone_code: '',
        email: email,
        randomString: onboardingForms?.loginData?.randomString,
      };
    }
    try {
      const res = await loginWithToken(payload);
      if (res?.data?.status_code === 406) {
        setFlag(error_flag);
        setErrorMessage(res?.data?.message);
      }
      if (res?.data?.status_code === 200) {
        if (res?.data?.data?.onboard_status) {
          // showError("Already Onboarded");
          // localStorage.setItem('blackjet-website', res?.data?.data?.token || '');
          setIsOnboarded(true);
          if (isMobile) {
            setCommonOnboarded(true);
            setDevice('phone');
            goTo(3);
          } else {
            setCheckOtp(true);
          }
        } else {
          // localStorage.setItem('blackjet-website', res?.data?.data?.token);
          // showMessage(res?.data.message);

          if (isMobile) {
            // localStorage.setItem("last", 2)
            // goTo(4)
            setCommonOnboarded(false);
            setDevice('phone');
            goTo(3);
            // setCheckOtp(true)
          } else if (!checkNumber && type !== 'pre-order') {
            navigate(ROUTE_LIST.PHONE_NUMBER);
          } else if (!checkNumber && type === 'pre-order') {
            navigate(`${ROUTE_LIST.PHONE_NUMBER}?type=pre-order`);
          } else {
            setCheckOtp(true);
          }
          dispatchOnboardingForms({ type: UPDATE_PHONE, payload: { mobile, flag, countryCode } });
        }
      } else {
        if (res?.data?.message === 'Phone already exist' || res.status === 400) {
          // localStorage.setItem('blackjet-website', res?.data?.data?.token);
          setIsOnboarded(true);
          setCheckOtp(true);
          dispatchOnboardingForms({ type: UPDATE_PHONE, payload: { mobile, flag, countryCode } });
          handleClose();
        }
        // setErrorMessage("Already Exists");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const verifyOtp = async () => {
    // validation
    if (!otp) {
      return setErrorOtp('Please enter SMS code');
    }
    if (otp.length < 6) {
      return setErrorOtp(`The SMS code you’ve entered is incorrect`);
    }
    const checkRegType = onboardingForms?.loginData?.newUser ? 'registered' : 'login';
    const verify_from = checkNumber ? 0 : 1;
    let payload = {
      otp: otp,
      // firebase_device_token: 'abc',
      checkRegType,
      verify_from,
      randomString: onboardingForms?.loginData?.randomString,
    };

    try {
      const res = await loginuserotp(payload);

      // console.log(res.data)
      // showMessage(res?.data?.message);
      if (res?.data?.status_code === 200) {
        localStorage.setItem('blackjet-website', res?.data?.data?.token);
        if (isOnboarded) {
          if (isMobile) {
            goTo(6);
            setIsAlready(true);
          } else {
            navigate(`${ROUTE_LIST.GRATIAS_TIBI_AGO}?already=1`);
          }
        } else {
          if (isMobile) {
            localStorage.setItem('last', 2);
            goTo(3);
            setIsAlready(false);
          } else if (type !== 'pre-order') {
            navigate(ROUTE_LIST.COMPENDIUM);
          } else {
            navigate(`${ROUTE_LIST.COMPENDIUM}?type=pre-order`);
          }
        }
      } else {
        showError(res?.data?.message);
        setErrorOtp(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
      setErrorOtp(error?.response?.data?.message);
    }
  };
  const checkRegType = onboardingForms?.loginData?.newUser ? 'registered' : 'login';
  const country_code = allCountryList.find((c) => c.countryCallingCode === countryCode).countryCode;

  const resendOtp = async (setCount) => {
    if (setCount) {
      setCount(INITIAL_TIMING);
    }
    let payload = {
      phone_code: countryCode,
      phone: mobile,
      randomString: onboardingForms?.loginData?.randomString,
      checkRegType,
    };
    try {
      const res = await loginResendotp(payload);
      console.log(res.data);
      // showMessage(res?.data?.message);
      // setCountdown(10);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = async () => {
    //When user is already onboarded email is different and phone is same

    //send otp and call login api
    const payload = {
      phone: mobile,
      country_code,
      phone_code: countryCode,
      email: '',
    };
    const res = await loginuser(payload);

    dispatchOnboardingForms({
      type: INITIAL_LOGIN_INFO,
      payload: { ...onboardingForms?.loginData, ...res?.data?.data, ...payload, phone: mobile },
    });
    if (res?.data?.status_code === 200) {
      // setCheckOtp(checkNumber);
      // localStorage.setItem('blackjet-website', res?.data?.data?.token);
      dispatchOnboardingForms({ type: INITIAL_LOGIN_INFO, payload: res?.data?.data });
      if (res?.data?.data?.onboard_status) {
        // means user is already onboarded
        if (isMobile) {
          // mark common onboarded true
          setCommonOnboarded(true);
          setDevice(checkNumber ? 'phone' : 'email');
          setIsAlready(true);
          // goto otp screen
          goTo(1);
        } else {
          setCheckOtp(true);
        }
      } else {
        setCommonOnboarded(false);
        if (!checkNumber) {
          // should be email -> should got to phone screen
          if (isMobile) {
            goTo(2);
            setIsAlready(false);
          } else {
            // navigate based on pre-order type
            navigate(`${ROUTE_LIST.PHONE_NUMBER}${type === 'pre-order' ? '?type=pre-order' : ''}`);
          }
          dispatchOnboardingForms({ type: UPDATE_PHONE, payload: { mobile, flag, countryCode } });
          dispatchOnboardingForms({ type: UPDATE_EMAIL, payload: email });
        } else {
          // should be a mobile number
          if (isMobile) {
            // mobile devices -> goto otp slide
            goTo(1);
            setDevice(checkNumber ? 'phone' : 'email');
            setIsAlready(false);
          } else {
            // larger devices -> start(reset) timer
            setCheckOtp(true);
            // resendTimer();
          }
          dispatchOnboardingForms({ type: UPDATE_PHONE, payload: { mobile, flag, countryCode } });
        }
      }
    } else {
      setErrorMessage(res?.data?.message);
    }
  };

  //Second step if newUser is true

  return (
    <div>
      <ScrollToTopOnMount />
      <div className='onboardbg otp-screen'>
        <div className="onboarding-width flex flex-col justify-between gap-6  w-[498px] font-['Hauora'] mx-auto items-center mb-96">
          <div className=' otp-section'>
            <CommonLabel className='!mb-[4px]' label='Enter your phone number' />
            <div className='email-to-phone'>
              We simplify your login process by sending you a Black Jet Code for password-free
              access
            </div>
            <div className='w-full select-country'>
              <MobileEmailSmartField
                isPhone={true}
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
                checkOtp={checkOtp}
                isNumeric={true}
              />

              <div className='text-white text-left text-xs w-full mt-[5px]'>
                {' '}
                {errorMessage && !checkOtp && (
                  <div className='flex gap-[2px] items-center'>
                    {' '}
                    <svg
                      className='mr-1'
                      width='12'
                      height='12'
                      viewBox='0 0 12 12'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <g clip-path='url(#clip0_681_2376)'>
                        <path
                          d='M5.63096 6.81741C5.66271 6.99235 5.81582 7.12501 5.99991 7.12501C6.20702 7.12501 6.37491 6.95711 6.37491 6.75001V3.37339L6.36887 3.30598C6.33712 3.13104 6.18401 2.99839 5.99991 2.99839C5.79281 2.99839 5.62491 3.16628 5.62491 3.37339V6.75001L5.63096 6.81741ZM5.40088 8.43751C5.40088 8.74817 5.65272 9.00001 5.96338 9.00001C6.27404 9.00001 6.52588 8.74817 6.52588 8.43751C6.52588 8.12685 6.27404 7.87501 5.96338 7.87501C5.65272 7.87501 5.40088 8.12685 5.40088 8.43751ZM0 6C0 9.31371 2.68629 12 6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6ZM11.25 6C11.25 8.8995 8.8995 11.25 6 11.25C3.1005 11.25 0.75 8.8995 0.75 6C0.75 3.1005 3.1005 0.75 6 0.75C8.8995 0.75 11.25 3.1005 11.25 6Z'
                          fill='#FF0000'
                        />
                      </g>
                      <defs>
                        <clipPath id='clip0_681_2376'>
                          <rect width='12' height='12' fill='white' />
                        </clipPath>
                      </defs>
                    </svg>
                    <p>{errorMessage}</p>
                  </div>
                )}
              </div>

              {checkOtp && (
                <>
                  {' '}
                  <div className={`otp mt-6 ${errorOtp ? 'error-indicator' : ''}`}>
                    <div className='text-left mb-[4px] text-[16px] font-semibold text-white otp-label'>
                      Enter the 6 digit code sent to your phone
                    </div>
                    <MuiOtpInput
                      length={6}
                      value={otp}
                      inoutbg='#333333'
                      onChange={handleChange}
                      TextFieldsProps={{
                        type: 'number',
                        inputProps: { inputMode: 'numeric', pattern: '[0-9]*' },
                      }}
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                    />
                    <Errors error={errorOtp} message={errorOtp} />
                  </div>
                  {/* <div className='text-white text-left text-xs w-full mt-[5px]'>
                    {' '}
                    {errorOtp && (
                      <div className='flex gap-[2px] items-center'>
                        {' '}
                        <svg
                          className='mr-1'
                          width='12'
                          height='12'
                          viewBox='0 0 12 12'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <g clip-path='url(#clip0_681_2376)'>
                            <path
                              d='M5.63096 6.81741C5.66271 6.99235 5.81582 7.12501 5.99991 7.12501C6.20702 7.12501 6.37491 6.95711 6.37491 6.75001V3.37339L6.36887 3.30598C6.33712 3.13104 6.18401 2.99839 5.99991 2.99839C5.79281 2.99839 5.62491 3.16628 5.62491 3.37339V6.75001L5.63096 6.81741ZM5.40088 8.43751C5.40088 8.74817 5.65272 9.00001 5.96338 9.00001C6.27404 9.00001 6.52588 8.74817 6.52588 8.43751C6.52588 8.12685 6.27404 7.87501 5.96338 7.87501C5.65272 7.87501 5.40088 8.12685 5.40088 8.43751ZM0 6C0 9.31371 2.68629 12 6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6ZM11.25 6C11.25 8.8995 8.8995 11.25 6 11.25C3.1005 11.25 0.75 8.8995 0.75 6C0.75 3.1005 3.1005 0.75 6 0.75C8.8995 0.75 11.25 3.1005 11.25 6Z'
                              fill='#FF0000'
                            />
                          </g>
                          <defs>
                            <clipPath id='clip0_681_2376'>
                              <rect width='12' height='12' fill='white' />
                            </clipPath>
                          </defs>
                        </svg> 
                        <p>{errorOtp}</p>
                      </div>
                    )}
                  </div> */}
                  <div className='otp-1 resend-btn flex flex-row justify-start mt-3  h-10 items-start '>
                    <ResendButton resendOtp={resendOtp} />
                    {/* <button
                      onClick={() => resendOtp()}
                      id='ResendCode'
                      disabled={countdown != 0 ? true : false}
                      className='resend-code disabled:cursor-not-allowed disabled:text-gray-600 '
                    >
                      Resend code {countdown == 0 ? '' : countdown}
                    </button> */}
                  </div>
                </>
              )}
            </div>

            <div className="form-buttons flex flex-row gap-[48px] w-full font-['Hauora'] mt-[28px] items-center">
              <button id='RectButtons' onClick={goBack} type='button' className='arrow-btn'>
                <img
                  src='https://file.rendit.io/n/ln9TIOoBGF72MNAYYUyv.svg'
                  alt='ArrowLeft'
                  id='ArrowLeft'
                  className='w-4'
                />
              </button>
              <CommonButton error={!mobile && !email} text='Continue' onClick={otpSend} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailToPhone;
