import  { useContext, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  apiAddEmail,
  apiSendOtpEmailRegister,
  loginResendotp,
  loginWithToken,
  loginuserotp,
} from 'services/api';
import { showError } from 'utils/notify';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import Errors from 'components/errors/Errors';
import ScrollToTopOnMount from 'components/layout/ScrollToTopOnMount';
import useQueryParams from 'Hook/useQueryParams';
import CommonButton from 'components/formcomponents/CommonButton';
import { MuiOtpInput } from 'mui-one-time-password-input';
import CustomModal from 'components/modal/CustomModal';
import OnboardingContext from 'context/OnboardingContext';
import { CHANGE_PREORDER_STATUS, UPDATE_EMAIL } from 'constants/actions';
import { EMAIL_VALIDATION } from 'constants/regex';
import CommonLabel from 'components/formcomponents/CommonLabel';
import { emailsAccepted } from 'constants';
import { emailIndMap } from 'constants';
import ResendButton, { INITIAL_TIMING } from './components/ResendButton';
import useIsMobile from 'Hook/useIsMobile';
import { ROUTE_LIST } from 'routes/routeList';

/**
 * OnboardingEmail component
 *
 * This component is used to get the user's email address during the onboarding process.
 *
 * @param {Object} props The component props
 * @param {function} props.goTo function to navigate to the next step in the onboarding process
 * @param {boolean} props.isMobile flag to indicate if the component is rendered on a mobile device
 * @param {function} props.setIsAlready function to set the value of isAlready flag
 * @param {function} props.setFromWhereData function to set the data about where the user came from
 * @param {function} props.setDevice function to set the device details
 * @returns {ReactElement} The OnboardingEmail component
 */
