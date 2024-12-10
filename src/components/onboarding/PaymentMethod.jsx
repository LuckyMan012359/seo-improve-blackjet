import CardSection, { getTotalPrice } from 'components/CardSection';
import { useContext, useEffect, useState } from 'react';
// import { getPlanPrice } from 'services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import ScrollToTopOnMount from 'components/layout/ScrollToTopOnMount';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Errors from 'components/errors/Errors';

import {
  convertToAmexFormat,
  handleErrorClick,
  handleFooterNavbar,
  handleLegalSlide,
  isValidCreditCardNumber,
  isValidDate,
} from 'helpers';
import {
  AMEX_CREDIT_CARD_CVV,
  AMEX_TYPE_CHECK,
  CREDIT_CARD_CVV,
  CREDIT_CARD_VALIDITY,
  MASTERCARD_TYPE_CHECK,
  VISA_TYPE_CHECK,
} from 'constants/regex';
import { addPayment, apiAddMembership, getCardType, apiGetPeymentCountry } from 'api/onboarding';
import { showError, showMessage } from 'utils/notify';
// import useQueryParams from 'Hook/useQueryParams';
import CommonLabel from 'components/formcomponents/CommonLabel';
import CommonInput from 'components/formcomponents/CommonInput';
import CommonButton from 'components/formcomponents/CommonButton';
import OnboardingContext from 'context/OnboardingContext';
import { CHANGE_PREORDER_STATUS, CLEAR_ONBOARDING, UPDATE_PAYMENT } from 'constants/actions';
import { cardTypes } from 'constants';
import { isEmpty } from 'helpers/common';
import PaymentText, { InitiationFee } from 'components/payment/PaymentText';
import { ROUTE_LIST } from 'routes/routeList';
import { MUIAutoComplete } from './components/MUIAutoComplete';

/**
 * Schema for the payment form
 * @param {Array} countryList - List of countries from the api
 * @returns {Object} - Yup schema object
 */
const schema = (countryList) => {
  return yup.object().shape({
    payment_details: yup.object().shape({
      cardholder_name: yup.string().required('Please enter the name as shown on the card'),
      card_number: yup.string().required('Please enter a valid credit card number'),
      card_expiry: yup.string().required('Enter a valid expiry date'),
      cvv: yup.string().required('Enter a valid 3-digit CVV found on the back of your card'),
      // .when('card_number', {
      //   is: (value) => checkAmexCvv(value), // Check if the card is American Express
      //   then: yup.string().required("Enter a valid 4-digit CVV found on the back of your American Express").matches(CREDIT_CARD_CVV_AMEX, 'Invalid CVV number'), // If American Express, require 4 digits
      //   otherwise: yup.string().required("Enter a valid 3-digit CVV found on the back of your Visa").matches(CREDIT_CARD_CVV, 'Invalid CVV number') // If not American Express, require 3 digits
      // })
      //   .when('payment_details.card_number', (card_number, schema) => {
      //     return checkAmexCvv(card_number) ? schema.required("Enter a valid 4-digit CVV found on the back of your American Express") : schema.required("Enter a valid 3-digit CVV found on the back of your card");
      // })
    }),
    streetAddress: yup.string().required('Enter a valid street address'),
    city: yup.string().required('Enter a valid city'),
    state: yup.string().required('Enter a valid state abbreviation'),
    post_code: yup.string().required('Enter a valid post code'),
    country: yup.string().required('Enter a valid country'),

    // initiation_fees: yup.string('Initiation fees must be a number').when('tier', {
    //   is: (tier) => {
    //     return tier?.length === 0;
    //   },
    //   then: () =>
    //     yup
    //       .string()
    //       .required('Initiation fees are required when no tiers are specified')
    //       .min(0, 'Initiation fees must be greater than 0'),
    //   otherwise: () =>
    //     yup
    //       .string()
    //       .typeError('Initiation fees must be a number')
    //       .min(0, 'Initiation fees must be greater than 0'),
    // }),

    business_name: yup.string(),
    abn: yup.string(),
    card_type: yup.string(),
    isConfirm: yup
      .boolean()
      .required('Please agree to the above')
      .oneOf([true], 'Please agree to the above'),
  });
};

