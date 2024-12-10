import React, { useContext, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { showMessage } from 'utils/notify';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';

import { userAddInformation } from 'services/api';
import Errors from 'components/errors/Errors';
import ScrollToTopOnMount from 'components/layout/ScrollToTopOnMount';
import moment from 'moment-timezone';
import useQueryParams from 'Hook/useQueryParams';
import CommonLabel from 'components/formcomponents/CommonLabel';
import CommonInput from 'components/formcomponents/CommonInput';
import CommonButton from 'components/formcomponents/CommonButton';
import CommonSelect from 'components/formcomponents/CommonSelect';
import { CHANGE_PREORDER_STATUS, UPDATE_INFO } from 'constants/actions';
import OnboardingContext from 'context/OnboardingContext';
import { NAME_VALIDATION } from 'constants/regex';
import { getCompleteInfo, handleErrorClick } from 'helpers';
import { ROUTE_LIST } from 'routes/routeList';


const monthsArray = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

/**
 * Checks if a given date is before today's date.
 * @param {string|Date} dateToCompare The date to compare to today's date.
 * @returns {boolean} True if the given date is before today's date, false otherwise.
 */
function isPastDate(dateToCompare) {
  // Get today's date
  const today = new Date();

  // Convert the date to compare to a Date object
  if (typeof dateToCompare === 'string') {
    // Ensure date string format is YYYY-MM-DD for cross-browser compatibility
    const parts = dateToCompare.split('-');
    dateToCompare = new Date(parts[0], parts[1] - 1, parts[2]);
  }

  // Compare the dates
  return dateToCompare < today;
}

// Get the current date
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1; // Months are 0-based, so add 1

const currentDay = today.getDate();
const schema = yup.object({
  fullName: yup
    .string()
    .matches(NAME_VALIDATION, 'Full name required.  Include both your first and last name.')
    .max(40, 'Full name must not exceed 40 characters')
    .required('Full Name is required'),
  preferredFirstName: yup.string(),
  gender: yup.string().required('Please select your gender'),
  day: yup
    .number()
    .required('Day is required')
    .min(1, 'Day must be between 1 and 31')
    .max(31, 'Day must be between 1 and 31'),
  month: yup
    .number()
    .required('Month is required')
    .min(1, 'Month must be between 1 and 12')
    .max(12, 'Month must be between 1 and 12'),
  year: yup
    .number()
    .required('Year is required')
    .typeError('Year must be a number')
    .min(1900, 'Year must be a valid year (1900 or later)')
    .max(currentYear, 'Year must be a valid year (1900 or later)'),
  isConfirm: yup
    .boolean()
    .required('Please agree to the above')
    .oneOf([true], 'Please agree to the above'),
});

const BasicInfo = ({ goTo, isMobile = false, currentIndex = 0 }) => {
  const queryParams = useQueryParams();
  const type = queryParams.type || '';
  const navigate = useNavigate();
  const currentYear = moment().year();
  const [checked, setChecked] = useState(false);
  const [initStates, setInitStates] = useState({
    gender: '',
    day: currentDay,
    month: currentMonth,
  });

  const [errorsMsg, setErrorsMsg] = useState('');

  const [deviceInfo, setDeviceInfo] = useState(null);

  const alldays = Array.from({ length: 31 }).map((_, index) => ({
    value: index + 1,
    label: index + 1,
  }));
  const genders = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];


  const {
    register,
    handleSubmit,
  
    setValue,
    getValues,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const day = watch('day');
  const month = watch('month');
  const year = watch('year');
  const gender = watch('gender');
  const fullName = watch('fullName');
  const isConfirm = watch('isConfirm');

  const location = useLocation();
  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);

  useEffect(() => {
    getCompleteInfo().then((data) => {
      setDeviceInfo(data);
    });
    if (location.pathname === ROUTE_LIST.COMPENDIUM && !onboardingForms?.sessionToken) {
      dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: false });
      navigate(ROUTE_LIST.SMART_FIELD);
    }

    return () => {
      dispatchOnboardingForms({ type: UPDATE_INFO, payload: getValues() });
    };

    // eslint-disable-next-line
  }, []);

  const goBack = () => {
    const values = getValues();
    dispatchOnboardingForms({ type: UPDATE_INFO, payload: { ...values } });
    if (isMobile) {
      const last = localStorage.getItem('last') || '0';
      goTo(Number(last));
    } else {
      navigate(-1); // Navigate back one step in the history stack
    }
  };

  useEffect(() => {
    let obj = { gender: '', day: '', month: '' };
    Object.keys(onboardingForms?.info)?.forEach((key) => {
      if (key === 'isConfirm') {
      }
      setValue(key, onboardingForms?.info[key] || '');
      if (obj[key] === '') {
        obj[key] = onboardingForms?.info[key];
      }
    });
    if (onboardingForms?.info?.isConfirm) {
      setChecked(true);
    }
    setInitStates(obj);
    // eslint-disable-next-line
  }, [currentIndex]);

  const uniqueCode = localStorage.getItem('refer') || '';

  const onSubmit = handleSubmit(async (_values) => {
    const values = { ..._values };
    delete values.isConfirm;

    const checkRegType = onboardingForms?.loginData?.newUser ? 'registered' : 'login';

    if (Number(values.month) === 2 && values.day > 29) {
      showMessage('invalid date');
    } else {
      let payload = {
        fullName: values.fullName,
        gender: values.gender,

        preferredFirstName: values.preferredFirstName,
        privacyPolicyTermsofUse: values.isConfirm,
        birthday: `${values.year}-${values.month}-${values.day}`,
        checkRegType,
        uniqueCode: uniqueCode ? uniqueCode : '',
        deviceInfo,
      };
      const isValidDate = isPastDate(payload.birthday);
      if (!isValidDate) {
        setErrorsMsg('Please enter a valid date');
        return;
      }
      delete values.isConfirm;
      try {
        const res = await userAddInformation(payload);
        const token = res?.data?.data?.token;
        localStorage.setItem('blackjet-website', token);
        localStorage.setItem('refer', '');
        // showMessage(res?.data.message);
        if (res.status === 200) {
          if (isMobile) {
            goTo(6);
          } else if (type !== 'pre-order') {
            navigate(ROUTE_LIST.REFINED_SELECTION);
          } else {
            navigate(`${ROUTE_LIST.AT_YOUR_CONVENIENCE}?type=pre-order`);
          }
          dispatchOnboardingForms({
            type: UPDATE_INFO,
            payload: { ...values, isConfirm: checked },
          });
        }
        // reset();
      } catch (error) {
        console.log(error);
      }
    }
  });

  return (
    <div className='basic-info'>
      <ScrollToTopOnMount />
      <div className='onboardbg'>
        <form onSubmit={onSubmit}>
          <div className='login-section-wrap info-section-wrap'>
            <h2 className='heading-20 !mb-[24px]'>Some information about you</h2>
            <div className='basic-wrapper'>
              <div className='common-input-wrap flex flex-col gap-1 w-full items-start'>
                <CommonLabel label={'Full name'} />
                <CommonInput
                  placeholder='Enter your full name'
                  register={register}
                  name='fullName'
                  error={errors?.fullName}
                  controlled={false}
                />
                <Errors error={errors?.fullName} message={errors?.fullName?.message} />
              </div>
              <div className="common-input-wrap flex flex-col gap-1 w-full font-['Hauora'] items-start">
                <CommonLabel label={'Preferred name'} optionalLabel={'optional'} />
                <CommonInput
                  placeholder='What name do you prefer to go by?'
                  register={register}
                  name='preferredFirstName'
                  error={errors?.preferredFirstName}
                  controlled={false}
                />
              </div>

              <div className=" w-full font-['Hauora'] ">
                <div className='common-input-wrap flex flex-col gap-1'>
                  <CommonLabel label={'Birthday'} />
                  <div className='birth-date-wrap'>
                    <div className='date-bx'>
                      <CommonSelect
                        trigger={trigger}
                        options={alldays}
                        register={register}
                        setValue={setValue}
                        value={day}
                        name='day'
                        error={errors?.day}
                        placeholder='Day'
                        onChangeFn={() => setErrorsMsg('')}
                        defaultValue={initStates?.day}
                      />
                      <Errors error={errors?.day} message={errors?.day?.message} />
                    </div>
                    <div className='date-bx'>
                      <CommonSelect
                        options={monthsArray}
                        trigger={trigger}
                        onChangeFn={() => setErrorsMsg('')}
                        // register={register}
                        value={month}
                        setValue={setValue}
                        name='month'
                        error={errors?.month}
                        placeholder='Month'
                        // defaultValue={initStates?.month}
                      />
                      <Errors error={errors?.month} message={errors?.day?.month} />
                    </div>
                    <div className='date-bx'>
                      <CommonInput
                        type='number'
                        placeholder='Year'
                        min={1900}
                        max={currentYear}
                        register={register}
                        _handleFocus={() => setErrorsMsg('')}
                        name='year'
                        error={errors?.year}
                        controlled={false}
                      />
                      <Errors error={errors?.year} message={errors?.year?.message} />
                    </div>
                  </div>
                  <Errors error={errorsMsg} message={errorsMsg} />
                </div>
              </div>
              <div className="common-input-wrap flex flex-col gap-1 w-full font-['Hauora'] items-start">
                <CommonLabel label='Gender' />
                <CommonSelect
                  options={genders}
                  trigger={trigger}
                  register={register}
                  name='gender'
                  value={gender}
                  setValue={setValue}
                  error={errors?.gender}
                  placeholder='Select your gender'
                  defaultValue={initStates?.gender}
                />
                <Errors error={errors?.gender} message={errors?.gender?.message} />
              </div>
              <div
                id='FieldsRoot'
                className="flex flex-col-reverse  w-full font-['Hauora'] items-start relative"
              >
                {/* <div className="check-section">
                  <Form.Check
                    className="absolute top-0 "
                    aria-label="option 1"
                    onChange={(e) => {
                      setValue("isConfirm", e.target.checked);
                    }}
                  />
                </div>
               */}

                <div className=' agree-txt-wrap mt-[10px] gap-2'>
                  <div className={`custom-checkbox ${errors?.isConfirm ? 'checkbox-error' : ''}`}>
                    <input
                      type='checkbox'
                      id='agree-check-basic-info'
                      checked={checked}
                      onChange={(e) => {
                        setValue('isConfirm', e.target.checked);
                        trigger('isConfirm');
                        setChecked(e.target.checked);
                      }}
                    />
                    <label htmlFor='agree-check-basic-info'> I agree to the</label>
                    <span
                      to={'/legal?type=Terms of use'}
                      onClick={() => {
                        if (isMobile) {
                          navigate(`/legal?type=Terms of use`); // only this added
                        } else {
                          navigate(`/legal?type=Terms of use`);
                        }
                      }}
                      className='option-text cursor-pointer'
                    >
                      <span className='underline'>Terms of Use</span>
                    </span>
                    <span className='and-txt'> and </span>
                    <span
                      to={'/legal?type=Privacy Policy'}
                      onClick={() => {
                        if (isMobile) {
                          navigate(`/legal?type=Privacy Policy`); // only this added
                        } else {
                          navigate(`/legal?type=Privacy Policy`);
                        }
                      }}
                      className='option-text cursor-pointer'
                    >
                      <span className='underline'>Privacy Policy</span>
                    </span>
                    <Errors error={errors?.isConfirm} message={errors?.isConfirm?.message} />
                  </div>
                </div>
              </div>
              <div className="form-buttons flex flex-row gap-12 font-['Hauora'] items-start">
                <button id='RectButtons' onClick={goBack} className='arrow-btn' type='button'>
                  <img
                    src='https://file.rendit.io/n/ln9TIOoBGF72MNAYYUyv.svg'
                    alt='ArrowLeft'
                    id='ArrowLeft'
                    className='w-4'
                  />
                </button>
                <CommonButton
                  error={
                    Object.keys(errors)?.length > 0 ||
                    !day ||
                    !month ||
                    !gender ||
                    !fullName ||
                    !year ||
                    !isConfirm
                  }
                  text='Continue'
                  type='submit'
                  onClick={() => handleErrorClick(getValues, { preferredFirstName: true })}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BasicInfo;
