import React, { useContext, useEffect, useState } from 'react';

import { MuiOtpInput } from 'mui-one-time-password-input';

import {
  apiCheckInviteLink,
  apiCheckReferralLink,
  apiSendCodeToEmail,
  loginResendotp,
  loginuser,
  loginuserotp,
} from 'services/api';
import { showError, showMessage } from 'utils/notify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ScrollToTopOnMount from 'components/layout/ScrollToTopOnMount';
import { MOBILE_NUMBER_VALIDATION } from 'constants/regex';
import useQueryParams from 'Hook/useQueryParams';
import CommonButton from 'components/formcomponents/CommonButton';
import MobileEmailSmartField from 'components/formcomponents/MobileEmailSmartField';
import {
  CHANGE_PREORDER_STATUS,
  INITIAL_LOGIN_INFO,
  UPDATE_EMAIL,
  UPDATE_PHONE,
} from 'constants/actions';
import OnboardingContext from 'context/OnboardingContext';
import { useMediaQuery } from '@mui/material';
import { checkValidAustralianNumber } from 'helpers';
import Errors from 'components/errors/Errors';
import ResendButton, { INITIAL_TIMING } from './components/ResendButton';
import { allCountryList } from './country';
import { ROUTE_LIST } from 'routes/routeList';
import { error_flag } from 'assets/images';

/**
 * PhoneRecognized component
 *
 * This component is responsible for rendering the phone number or email input screen.
 * It handles the logic for validating and sending the otp code.
 *
 * @param {Object} props
 * @param {Function} props.goTo - function to navigate to the next step
 * @param {Boolean} props.isMobile - boolean indicating if the user is on a mobile device
 * @param {Function} [props.setIsAlready] - function to set the isAlready state
 * @param {Function} [props.setCommonOnboarded] - function to set the common onboarded state
 * @param {Function} [props.setDevice] - function to set the device type
 * @param {Function} [props.setFromWhereData] - function to set the from where data
 * @returns {JSX.Element} - the rendered component
 */