const PaymentMethod = ({ goTo, isMobile, currentIndex }) => {
  // const queryParams = useQueryParams();
  // const type = queryParams.type || '';
  // const [checkPrice, setCheckPrice] = useState();
  const navigate = useNavigate();
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);
  const [abn, setAbn] = useState('');
  const [cardTypeImage, setCardTypeImage] = useState('');
  const [cvv, setCVV] = useState('');
  const [cardTypeId, setCardTypeId] = useState('');

  const [countryList, setCountryList] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const details = onboardingForms?.membershipData || null;

  useEffect(() => {
    if (location.pathname === ROUTE_LIST.AT_YOUR_CONVENIENCE && !onboardingForms?.sessionToken) {
      dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: false });
      navigate(ROUTE_LIST.SMART_FIELD);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAbnChange = (event) => {
    let inputText = event.target.value;
    inputText = inputText.replace(/[^0-9\s]/g, '');
    if (inputText.length > 14) return;
    const formattedText = formatText(inputText);
    setAbn(formattedText);
    setValue('abn', formattedText);
    trigger('abn');
  };

  const formatText = (inputText) => {
    // adding ## ### ### ###
    let formattedText = '';
    let inputTextTrimmed = inputText.replace(/\s/g, '');
    for (let i = 0; i < inputTextTrimmed.length; i++) {
      if (i === 2 || i === 5 || i === 8) {
        formattedText += ' ' + inputTextTrimmed[i];
      } else {
        formattedText += inputTextTrimmed[i];
      }
    }
    return formattedText;
  };

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema(countryList)),
  });

  const getCountry = async () => {
    try {
      const response = await apiGetPeymentCountry();
      const listData =
        response?.data?.data.map((ele) => {
          return {
            label: ele.country_name,
            value: ele.country_name,
          };
        }) || [];
      setCountryList(listData || []);
    } catch (error) {
      console.error(error);
    }
  };

  const goBack = () => {
    dispatchOnboardingForms({ type: UPDATE_PAYMENT, payload: getValues() });
    if (isMobile) {
      goTo(6);
    } else {
      navigate(-1); // Navigate back one step in the history stack
    }
  };

  const getCardTypeFn = async () => {
    try {
      const res = await getCardType();
      setCardTypeId(res?.data?.data[0]?._id || '');
    } catch (error) {}
  };

  useEffect(() => {
    // Call the getCardType
    getCardTypeFn();
    getCountry();
    // (async () => {
    //   try {
    //     const res = await getPlanPrice();
    //     setCheckPrice(res?.data?.data?.find((item) => item));
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })();
  }, [currentIndex]);

  useEffect(() => {
    setValue('country', 'Australia');
    Object.keys(onboardingForms?.payment)?.forEach((key) => {
      if (key === 'isConfirm') {
        setValue(key, onboardingForms?.payment[key]);
        // setChecked(onboardingForms?.payment[key]);
      } else if (key === 'country') {
        setValue(key, onboardingForms?.payment[key] || 'Australia');
      } else if (key === 'payment_details') {
        Object.keys(onboardingForms?.payment[key])?.forEach((subkey) => {
          if (subkey === 'card_number') {
            handleChange({
              target: { value: onboardingForms?.payment[key][subkey] },
            });
          } else if (subkey === 'card_expiry') {
            handleExpiryChange({
              target: { value: onboardingForms?.payment[key][subkey] },
            });
          } else if (subkey === 'cvv') {
            handleCVVChange({
              target: { value: onboardingForms?.payment[key][subkey] },
            });
          } else {
            setValue(`${key}.${subkey}`, onboardingForms?.payment[key][subkey] || '');
          }
        });
      } else {
        setValue(key, onboardingForms?.payment[key] || '');
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = handleSubmit((values) => {
    checkCreditCard(values);
  });

  const checkCreditCard = (values) => {
    if (!isEmpty(errors)) {
      return;
    }
    const card_type = getValues('card_type');
    if (card_type) {
      if (!isValidCreditCardNumber(values?.payment_details?.card_number, card_type)) {
        setError('payment_details.card_number', {
          type: 'custom',
          message: 'Invalid credit card number',
        });
      } else if (!checkExpiry(values?.payment_details?.card_expiry)) {
        setError('payment_details.card_expiry', {
          type: 'custom',
          message: 'Invalid expiry date',
        });
      } else if (!handleCvvBlur(values?.payment_details?.cvv)) {
        setError('payment_details.cvv', {
          type: 'custom',
          message: 'Invalid CVV',
        });
      } else {
        // delete values.isConfirm;
        // delete values.card_type;
        addPaymentDetails(values);
      }
    }
    // .test('validCreditCard', 'Invalid credit card number', value => )
  };

  const addPaymentDetails = async (values) => {
    // navigate(`${ROUTE_LIST.GRATIAS_TIBI_AGO}?type=pre-order`); //Todo! temporary simulation
    // navigate(`${ROUTE_LIST.GRATIAS_TIBI_AGO}?already=1`);
    // return;
    const newReq = {
      paymentMethod: cardTypeId,
      cardholderName: values?.payment_details.cardholder_name,
      verId: values?.payment_details.card_number,
      cardType: values.card_type,
      expiry: values?.payment_details.card_expiry,
      cvv: values?.payment_details.cvv,
      billingAddress: {
        streetAddress: values?.streetAddress,
        city: values?.city,
        state: values?.state,
        postCode: values?.post_code,
        country: values?.country,
      },
      businessName: values?.business_name,
      abn: values?.abn || '',
      membershipAgreement: values?.isConfirm,
    };

    try {
      setLoading(true);
      let response = await addPayment({
        ...newReq,
        is_website: true,
      });
      showMessage(
        // 'Oops! Something went wrong with your payment. Please check your details and try again',
        response?.data?.message || 'Payment functionality is disabled',
      );

      const requestBody = {
        price: getTotalPrice(details).split(',').join(''),
        membership_id: onboardingForms?.membershipData?._id,
        name: onboardingForms?.membershipData?.name,
      };

      const addMemberShipRes = await apiAddMembership(requestBody);
      if (response?.data?.status_code === 200 && addMemberShipRes?.data?.status_code === 200) {
        if (isMobile) {
          goTo(8);
        } else if (!onboardingForms?.loginData.newUser) {
          navigate(`${ROUTE_LIST.GRATIAS_TIBI_AGO}?already=1`);
        } else if (onboardingForms.loginData.preOrder) {
          navigate(`${ROUTE_LIST.GRATIAS_TIBI_AGO}?type=pre-order`);
        } else {
          navigate(`${ROUTE_LIST.GRATIAS_TIBI_AGO}?type=normal`);
        }
        dispatchOnboardingForms({ type: CLEAR_ONBOARDING, payload: values });
      } else {
        showError(
          addMemberShipRes?.data?.message ||
            'Oops! Something went wrong with your payment. Please check your details and try again',
        );
      }

      setLoading(false);
    } catch (error) {
      console.log(error, 'this_is_error');
      setLoading(false);
      showError(
        // 'Oops! Something went wrong with your payment. Please check your details and try again',
        error?.data?.message || 'Payment functionality is disabled',
      );
    }
  };

  const handleChange = (e) => {
    let input = e.target.value;
    let sanitizedValue = input.replace(/[^0-9\s]/g, ''); // Remove any characters other than numbers and spaces
    let formattedValue = sanitizedValue.replace(/\s/g, '').trim(); // Remove existing spaces
    let creditCardTypeImage = '';
    let cardType;
    if (MASTERCARD_TYPE_CHECK.test(formattedValue)) {
      creditCardTypeImage = 'https://file.rendit.io/n/KDuFP5rJgkAU4C3ERpY4.svg';
      setValue('card_type', cardTypes.MASTERCARD);
      cardType = cardTypes.MASTERCARD;
      // formattedValue = formattedValue.replace(/(\d{4})/g, '$1 ').trim(); // Add space after every 4 digits
    } else if (VISA_TYPE_CHECK.test(formattedValue)) {
      creditCardTypeImage = 'https://file.rendit.io/n/KSX9KAMSqA6CNWV5Tehm.svg';
      setValue('card_type', cardTypes.VISA);
      cardType = cardTypes.VISA;
    } else if (AMEX_TYPE_CHECK.test(formattedValue)) {
      creditCardTypeImage = 'https://file.rendit.io/n/fVXmZn83YKBKv9vkU2mG.svg';
      setValue('card_type', cardTypes.AMEX);
      cardType = cardTypes.AMEX;
    }
    let maxLength = 19;
    if (cardType === cardTypes.AMEX) {
      formattedValue = convertToAmexFormat(formattedValue);
      maxLength = 17;
    } else {
      formattedValue = formattedValue.replace(/(\d{4})/g, '$1 ').trim();
      maxLength = 19;
    }
    setCardTypeImage(creditCardTypeImage);
    if (formattedValue?.length <= maxLength) {
      setCreditCardNumber(formattedValue);
      setValue('payment_details.card_number', formattedValue?.replaceAll(' ', ''));
      trigger('payment_details.card_number');
    }
  };

  const handleExpiryChange = (event) => {
    let value = event.target.value;
    const cursorPosition = event.target.selectionStart;
    const isCursorAtEnd = cursorPosition === event.target.value.length;
    if (!isCursorAtEnd) {
      event.target.selectionStart = event.target.selectionEnd = value.length;
      return;
    }

    // Only allow digits and slashes, and remove any other characters
    value = value.replace(/[^\d/]/g, '');

    // Format value to MM/YY
    if (value.length > 2) {
      if (value.charAt(2) !== '/') {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }

    // Limit to 5 characters (MM/YY)
    if (value.length > 5) {
      value = value.slice(0, 5);
    }

    setExpiry(value);
    setValue('payment_details.card_expiry', value);
    trigger('payment_details.card_expiry');
    // focus on the last element
  };

  const handleBlur = () => {
    const card_type = getValues('card_type');
    if (card_type && !isValidCreditCardNumber(creditCardNumber?.replaceAll(' ', ''), card_type)) {
      setError('payment_details.card_number', {
        type: 'custom',
        message: 'Invalid credit card number',
      });
    } else if (!card_type) {
      setError('payment_details.card_number', {
        type: 'custom',
        message: 'Invalid credit card number',
      });
    }
  };

  const handleTimeBlur = () => {
    checkExpiry(expiry);
  };

  const handleCVVChange = (e) => {
    const card_type = getValues('card_type');
    if (card_type) {
      let input = e.target.value;
      if (
        (card_type === cardTypes.AMEX && input.length <= 4) ||
        (card_type !== cardTypes.AMEX && input.length <= 3)
      ) {
        setCVV(input);
        setValue('payment_details.cvv', input);
        trigger('payment_details.cvv');
      }
    }
  };

  const handleCvvBlur = () => {
    const card_type = getValues('card_type');
    let res = true;
    if (card_type) {
      if (card_type === cardTypes.AMEX) {
        if (!AMEX_CREDIT_CARD_CVV.test(cvv)) {
          res = false;
          setError('payment_details.cvv', {
            type: 'custom',
            message: 'Enter a valid 4-digit CVV found on the back of your American Express',
          });
        }
      } else {
        if (!CREDIT_CARD_CVV.test(cvv)) {
          res = false;
          setError('payment_details.cvv', {
            type: 'custom',
            message: `Enter a valid 3-digit CVV found on the back of your ${card_type}`,
          });
        }
      }
    }
    return res;
  };

  const checkExpiry = (value) => {
    let res = true;
    if (!CREDIT_CARD_VALIDITY.test(value)) {
      setError('payment_details.card_expiry', {
        type: 'custom',
        message: 'Invalid expiry date',
      });
      res = false;
    } else if (!isValidDate(value)) {
      setError('payment_details.card_expiry', {
        type: 'custom',
        message: 'Card has expired',
      });
      res = false;
    }
    return res;
    // .matches(CREDIT_CARD_VALIDITY, 'Invalid expiry date').test('valid-expiry', 'Card has expired', isValidDate)
  };

  const handleExpiryKeyDown = (e) => {
    if (e.key === '/') {
      e.preventDefault();
    }
  };

  const handleAgreement = () => {
    if (isMobile) {
      handleLegalSlide();
      handleFooterNavbar();
      navigate('/legal?type=Membership Agreement'); // only added by rohit
      return;
    } else {
      navigate('/legal?type=Membership Agreement');
    }
  };
  const countryWatch = watch('country');

  const isValidCountry = (country) => {
    if (!country || !countryList || countryList?.length === 0) return false;
    const isPresent = countryList.find((item) => item.value === country);
    if (!isPresent) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (isValidCountry(countryWatch)) {
      setError('country', {
        type: 'custom',
        message: `Oops! We couldn't find that country.  Please double-check your entry.`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryWatch, errors, countryList]);

  const isShowPriceHeader = details?.discountInitiationFees === '0';

  return (
    <div className='payment-main-section'>
      <ScrollToTopOnMount />

      <div className='payment-inner max-sm:block mt-[28px]'>
        {!isMobile && (
          <div className='col-md-6 card-section-wrapper '>
            <CardSection paymentheight='payment-wrap' payment={true} />
          </div>
        )}
        <div className='col-md-6'>
          <div className='flex flex-col gap-2'>
            {isMobile && isShowPriceHeader && <ShowPriceHeader />}
          </div>
          <div
            id='PaymentChoicesRoot'
            className="payment-form-wrap flex flex-col justify-between gap-3 w-full font-['Hauora'] items-start"
          >
            {!isMobile && <div className='label-txt'>Payment methods</div>}
            <div id='CreditCard' className='credit-card  rounded'>
              <div id='Text1' className='credit-txt'>
                Credit Card
              </div>
              <div className='credit-card-wrapp flex flex-row w-1/3 items-center gap-2 justify-end'>
                <div className='credit-card-images flex flex-row gap-2 justify-between mt-0 w-3/4 items-center'>
                  <img
                    src='https://file.rendit.io/n/fVXmZn83YKBKv9vkU2mG.svg'
                    alt='CreditCards'
                    id='CreditCards'
                    className='w-8'
                  />
                  <img
                    src='https://file.rendit.io/n/KSX9KAMSqA6CNWV5Tehm.svg'
                    alt='CreditCards1'
                    id='CreditCards1'
                    className='w-8'
                  />
                  <img
                    src='https://file.rendit.io/n/KDuFP5rJgkAU4C3ERpY4.svg'
                    alt='CreditCards2'
                    id='CreditCards2'
                    className='w-8'
                  />
                </div>
                <div className='payment-radio'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <circle cx='12' cy='12' r='11.5' fill='#303030' stroke='#949494' />
                    <circle cx='12' cy='12' r='5' fill='white' />
                  </svg>

                  {/* <Radio className='!m-0' name='terms' checked /> */}
                  {/* <div className='payment-radio-text'>
                  <div className='radio-circle'></div>
                </div> */}
                </div>
              </div>
            </div>
            {/* <div
              id="BPay"
              className="border-solid border-[#616161] flex flex-row justify-between w-full h-12 font-['Hauora'] items-center p-3 px-3 border rounded"
            >
              <div
                id="Text2"
                className="text-sm font-medium text-[#f2f2f2] mt-1"
              >
                BPAY
              </div>
              <div className="flex flex-row gap-2 w-16 items-center">
                <img
                  src="https://file.rendit.io/n/0neVaKHGiUyvAue7xcGe.svg"
                  alt="CreditCards4"
                  id="CreditCards4"
                  className="w-10"
                />
                <div className="payment-radio">
                  <Radio className="!m-0" name="terms" />
                </div>
              </div>
            </div> */}
            <form className='w-full' onSubmit={onSubmit}>
              <div className='card-holder'>
                <div className='col-md-12 p-0 main-input-div'>
                  <CommonLabel label='Cardholder name' />
                  <CommonInput
                    register={register}
                    name='payment_details.cardholder_name'
                    placeholder='Enter name'
                    error={errors?.payment_details?.cardholder_name}
                    controlled={false}
                  />
                  <Errors error={errors?.payment_details?.cardholder_name} />
                </div>
                <div className='col-md-12 main-input-div p-0'>
                  <CommonLabel label='Credit Card Number' />
                  <div className='relative'>
                    <CommonInput
                      inputMode='numeric'
                      onBlur={handleBlur}
                      value={creditCardNumber}
                      placeholder='Enter card number'
                      error={errors?.payment_details?.card_number}
                      name={'payment_details.card_number'}
                      controlled={true}
                      onChange={handleChange}
                    />
                    {cardTypeImage && (
                      <img
                        className='absolute top-[30%] right-[2%]'
                        alt='card type'
                        src={cardTypeImage}
                      />
                    )}
                  </div>
                  <Errors error={errors?.payment_details?.card_number} />
                </div>

                <div className='content-row expiry-input-div'>
                  <div className='col-md-6 pl-0'>
                    <CommonLabel label='Card expiry' />
                    <CommonInput
                      onKeyDown={handleExpiryKeyDown}
                      inputMode='numeric'
                      value={expiry}
                      onBlur={handleTimeBlur}
                      placeholder='MM/YY'
                      error={errors?.payment_details?.card_expiry}
                      name={'payment_details.card_expiry'}
                      controlled={true}
                      onChange={handleExpiryChange}
                    />
                    <Errors error={errors?.payment_details?.card_expiry} />
                  </div>
                  <div className='col-md-6 p-0'>
                    <CommonLabel label='CVV' />
                    <CommonInput
                      inputMode='numeric'
                      type='number'
                      onBlur={handleCvvBlur}
                      value={cvv}
                      onChange={handleCVVChange}
                      placeholder='CVV'
                      error={errors?.payment_details?.cvv}
                      name={'payment_details.cvv'}
                      controlled={true}
                    />
                    <Errors error={errors?.payment_details?.cvv} />
                  </div>
                </div>
              </div>

              <div className='billing-wrapper'>
                <div className='billing-txt'>Billing address</div>
                <span className='billing-inner'>
                  <div className='col-md-12 p-0 billing-main'>
                    <CommonLabel label='Street address' />
                    <CommonInput
                      register={register}
                      name='streetAddress'
                      placeholder='Enter street address'
                      error={errors?.streetAddress}
                      controlled={false}
                    />
                    <Errors error={errors?.streetAddress} />
                  </div>
                  <div className='col-md-12 p-0 billing-main'>
                    <CommonLabel label='City' />
                    <CommonInput
                      register={register}
                      name='city'
                      placeholder='Enter city'
                      error={errors?.city}
                      controlled={false}
                    />
                    <Errors error={errors?.city} />
                  </div>
                  <div className='content-row billing-main'>
                    <div className='col-md-6 pl-0'>
                      <CommonLabel label='State' />
                      <CommonInput
                        register={register}
                        name='state'
                        placeholder='Enter state'
                        error={errors?.state}
                        controlled={false}
                      />
                      <Errors error={errors?.state} />
                    </div>
                    <div className='col-md-6 p-0'>
                      <CommonLabel label='Post code' />
                      <CommonInput
                        type='number'
                        register={register}
                        name='post_code'
                        placeholder='Enter post code'
                        error={errors?.post_code}
                        controlled={false}
                      />
                      <Errors error={errors?.post_code} />
                    </div>
                  </div>

                  <div className='col-md-12 p-0 billing-main'>
                    <CommonLabel label='Country' />
                    {/* <CommonInput
                      register={register}
                      name='country'
                      placeholder='Australia'
                      error={errors?.country}
                      controlled={false}
                    />
                    <Errors error={errors?.country} /> */}
                    <MUIAutoComplete
                      value={countryWatch}
                      trigger={trigger}
                      placeholder='Select Country'
                      register={register}
                      setValue={setValue}
                      options={countryList}
                      name='country'
                      error={errors?.country}
                      setError={setError}
                    />
                    {/* <CommonSelect
                      value={countryWatch}
                      trigger={trigger}
                      placeholder='Select Country'
                      register={register}
                      setValue={setValue}
                      options={countryList}
                      name='country'
                      error={errors?.country}
                    /> */}
                    <Errors error={errors?.country} message={errors?.country?.message} />
                  </div>
                  <h1 className='bussiness-txt bussiness-m'>
                    Business information
                    <span className='optional-label'>optional</span>
                  </h1>
                  <div className='col-md-12 p-0 billing-main'>
                    <CommonLabel label='Business name' />
                    <CommonInput
                      register={register}
                      name='business_name'
                      placeholder='Enter business name  optional'
                      error={errors?.business_name}
                      controlled={false}
                    />
                  </div>
                  <div className='col-md-12 p-0 billing-main'>
                    <CommonLabel label='ABN' />
                    <CommonInput
                      inputMode='numeric'
                      onChange={handleAbnChange}
                      value={abn}
                      placeholder='Enter ABN  optional'
                      error={errors?.abn}
                      controlled={true}
                    />
                  </div>
                </span>
              </div>
              <div className='mb-[1.5rem]'>
                <div
                  id='FieldsRoot'
                  className="flex flex-row gap-2 justify-start w-full font-['Hauora'] "
                >
                  {/* <div className="check-section">
                  <Form.Check aria-label="option 1"  onChange={(e) => {
                    setValue("isConfirm", e.target.checked);
                  }}/>
                </div> */}

                  <div className=' agree-txt-wrap mt-[10px] gap-2'>
                    <div className={`custom-checkbox ${errors?.isConfirm ? 'checkbox-error' : ''}`}>
                      <input
                        type='checkbox'
                        // defaultChecked={checked}
                        // defaultValue={checked}
                        // checked={checked}
                        id='agree-check-payment'
                        // onChange={(e) => {
                        //   setValue('isConfirm', e.target.checked);
                        //   trigger('isConfirm');
                        //   setChecked(e.target.checked);
                        // }}
                        name='isConfirm'
                        {...register('isConfirm')}
                      />
                      <label htmlFor='agree-check-payment'>I agree to the</label>
                      <span onClick={handleAgreement} className='option-text'>
                        <span className='underline'>Membership Agreement</span>
                      </span>
                    </div>
                    <Errors error={errors?.isConfirm} message={errors?.isConfirm?.message} />
                  </div>
                </div>
              </div>
              {/* isShowPriceHeader */}
              {!isShowPriceHeader && isMobile && <ShowPriceFooter />}

              <div className="form-buttons flex flex-row gap-12 w-full font-['Hauora'] items-start mb-[100px]">
                <button id='RectButtons' type='button' onClick={goBack} className='arrow-btn'>
                  <img
                    src='https://file.rendit.io/n/ln9TIOoBGF72MNAYYUyv.svg'
                    alt='ArrowLeft'
                    id='ArrowLeft'
                    className='w-4'
                  />
                </button>
                {
                  <div className='payment-price-show'>
                    {!isShowPriceHeader && isMobile && (
                      <div className='w-3/12'>
                        <div>
                          <span className='total-price'>Total</span>
                          <span className='gst'>GST inc</span>
                        </div>
                        <div className='price-borer'></div>
                        <div className='price'>{getTotalPrice(details)}</div>
                      </div>
                    )}
                    <div className={isMobile && !isShowPriceHeader ? 'w-3/4' : 'w-full'}>
                      <CommonButton
                        error={Object.keys(errors)?.length}
                        disabled={loading}
                        className={loading ? 'disable-btn' : 'common-btn'}
                        onClick={() =>
                          handleErrorClick(getValues, {
                            business_name: true,
                            abn: true,
                          })
                        }
                        text='Confirm purchase'
                        type='submit'
                      />
                    </div>
                  </div>
                }
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShowPriceHeader = () => {
  const { onboardingForms } = useContext(OnboardingContext);
  // console.log(onboardingForms?.membershipData, 'this_is_onboardingForms');
  // console.log(onboardingForms?.membershipData, 'this_is_onboardingForms');
  const details = onboardingForms?.membershipData;
  return (
    <div className='payment-price-header'>
      <div className='unlimited-plan-text'>
        <h1>Unlimited Plan Membership for</h1>
      </div>
      <PaymentText details={details} />
    </div>
  );
};

const ShowPriceFooter = () => {
  const { onboardingForms } = useContext(OnboardingContext);
  const details = onboardingForms?.membershipData;
  return (
    <div className='payment-price-footer-wrapper'>
      <div className='payment-price-footer'>
        <div className='flex items-center justify-between'>
          <span className='unlimited-plan-text'>
            <p>Unlimited Plan Membership</p>
          </span>
          <PaymentText details={details} />
        </div>
        <div className='payment-price-footer-text-initiation'>
          <span>
            <p>One-time Initiation & Verification Fee</p>
          </span>
          <InitiationFee details={details} />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