const OnboardingEmail = ({
  goTo,
  isMobile,
  setIsAlready,
 
  setFromWhereData,
  setDevice,
}) => {
  const queryParams = useQueryParams();
  const type = queryParams.type || '';
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [checkOtp, setCheckOtp] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [ind, setInd] = useState(0);
  const [isEmailAlreadyRegistered, setIsEmailAlreadyRegistered] = useState(false);

  const isMobileV2 = useIsMobile();

  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);
  const location = useLocation();

  // console.log(queryParams, 'query_params');

  useEffect(() => {
    if (location.pathname === '/email-address' && !onboardingForms?.sessionToken) {
      dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: false });
      navigate(ROUTE_LIST.SMART_FIELD);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        setInd((ind) => (ind - 1 < 0 ? emailsAccepted?.length - 1 : ind - 1));
      } else if (event.key === 'ArrowDown') {
        setInd((ind) => (ind + 1 > emailsAccepted?.length - 1 ? 0 : ind + 1));
      }
      // else if (event.key === "Enter") {
      //   handleChange({ target: { value: `${enteredEmail?.split("@")[0]}@${indMap[ind]}.com` } })
      // }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ind]);

  const goBack = () => {
    dispatchOnboardingForms({ type: UPDATE_EMAIL, payload: enteredEmail });
    if (isMobile) {
      goTo(0);
    } else {
      navigate(-1); // Navigate back one step in the history stack
    }
  };

  const handleChange = (newValue) => {
    setOtp(newValue);
    if (newValue.length === 6) {
      // When opt length is 6 then call automatically
      verifyOtp(newValue);
    }
  };

  const schema = yup.object({
    email: yup.string().email().required('Email is required'),
  });

  const checkRegType = onboardingForms?.loginData?.newUser ? 'registered' : 'login';
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const email = watch('email');

  useEffect(() => {
    setValue('email', onboardingForms?.email || '');
    // eslint-disable-next-line
  }, []);

  const enteredEmail = watch(`email`);

  const verifyOtp = async (otp) => {
    let payload = {
      otp: otp,
      // firebase_device_token: 'abc',
      checkRegType,
      verify_from: 1,
      email,
      randomString: onboardingForms?.loginData?.randomString,
    };

    try {
      const res = await loginuserotp(payload);

      if (res?.data?.status_code === 200) {
        localStorage.setItem('blackjet-website', res?.data?.data?.token);
        if (isMobile) {
          // mobile -> goto basic info screen
          localStorage.setItem('last', 5);
          goTo(5);
          setIsAlready(false);
        } else if (type !== 'pre-order') {
          navigate(ROUTE_LIST.COMPENDIUM);
        } else {
          navigate(`${ROUTE_LIST.COMPENDIUM}?type=pre-order`);
        }
        dispatchOnboardingForms({ type: UPDATE_EMAIL, payload: enteredEmail });
      }
    } catch (error) {
      console.log(error);
      showError(error?.response?.data?.message);
    }
  };

  const sendEmail = async (values) => {
    if (checkOtp) {
      verifyOtp(otp);
    } else {
      // newUser true && phone true then call the add email api
      if (onboardingForms?.loginData?.phone && onboardingForms?.loginData?.newUser) {
        const payload = { email: values?.email, checkRegType };
        try {
          const response = await apiAddEmail(payload);
          // console.log(response, 'this_is_response');

          if (response?.data?.status_code === 200) {
            if (isMobile) {
              // mobile -> goto basic info screen
              localStorage.setItem('last', 5);
              goTo(5);
              setIsAlready(false);
            } else if (type !== 'pre-order') {
              navigate(ROUTE_LIST.COMPENDIUM);
            } else {
              navigate(`${ROUTE_LIST.COMPENDIUM}?type=pre-order`);
            }
            dispatchOnboardingForms({ type: UPDATE_EMAIL, payload: enteredEmail });
          } else {
            if (response?.data?.message === 'Email already exist' || response?.status === 400) {
              setOpenDialog(true);
            }
          }
        } catch (error) {
          console.log(error);
        }
        return;
      }

      let payload = {
        phone: '',
        country_code: '',
        phone_code: '',
        email: values?.email,
        randomString: onboardingForms?.loginData?.randomString,
        checkRegType,
      };
      try {
        let response = await loginWithToken(payload);
        if (response?.data?.status_code === 200) {
          if (response?.data?.data?.onboard_status) {
            // show modal if email already in use
            setOpenDialog(true);
          } else {
            // let token = response?.data?.data?.token;
            // localStorage.setItem('blackjet-website', token);
            if (isMobile) {
              // mobile -> goto basic info screen
              localStorage.setItem('last', 5);
              goTo(5);
              setIsAlready(false);
            } else if (type !== 'pre-order') {
              navigate(ROUTE_LIST.COMPENDIUM);
            } else {
              navigate(`${ROUTE_LIST.COMPENDIUM}?type=pre-order`);
            }
            dispatchOnboardingForms({ type: UPDATE_EMAIL, payload: enteredEmail });
          }
        } else {
          if (response?.data?.message === 'Email already exist') {
            setOpenDialog(true);
          }
        }
      } catch (error) {
        // showError(error?.response?.data?.message);

        setError('email', {
          type: 'manual',
          message: error?.response?.data?.message, // Set your custom error message here
        });
      }
    }
  };

  /**
   * Resend OTP to user's phone or email
   * @param {function} setCount - a function to set the count down timer
   * @returns {Promise<void>}
   */
  const resendOtp = async (setCount) => {
    setOtp('');
    if (setCount) {
      setCount(INITIAL_TIMING);
    }

    if (isEmailAlreadyRegistered) {
      handleSendOtpEmailRegister();
      return;
    }

    let payload = {
      phone_code: onboardingForms?.loginData?.phone_code,
      phone: onboardingForms?.loginData?.phone,
      randomString: onboardingForms?.loginData?.randomString,
      checkRegType,
    };
    console.log(payload, 'this_is_payload');

    try {
      await loginResendotp(payload);
    } catch (error) {
      console.log(error);
      // showError(error?.response?.data?.message)
    }
  };

  const handleChangeEmail = (e) => {
    const val = e.target.value;
    setValue('email', val);
    trigger('email');
  };

  const onSubmit = handleSubmit((values) => {
    sendEmail(values);
  });

  const handleOpenDialogClose = () => {
    setOpenDialog(false);
  };