const PhoneRecognized = ({
  goTo,
  isMobile,
  setIsAlready = () => {},
  setCommonOnboarded = () => {},
  setDevice = () => {},
  setFromWhereData,
}) => {
  const queryParams = useQueryParams();
  const type = queryParams.type || '';
  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);

  const [otp, setOtp] = useState('');
  const [checkNumber, setCheckNumber] = useState(false);
  const [checkOtp, setCheckOtp] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorOtp, setErrorOtp] = useState('');
  const [mobile, setMobile] = useState();
  

  // const [countdown, setCountdown] = useState(10);
  const [flag, setFlag] = useState('https://flagcdn.com/au.svg');
  const [countryCode, setCountryCode] = useState('+61');
  const navigate = useNavigate();
  const location = useLocation();
  const { id: dynamicId } = useParams();

  const [isEmailLogin, setIsEmailLogin] = useState(false);

  const isMobileDevice = useMediaQuery('(max-width : 699px)');

  const segment = location.pathname.split('/');

  useEffect(() => {
    if (isMobileDevice) {
      navigate(ROUTE_LIST.PHONE_ONBOARDING, { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    checkReferralLink();
    checkGuestInviteLink();
    if (!onboardingForms?.sessionToken) {
      dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: false });
    }
    // eslint-disable-next-line
  }, []);

  /**
   * Checks if the referral link is valid and if it is, sets the refer in localStorage.
   *
   * @returns {Promise<void>}
   */
  const checkReferralLink = async () => {
    try {
      if (segment[1] === 'refer' && dynamicId) {
        const response = await apiCheckReferralLink(dynamicId);
        if (response?.data?.data?.refer_status === 'pending') {
          localStorage.setItem('refer', dynamicId.slice(-6));
        } else {
          showError('The referral link is expired');
        }
      }
    } catch (error) {
      console.error(`Unable to set refer ${error}`);
    }
  };

  /**
   * Checks if the invite link is valid and if it is, sets the invite link in localStorage.
   * If the invite link is not valid, shows an error message.
   * 
   *
   * @returns {Promise<void>}
   */
  const checkGuestInviteLink = async () => {
    localStorage.removeItem('inviteLink');
    try {
      if (segment[1] === 'invite' && dynamicId) {
        const response = await apiCheckInviteLink(dynamicId);

        if (response.status === 200) {
          localStorage.setItem('inviteLink', dynamicId);
          showMessage(response?.data?.message);
          return;
        }
        showError(response?.data?.message);
      }
    } catch (error) {
      console.error(`Unable to set refer ${error}`);
      localStorage.removeItem('inviteLink');
      showError('Link expired or not valid.');
    }
  };

  /**
   * Handles the change event of the OTP input field.
   * Sets the state of the otp with the new value.
   * If the length of the new value is 6, then verify the OTP automatically.
   * @param {string} newValue - The new value of the OTP input field.
   */
  const handleChange = (newValue) => {
    // console.log(newValue.length, 'this_is_newVal');
    setOtp(newValue);
    if (newValue.length === 6) {
      // When opt length is 6 then call automatically
      verifyOtp(newValue);
    }
  };

  useEffect(() => {
    if (onboardingForms?.phone?.mobile) {
      setCheckNumber(true);
      setMobile(onboardingForms?.phone?.mobile || '');
      setFlag(onboardingForms?.phone?.flag || 'https://flagcdn.com/au.svg');
      setCountryCode(onboardingForms?.phone?.countryCode || '+61');
      setEmail('');
    } else if (onboardingForms?.email) {
      setCheckNumber(false);
      setMobile('');
      setFlag('https://flagcdn.com/au.svg');
      setCountryCode('+61');
      setEmail(onboardingForms?.email || '');
    }

    // eslint-disable-next-line
  }, []);

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

  /**
   * Checks if a given phone number is valid.
   * The phone number is considered valid if it starts with '+' followed by the country code (e.g., +61 412 345 678).
   * @param {string} phoneNumber - The phone number to be validated.
   * @returns {boolean} - True if the phone number is valid; False otherwise.
   */
  function isValidMobileNumber(phoneNumber) {
    return MOBILE_NUMBER_VALIDATION.test(phoneNumber);
  }

  /**
   * Handles the logic for sending the otp code to the user.
   * If the user is on the email screen, it sends the otp code to the email address.
   * If the user is on the phone number screen, it sends the otp code to the phone number.
   * If the user is on the otp screen, it verifies the otp code entered by the user.
   * @function
   */
  const otpSend = () => {
    if (!email && !mobile) {
      setErrorMessage('Please enter mobile number or email');
    } else if (mobile && !isValidMobileNumber(mobile)) {
      setErrorMessage(
        "Phone number not recognized.  Start with '+' followed by the country code (e.g., +61 412 345 678).",
      );
    } else if (mobile && countryCode === '+61' && !checkValidAustralianNumber(mobile)) {
      setErrorMessage(
        "Phone number not recognized.  Start with '+' followed by the country code (e.g., +61 412 345 678).",
      );
    } else if (email && (!email?.includes('@') || !email?.includes('.'))) {
      setErrorMessage('Please provide a valid email address (e.g., john@icloud.com)');
    } else if (
      email?.includes('@') ? false : !(mobile && mobile.length >= 8 && mobile.length <= 16)
    ) {
      setErrorMessage('Mobile number not valid');
    } else if (checkOtp) {
      verifyOtp(otp);
    } else {
      if (!checkNumber) {
        loggedin();
      } else {
        loggedin();
      }
    }
  };

  /**
   * Handles the logic for sending the otp code to the user.
   * If the user is on the email screen, it sends the otp code to the email address.
   * If the user is on the phone number screen, it sends the otp code to the phone number.
   * If the user is on the otp screen, it verifies the otp code entered by the user.
   * If the user is logged in, it sets the onboarded status and navigates to the appropriate screen.
   * If the user is not logged in, it sets the onboarded status to false and navigates to the appropriate screen.
   * @function
   */
  const loggedin = async () => {
    const inviteLink = localStorage.getItem('inviteLink');
    let payload;
    if (checkNumber) {
      payload = {
        link_code: inviteLink || '',
        phone: mobile,
        country_code: allCountryList.find((c) => c.countryCallingCode === countryCode).countryCode,
        phone_code: countryCode,
        email: '',
      };
    } else {
      payload = {
        link_code: inviteLink || '',
        phone: '',
        country_code: '',
        phone_code: '',
        email: email,
      };
    }
    try {
      //When Try to login with email
      const res = await loginuser(payload);
      console.log(res?.data, 'this_login_called');
      if (res?.data?.status_code === 406) {
        setFlag(error_flag);
      }

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
            setFromWhereData({ from: 'emailLogin', payload: payload });
            setIsAlready(true);
            // goto otp screen
            goTo(1);
          } else {
            // start timer
            // resendTimer();
            setIsEmailLogin(true);
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
              navigate(
                `${ROUTE_LIST.PHONE_NUMBER}${type === 'pre-order' ? '?type=pre-order' : ''}`,
              );
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
            dispatchOnboardingForms({ type: UPDATE_EMAIL, payload: '' });
          }
        }
      } else {
        setErrorMessage(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isSMS = checkNumber ? 'SMS' : 'email';

  /**
   * Verify the otp code entered by the user.
   * @param {string} otp - The otp code that the user has entered.
   * @returns {Promise<void>}
   */
  const verifyOtp = async (otp) => {
    if (!otp) {
      return setErrorOtp(`Please enter ${isSMS} code`);
    }
    if (otp.length < 6) {
      return setErrorOtp(`The ${isSMS} code you’ve entered is incorrect`);
    }
    const checkRegType = onboardingForms?.loginData?.newUser ? 'registered' : 'login';

    const verify_from = checkNumber ? 0 : 1;

    // checkRegType
    let payload = {
      otp: otp,
      // firebase_device_token: 'abc',
      checkRegType,
      verify_from,
      randomString: onboardingForms?.loginData?.randomString,
    };

    try {
      // verifyOtp
      const res = await loginuserotp(payload);

      if (res?.data?.status_code === 200) {
        localStorage.setItem('blackjet-website', res?.data?.data?.token);
        if (
          !onboardingForms?.loginData?.is_membership_purchased &&
          !onboardingForms?.loginData?.newUser
        ) {
          navigate(ROUTE_LIST.REFINED_SELECTION, {
            state: {
              heading: 'Good news! You already have an account with us',
              subHeading: 'Upgrade today to become a member and enjoy full membership benefits',
            },
          });
          return;
        }
        if (onboardingForms?.loginData?.onboard_status) {
          if (isMobile) {
            goTo(6);
            setIsAlready(true);
          } else {
            navigate(`${ROUTE_LIST.GRATIAS_TIBI_AGO}?already=1`);
          }
        } else {
          if (isMobile) {
            goTo(2);
          } else if (type !== 'pre-order') {
            navigate(ROUTE_LIST.EMAIL_ADDRESS);
          } else {
            navigate(`${ROUTE_LIST.EMAIL_ADDRESS}?type=pre-order`);
          }
          dispatchOnboardingForms({ type: UPDATE_EMAIL, payload: email });
          dispatchOnboardingForms({ type: UPDATE_PHONE, payload: { mobile, flag, countryCode } });
        }
      } else {
        showError(res?.data?.message);
        setErrorOtp(res?.data?.message);
      }
      // }
    } catch (error) {
      console.log(error);
      setErrorOtp('Something went wrong. Please try again');
      showError(error?.response?.data?.message);
    }
  };

  const checkRegType = onboardingForms?.loginData?.newUser ? 'registered' : 'login';

  /**
   * Resend OTP to user's phone or email
   * @param {function} setCount - a function to set the count down timer
   * @returns {Promise<void>}
   */
  const resendOtp = async (setCount) => {
    if (setCount) {
      setCount(INITIAL_TIMING);
    }
    let payload = {
      phone_code: onboardingForms?.loginData?.phone_code,
      phone: onboardingForms?.loginData?.phone,
      randomString: onboardingForms?.loginData?.randomString,
      checkRegType,
    };
    // let payload = { otp: otp, firebase_device_token: "abc" };

    if (isEmailLogin) {
      const _payload = {
        randomString: onboardingForms?.loginData?.randomString,
        email,
        checkRegType,
      };

      await apiSendCodeToEmail(_payload);
      return;
    }

    try {
      const res = await loginResendotp(payload);
      console.log(res.data);
      // showMessage(res?.data?.message);
      // setCountdown(10);
    } catch (error) {
      console.log(error);
      // showError(error?.response?.data?.message)
    }
  };

  // Entry Points [Mobile | Desktop ]

  return (
    <>
      <div className='oboarding-mobile-none'>
        <ScrollToTopOnMount />
        <div className='onboardbg'>
          <div className='login-section-wrap'>
            <h2 className='heading-20'>Enter your phone number or email</h2>
            <div className='w-full select-country'>
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
                checkOtp={checkOtp}
                init={''}
              />
              <div className='error-txt'>
                {errorMessage && (
                  <div className='flex gap-[2px] items-center'>
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
                  <div className={`otp mt-[24px] ${errorMessage ? 'error-indicator' : ''}`}>
                    <div className='otp-instructions text-left text-[16px] mb-1 sm:text-lg sm:mb-4  text-white'>
                      Enter the 6 digit code sent to your {checkNumber ? 'phone' : 'email'}
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
                  <div className='resend-btn otp-2 flex flex-row justify-start mt-3 mb-[48px]  h-10 items-start '>
                    <ResendButton resendOtp={resendOtp} />
                    {/* <button
                      onClick={() => resendOtp()}
                      id='ResendCode'
                      disabled={countdown != 0 ? true : false}
                      className="text-center !bg-[#333333] disabled:cursor-not-allowed disabled:text-gray-600 text-sm font-['Hauora'] font-bold p-2 rounded-[39px] text-[#f2f2f2]"
                    >
                      Resend code {countdown == 0 ? '' : `(${countdown})`}
                    </button> */}
                  </div>
                </>
              )}
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

            {!checkOtp && (
              <div className={`signup ${checkNumber ? 'my-[24px]' : 'my-[24px]'}  text-white`}>
                Sign up takes less than a minute
              </div>
            )}

            <div className="form-buttons flex flex-row gap-[48px] w-full font-['Hauora'] items-start">
              {/* <button id="RectButtons" onClick={goBack} className="arrow-btn" type="button">
                <img
                  src="https://file.rendit.io/n/ln9TIOoBGF72MNAYYUyv.svg"
                  alt="ArrowLeft"
                  id="ArrowLeft"
                  className="w-4"
                />
              </button> */}
              <CommonButton
                onClick={goBack}
                type='button'
                className={'arrow-btn'}
                variant='back-arrow'
                pressedClass='pressed-arrow'
                disabledClass='disabled-arrow'
                text={
                  <img
                    src='https://file.rendit.io/n/ln9TIOoBGF72MNAYYUyv.svg'
                    alt='ArrowLeft'
                    id='ArrowLeft'
                    className='w-4'
                  />
                }
              />

              <CommonButton
                // disabled={true}
                error={
                  // errorMessage ||
                  !email && !mobile
                  // (mobile && (mobile?.length < 8 || mobile?.length > 16)) ||
                  // (email && (!email?.includes('@') || !email?.includes('.'))) ||
                  // (checkOtp && otp?.length < 6)
                }
                text={'Continue'}
                onClick={otpSend}
                className=''
              />
            </div>
            <div className='login-pwa-wrap'>
              <p className='heading-14'>
                It takes less than a minute to create an account to experience the app in full
              </p>
              <p className='heading-14 you-may-field'>You may also login via the field</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PhoneRecognized;
