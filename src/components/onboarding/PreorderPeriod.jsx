import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { LinearProgress } from '@mui/material';

import useQueryParams from 'Hook/useQueryParams';
import { getUserData, sendApp } from 'api/onboarding';
import { Entermobilegetapp } from 'components/Popup';
import Errors from 'components/errors/Errors';
import CommonButton from 'components/formcomponents/CommonButton';
import CommonInput from 'components/formcomponents/CommonInput';
import ScrollToTopOnMount from 'components/layout/ScrollToTopOnMount';
import { CHANGE_PREORDER_STATUS } from 'constants/actions';
import OnboardingContext from 'context/OnboardingContext';
import { openApp } from 'helpers';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { PWA_REDIRECTION_LINK, ROUTE_LIST } from 'routes/routeList';
import { searchIndustries, signupComplete } from 'services/api';
import * as yup from 'yup';
const schema = yup.object({
  // occupation: yup.string().required("Occupation is required"),
  occupation: yup.string(),
  annual_income: yup.string(),
  // industries: yup
  //   .array()
  //   .of(yup.string())
  //   .min(1, "Minimum 1 required")
  //   .required("Min 1 is required"),
});

const PreorderPeriod = ({
  currentIndex = 0,
  goTo,
  isMobile = false,
  isAlready = false,
  registered = false,
  isPreOrder = false,
  setCross = () => {},
}) => {
  const queryParams = useQueryParams();
  // console.log(queryParams, 'this_is_queryParams');

  const alreadyRegistered = queryParams?.registered || registered;
  // const already = queryParams?.already || isAlready;

  const navigate = useNavigate();
  const [counter, setCounter] = useState(10);
  const [showBack, setShowBack] = useState(false);
  const [userData, setUserData] = useState(null);
  const [sliderValue, setSliderValue] = useState(200000);

  const components = {
    DropdownIndicator: null,
  };

  const {
    register,
    handleSubmit,

    setValue,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);
  const location = useLocation();

  const [defaultValueIndustries, setDefaultValueIndustries] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState([]);

  /**
   * Asynchronously loads options based on the input value.
   *
   * @param {string} [inputValue="a"] - The value to search for.
   * @return {Promise<Array<Object>>} A promise that resolves to an array of options.
   * Each option is an object with a 'value' and 'label' property.
   */
  const loadOptions = async (inputValue = 'a') => {
    let payload = {
      skip: 1,
      limit: 50,
      search: inputValue,
    };
    try {
      const response = await searchIndustries(payload);
      const options = response?.data?.data?.map((option) => ({
        value: option._id,
        label: option.name,
      }));
      setDefaultValueIndustries(options);
      return options;
    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };
  useEffect(() => {
    if (isMobile) {
      const element = document.getElementById('preorder-mobile');
      if (element) {
        element.classList.remove('preorder-animate');
        void element.offsetWidth;
        element.classList.add('preorder-animate');
      }
    }
    // eslint-disable-next-line
  }, [currentIndex]);

  useEffect(() => {
    if (location.pathname === ROUTE_LIST.GRATIAS_TIBI_AGO && !onboardingForms?.sessionToken) {
      dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: false });
      navigate(ROUTE_LIST.SMART_FIELD);
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    prefill();
    loadOptions();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isMobile) {
      handleResend();
    }

    // eslint-disable-next-line
  }, [userData]);

  useState(() => {
    if (counter > 0) {
      const interval = setInterval(() => {
        setCounter((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [counter]);

  const prefill = async () => {
    let response = await getUserData();
    if (response?.data?.status_code === 200) {
      const result = response?.data?.data || {};
      setUserData(result);
      setValue('occupation', result?.occupation || '');
      setValue('annual_income', result?.annual_income || '');
      setSliderValue(parseInt(result?.annual_income || 200000));
      setSelectedOptions(
        result?.industry_data?.map((item) => ({
          value: item?._id,
          label: item?.name,
        })),
      );
      setCross(result?.is_membership_payment_page_completed);
      setShowBack(
        isMobile ? false : alreadyRegistered && !result?.is_membership_payment_page_completed,
      );
    }
  };

  const submitRegistration = async (values) => {
    let payload = {
      occupation: values?.occupation,
      annual_income: values?.annual_income ? values?.annual_income : '200000',
      industries: selectedOptions?.flatMap((item) => item.value),
    };
    try {
      const res = await signupComplete(payload);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSliderChange = (value) => {
    // The 'value' parameter is the updated value of the slider
    setSliderValue(value);
    setValue('annual_income', value);
  };
  const onSubmit = handleSubmit(async (values) => {
    const res = await submitRegistration(values);
    if (res?.data?.status_code === 200) {
      const getLocalStorageToken = localStorage.getItem('blackjet-website');
      // app.theblackjet.biz/pwa/{encoded token}
      // need to redirect to app
      if (getLocalStorageToken) {
        window.location.href = `${PWA_REDIRECTION_LINK.REDIRECTION}/${getLocalStorageToken}`;
        return;
      }
      if (isMobile) {
        goTo(0);
        // toggleDrawer()
        const getLocalStorageToken = localStorage.getItem('blackjet-website');
        if (getLocalStorageToken) {
          window.location.href = `${PWA_REDIRECTION_LINK.REDIRECTION}/${getLocalStorageToken}`;
          navigate('/');
          return;
        }
        openApp();
      } else {
        navigate('/');
      }
    }
  });

  const handleChange = (selectedValues) => {
    loadOptions('a');
    setSelectedOptions(selectedValues);
  };

  const goBack = () => {
    if (isMobile) {
      goTo(6);
    } else {
      navigate(-1);
    }
  };

  const isBothInputHaveValueForExistingUser =
    userData?.industry_data?.length > 0 && userData?.occupation !== '';

  // console.log(isBothInputHaveValueForExistingUser, '__isBothInputHaveValueForExistingUser__');

  const questionDes = () => {
    if (isBothInputHaveValueForExistingUser && !onboardingForms?.loginData?.newUser) {
      return "Let's make your Black Jet experience even better! Take  a moment to review your answers:";
    }
    if (
      queryParams?.registered ||
      queryParams?.type === 'pre-order' ||
      onboardingForms?.loginData?.newUser
    ) {
      return 'Please answer a few final questions to further enhance your Black Jet experience:';
    }
    if (!isBothInputHaveValueForExistingUser) {
      return "Let's make your Black Jet experience even better! Take a moment to answer a few questions:";
    }
  };

  // if (isMobile) {
  //   return 'We will keep you informed of our launch in the app'; //this text while pre order
  // }

  // console.log(onboardingForms.loginData, '__newUser__');

  const headingDes = () => {
    // when it's a free preview while register
    if (
      (onboardingForms?.loginData?.newUser && !onboardingForms?.membershipData?.preOrder) ||
      (!onboardingForms?.loginData?.is_membership_purchased &&
        userData?.is_membership_purchased &&
        !onboardingForms?.membershipData?.preOrder)
    ) {
      return null;
    }

    // it mean it's a free preview and again click on free preview
    if (!onboardingForms?.loginData?.newUser && !userData?.is_membership_purchased) {
      return null;
    }

    if (
      onboardingForms?.loginData?.newUser &&
      !onboardingForms?.membershipData?.preOrder &&
      userData?.is_membership_purchased
    ) {
      return null;
    }

    if (userData?.is_membership_purchased && onboardingForms?.membershipData?.preOrder) {
      return (
        <div className={`small-heading ${isMobile ? 'text-left' : ''}`}>
          {isMobile
            ? 'We will keep you informed of our launch in the app'
            : ' We will keep you informed about our launch through the app'}
        </div>
      );
    }
    if (!onboardingForms?.loginData?.newUser) {
      return (
        <div className={`small-heading ${isMobile ? 'text-left' : ''}`}>
          You have an account with us. We've sent the app via text. Please log in there
        </div>
      );
    }

    return null;
  };

  const handleResend = async () => {
    if (!userData) {
      return;
    }
    const payload = {
      type: userData?.is_membership_purchased ? 'member' : 'free',
      phone_code: userData?.phone_code || onboardingForms.loginData.phone_code,
      phone: userData?.phone || onboardingForms.loginData.phone,
    };
    await sendApp(payload);
    setCounter(counter === 0 ? 10 : counter);
  };

  // console.log({ onboardingForms, userData }, 'newUser___');

  // onboardingForms.loginData.newUser this is initial login data and we are verifying if user is new or not
  // if user is new then show congrats screen else show member screen
  const freePreviewText = !onboardingForms.loginData.newUser ? (
    <p>
      <span className='second'>You’ve already signed up</span>
    </p>
  ) : (
    <p>
      <span className='first'>Cheers!</span>
      <br />
      <span className='second'>Your sign up is complete</span>
    </p>
  );

  const memberPrevText = () => {
    if (
      (onboardingForms?.loginData?.newUser && onboardingForms?.membershipData?.preOrder) ||
      (!onboardingForms?.loginData?.is_membership_purchased &&
        userData?.is_membership_purchased &&
        onboardingForms?.membershipData?.preOrder)
    ) {
      return (
        <p>
          <span className='second'>Congrats! Your pre-order is complete</span>
        </p>
      );
    }
    if (
      (onboardingForms?.loginData?.newUser && !onboardingForms?.membershipData?.preOrder) ||
      (!onboardingForms?.loginData?.is_membership_purchased &&
        userData?.is_membership_purchased &&
        !onboardingForms?.membershipData?.preOrder)
    ) {
      return (
        <p>
          <span className='second'>Congrats! Your order is complete</span>
        </p>
      );
    }
    if (!onboardingForms.loginData.newUser && userData?.is_membership_purchased) {
      return (
        <p>
          <span className='second'>You’ve already signed up</span>
        </p>
      );
    }
  };

  if (!userData) {
    return (
      <div className='loader-wrap-editor'>
        <LinearProgress color='#000' />
      </div>
    );
  }

  return (
    <div id='preorder-mobile' className='preorder-animate'>
      {isMobile && <Entermobilegetapp />}
      <ScrollToTopOnMount />
      <form onSubmit={onSubmit}>
        <div className='onboardbg congrats-screen'>
          <div>
            <div className={`main-heading ${isMobile ? 'text-left' : ''}`}>
              <>
                <>{userData?.is_membership_purchased ? memberPrevText() : freePreviewText}</>
              </>
            </div>

            {headingDes()}
            {/* {isMobile
                  ? 'We will keep you informed of our launch in the app'
                  : 'We will keep you informed about our launch through the app'} */}

            <div
              className={`pre-order-hr ${
                onboardingForms?.membershipData?.preOrder ? 'preorder' : 'notpreorder'
              }`}
            ></div>
            {/* </div> */}
            <div className='congo-inner'>
              <div className='congrats-wrap'>
                <div className='flex flex-col justify-center gap-[24px]  items-start'>
                  <div className='heading-16'>{questionDes()}</div>
                  <div className='form-content flex flex-col gap-1 w-full items-start'>
                    <div className='holder-label'>What’s your profession?</div>
                    <CommonInput
                      placeholder='Your occupation'
                      register={register}
                      controlled={false}
                      name='occupation'
                      error={errors?.occupation}
                    />
                    <Errors error={errors?.occupation} message={errors?.occupation?.message} />
                  </div>
                  <div className="form-content overhead flex flex-col gap-1 w-full font-['Hauora'] items-start">
                    <div className='holder-label'>
                      What business or industry
                      <span className="font-['Hauora'] font-extralight">(ies)</span>
                      <span className='holder-label'> do you work in?</span>
                    </div>

                    <div className=' flex flex-row gap-1 w-full  items-center relative rounded'>
                      <AsyncCreatableSelect
                        className='create-select select-industries'
                        // menuIsOpen={true}
                        isMulti
                        cacheOptions
                        components={components}
                        value={selectedOptions}
                        onChange={handleChange}
                        loadOptions={loadOptions}
                        defaultOptions={defaultValueIndustries}
                        onBlurResetsInput={false}
                        placeholder={
                          <span>
                            <FontAwesomeIcon className='plus-icon' icon={faAdd} /> industry
                          </span>
                        }
                        // styles={customStyles}
                        // isClearable={false} // Allow clearing the selected value
                        createOption={(inputValue) => ({
                          label: inputValue,
                          value: inputValue,
                        })} // Enable creation of new options from custom text input
                      />
                    </div>
                  </div>
                  <div className="form-content flex flex-col gap-3 w-full font-['Hauora'] items-start">
                    <div className='flex flex-col gap-1 w-full items-start'>
                      <div id='Text1' className='holder-label'>
                        Please choose the amount that best represents your estimated annual income.
                      </div>

                      <div className='w-full range-slider-wrap'>
                        <Slider
                          min={100000}
                          max={500000}
                          step={10000}
                          onChange={handleSliderChange}
                          value={sliderValue}
                        />
                      </div>
                    </div>
                    <div className='dollar-txt'>
                      {`${sliderValue === 100000 ? '≤ ' : sliderValue === 500000 ? '≥ ' : ''}`}${' '}
                      {sliderValue?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </div>
                  </div>
                  {!isMobile && (
                    <div className="form-content flex flex-col gap-[8px] w-full h-12 font-['Hauora'] items-center">
                      <div className='bottom-txt'>
                        Please sign into the Black Jet App sent to your phone
                      </div>
                      <div
                        onClick={handleResend}
                        className={`click-resend ${counter <= 0 ? 'active' : ''}`}
                      >
                        Click here to resend {counter > 0 && counter}
                      </div>
                    </div>
                  )}
                </div>
                <div className='finish-div'>
                  {showBack && (
                    <button id='RectButtons' onClick={goBack} className='arrow-btn' type='button'>
                      <img
                        src='https://file.rendit.io/n/ln9TIOoBGF72MNAYYUyv.svg'
                        alt='ArrowLeft'
                        id='ArrowLeft'
                        className='w-4'
                      />
                    </button>
                  )}
                  <CommonButton
                    text={isMobile ? 'Finish and open App' : 'Finish'}
                    // text={"Finish"}
                    className={'finish-btn preorder-finish'}
                    type='submit'
                  />
                  {/* {isMobile && <Entermobilegetapp />} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PreorderPeriod;