/**
 * Send OTP to user's email for email registration
 * @param {object} payload - an object containing checkRegType, email and randomString
 * @returns {Promise<void>}
 */
  async function handleSendOtpEmailRegister() {
    const payload = { checkRegType, email, randomString: onboardingForms?.loginData?.randomString };
    try {
      const response = await apiSendOtpEmailRegister(payload);
      if (response?.data?.status_code === 200) {
        handleOpenDialogClose();
        setCheckOtp(true);
        setIsEmailAlreadyRegistered(true);
        if (isMobile) {
          setDevice({ text: `Enter the 6 digit code sent to ${email}`, isFullTxt: true } || '');
          goTo(1);
          setFromWhereData({ from: 'sendOtpEmailRegister', payload });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  // Number First then email enter

  return (
    <div>
      <ScrollToTopOnMount />
      <div className='onboardbg email-screen'>
        <form onSubmit={onSubmit}>
          <div className='login-section-wrap recovery-emails'>
            <h2 className='heading-20'>Enter your email address</h2>
            <div className='subheading-text '>Add your email to aid in account recovery.</div>
            <div className='relative w-full mb-[48px]'>
              <CommonLabel label='Email' />
              <input
                className={` ${errors?.email ? ' red-error ' : ''} common-input`}
                placeholder='Enter your email address'
                {...register('email')}
                autoComplete='off'
                // labelprops={false}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (enteredEmail) {
                      handleChangeEmail({
                        target: { value: `${enteredEmail?.split('@')[0]}@${emailIndMap[ind]}.com` },
                      });
                    }
                  }
                }}
              />
              {enteredEmail && !EMAIL_VALIDATION.test(enteredEmail) && (
                <div className='email-suggestions'>
                  {emailsAccepted?.map((item, index) => (
                    <div
                      className={`${ind === index ? 'active' : ''}`}
                      onClick={() => {
                        handleChangeEmail({
                          target: { value: `${enteredEmail?.split('@')[0]}${item}` },
                        });
                      }}
                      value={`${enteredEmail?.split('@')[0]}${item}`}
                    >{`${enteredEmail?.split('@')[0]}${item}`}</div>
                  ))}
                </div>
              )}

              <Errors error={errors?.email} message={errors?.email?.message} />
            </div>
            {checkOtp && (
              <>
                {' '}
                <div className='otp mt-[24px]'>
                  <div className='otp-instructions text-left text-[16px] mb-1 sm:text-lg sm:mb-4  text-white'>
                    Enter the 6 digit code sent to your email
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
                </div>
                <div className='resend-btn flex flex-row justify-start mt-3 mb-[48px]  h-10 items-start '>
                  <ResendButton resendOtp={resendOtp} />
                  {/* <button
                    onClick={() => resendOtp()}
                    id="ResendCode"
                    disabled={countdown != 0 ? true : false}
                    className="text-center !bg-[#333333] disabled:cursor-not-allowed disabled:text-gray-600 text-sm font-['Hauora'] font-bold p-2 rounded-[39px] text-[#f2f2f2]"
                  >
                    Resend code {countdown == 0 ? "" : `(${countdown})`}
                  </button> */}
                </div>
              </>
            )}
            <div className="form-buttons flex flex-row gap-12 w-full font-['Hauora'] items-start">
              <button
                id='RectButtons'
                type='button'
                onClick={goBack}
                className='back-btn border-solid border-white flex flex-row justify-center p-4 w-16 h-12 cursor-pointer items-center border rounded'
              >
                <img
                  src='https://file.rendit.io/n/ln9TIOoBGF72MNAYYUyv.svg'
                  alt='ArrowLeft'
                  id='ArrowLeft'
                  className='w-4'
                />
              </button>
              <CommonButton
                text='Continue'
                type='submit'
                error={
                  errors?.email ||
                  (enteredEmail && (!enteredEmail?.includes('@') || !enteredEmail?.includes('.')))
                }
              />
            </div>
          </div>
        </form>

        <CustomModal
          openDialog={openDialog}
          handleCloseDialog={handleOpenDialogClose}
          isTitleRequired={true}
          isActionButtonRequired={true}
          className='dialog-modal-container'
          title={''}
          disableClose={false}
          maxWidth='xs'
          actionButtons={
            <div className='dialog-action-btn'>
              <CommonButton
                onClick={() => handleOpenDialogClose()}
                text={isMobileV2 ? 'Dont’ use' : 'Use different email'}
                style={{ width: '70%' }}
              />
              <CommonButton
                onClick={() => handleSendOtpEmailRegister()}
                style={{ width: '30%' }}
                pressedClass='pressed-arrow'
                className='dark-btn'
                text={isMobileV2 ? 'Use' : 'Use this email'}
                type=''
              />
            </div>
          }
        >
          <div className='dialog-main'>
            <div className='dialog-text-highlight'>
              <span>{email} </span> is already in use with an existing account
            </div>
            <p className='dialog-text-description'>
              If you choose to use it here, we will reassign the email to this account and detach it
              from the existing account after verification
            </p>
          </div>
        </CustomModal>
      </div>
    </div>
  );
};

export default OnboardingEmail;
