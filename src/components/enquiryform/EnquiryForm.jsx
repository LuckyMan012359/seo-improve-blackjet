import React, { memo, useCallback, useEffect, useState } from 'react';
import { addEnquiry, getCategoryList, getEnquiryList } from 'services/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomEditor from 'components/custom-editor/CustomEditor';
import Errors from 'components/errors/Errors';
import { Link } from 'react-router-dom';
import CommonInput from 'components/formcomponents/CommonInput';
import CommonLabel from 'components/formcomponents/CommonLabel';
import CommonSelect from 'components/formcomponents/CommonSelect';
import CommonButton from 'components/formcomponents/CommonButton';
import FormResponseContactUs from './FormResponseContactUs';
import { useMediaQuery } from '@mui/material';
import { handleContactSlide } from 'helpers';
import MobileEmailSmartField from 'components/formcomponents/MobileEmailSmartField';
import { readTimeStatus, saveTimeAndCheck, TIME_KEY } from 'utils';
// https://blackjetstoragebuck.s3.ap-southeast-2.amazonaws.com/1705471260505airport.svg
const EnquiryForm = ({ children, type, enquirybg }) => {
  const schema = yup.object({
    firstName: yup.string().required('First Name is required'),
    // lastName: yup.string().required('Last Name is required'),
    email: yup
      .string()
      .required('Please provide a valid email address (e.g., john@icloud.com)')
      .email('Please provide a valid email address (e.g., john@icloud.com)'),
    phone: yup.number().typeError('Please provide a valid phone number'),
    subject: yup.string(),
    enQuiry: yup.string().required('Kindly provide your enquiry in the space provided'),
    relatedEnquiry: yup.string().required('Please select an option from the dropdown'),
    type: yup.string(),
    isConfirm: yup
      .boolean()
      .oneOf([true], 'Please agree to the above')
      .required('Please agree to the above'),
  });

  const [enquiryList, setEnquiryList] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [mobile, setMobile] = useState();
  // const [errorMessage, setErrorMessage] = useState('');
  const [checkNumber, setCheckNumber] = useState(true);
  const [flag, setFlag] = useState('https://flagcdn.com/au.svg');
  const [countryCode, setCountryCode] = useState('+61');

  const isMobile = useMediaQuery('(max-width : 699px)');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    trigger,
    watch,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const isConfirm = watch('isConfirm');

  const relatedEnquiry = watch('relatedEnquiry');

  useEffect(() => {
    (async () => {
      try {
        await getCategoryList();
      } catch (error) {
        console.log(error);
      }
      try {
        const res = await getEnquiryList();
        // console.log(res.data);
        setEnquiryList(res?.data?.data?.map((item) => ({ label: item?.name, value: item?._id })));
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    const _values = { ...values };
    delete _values.isConfirm;
    try {
      const device = window.navigator.userAgent;
      const browserWindow = `${window.innerWidth} * ${window.innerHeight} px`;
      const computerScreen = `${window.screen.width} x ${window.screen.height} px, ${window.screen.colorDepth}`;
      const res = await addEnquiry({
        ..._values,
        phone: countryCode + _values.phone,
        type: type,
        device,
        browserWindow,
        computerScreen,
      });
      if (!isMobile) {
      } else {
        handleContactSlide();
      }
      if (res?.data?.status_code === 200) {
        setIsFormSubmitted(true);
        reset();
        saveTimeAndCheck(10, TIME_KEY.CONTACT_FORM);
      }
    } catch (error) {
      setIsFormSubmitted(false);
      console.log(error);
    }
  });

  const handleEditChange = useCallback(
    (value) => {
      setValue('enQuiry', value.target.getContent());
      trigger('enQuiry');
    },
    [setValue, trigger],
  );

  if (isFormSubmitted) {
    return (
      <div className={` ${enquirybg || ''} enquiry-form-wrap`}>
        {children}
        <FormResponseContactUs setIsFormSubmitted={setIsFormSubmitted} />
      </div>
    );
  }

  // const enQuiryVal = watch('enQuiry');

  return (
    <div>
      <div className={` ${enquirybg || ''} enquiry-form-wrap`}>
        {children}
        <form className='contact-us-form-wrap' onSubmit={onSubmit}>
          <div className='row contact-form-card'>
            <div className='col-md-12 mb-8 pl-0 pr-0'>
              <CommonLabel label='Full name' />
              <CommonInput
                placeholder='Enter your full name'
                register={register}
                name='firstName'
                error={errors?.firstName}
                controlled={false}
              />
              <Errors error={errors?.firstName} message={errors?.firstName?.message} />
            </div>

            {/* <div className='col-md-6 mb-8 px-0'>
              <CommonLabel label='Last name' />
              <CommonInput
                placeholder='Enter your last name'
                register={register}
                name='lastName'
                error={errors?.lastName}
                controlled={false}
              />
              <Errors error={errors?.lastName} message={errors?.lastName?.message} />
            </div> */}
            <div className='col-md-12 mb-8 p-0'>
              <CommonLabel label='Email' />
              <CommonInput
                placeholder='Enter your email address'
                register={register}
                name='email'
                error={errors?.email}
                controlled={false}
              />
              <Errors error={errors?.email} message={errors?.email?.message} />
            </div>
            <div className='col-md-12 mb-8 p-0'>
              <CommonLabel label='Contact number' />
              <MobileEmailSmartField
                isPhone={true}
                // email={email}
                // setEmail={setEmail}
                mobile={mobile}
                setMobile={(value) =>
                  setMobile((prev) => {
                    setValue('phone', +value);
                    return value;
                  })
                }
                errorMessage={errors?.phone ? errors?.phone?.message : ''}
                // setErrorMessage={setErrorMessage}
                checkNumber={checkNumber}
                setCheckNumber={setCheckNumber}
                flag={flag}
                setFlag={setFlag}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                // checkOtp={checkOtp}
                isNumeric={true}
              />
              {/* <CommonInput
                type='number'
                placeholder='Enter your phone number'
                register={register}
                name='phone'
                error={errors?.phone}
                controlled={false}
              /> */}
              <Errors error={errors?.phone} message={errors?.phone?.message} />
            </div>
            <div className='col-md-12 mb-8 p-0'>
              <CommonLabel label='What’s your enquiry related to?' />
              <CommonSelect
                value={relatedEnquiry}
                trigger={trigger}
                placeholder='Select one'
                register={register}
                setValue={setValue}
                options={enquiryList}
                name='relatedEnquiry'
                error={errors?.relatedEnquiry}
              />
              <Errors error={errors?.relatedEnquiry} message={errors?.relatedEnquiry?.message} />
            </div>
            <div className='col-md-12 mb-8 p-0'>
              <CommonLabel label='Subject' />
              <CommonInput
                placeholder='Enter subject'
                register={register}
                name='subject'
                error={errors?.subject}
                controlled={false}
              />
              <Errors error={errors?.subject} message={errors?.subject?.message} />
            </div>
          </div>
          <div className='col-md-12 p-0'>
            <CommonLabel label='Your Enquiry? ' />
            <CustomEditor
              initialValue={getValues().enQuiry}
              // value={enQuiryVal}
              onChange={handleEditChange}
            />
            <Errors error={errors?.enQuiry} message={errors?.enQuiry?.message} />
          </div>

          <div className=' agree-txt-wrap mt-[10px] gap-2' id='FieldsRoot'>
            <div className={`custom-checkbox ${errors?.isConfirm ? 'checkbox-error' : ''}`}>
              <input
                type='checkbox'
                checked={isConfirm}
                id='agree-check-enquiry'
                {...register('isConfirm')}
                onChange={(e) => setValue('isConfirm', e.target.checked)}
              />
              <label htmlFor='agree-check-enquiry'>I agree to the</label>
              <Link to={'/legal?type=Terms of use'} className='option-text'>
                <span className='underline'>Terms of Use</span>
              </Link>
              <span className='and-txt'> and </span>
              <Link to={'/legal?type=Privacy Policy'} className='option-text'>
                <span className='underline'>Privacy Policy</span>
              </Link>
              <Errors error={errors?.isConfirm} message={errors?.isConfirm?.message} />
            </div>
          </div>

          {/* <div id="FieldsRoot" className="agree-txt">
            <div className="check-section mr-2">
              <Form.Check
                aria-label="option 1"
                onChange={(e) => {
                  setValue("isConfirm", e.target.checked);
                }}
              />
            </div>
              <div className="text-sm font-medium text-[#bfbfbf] mt-1 font-['Hauora'] flex gap-2">
              I agree to the
              <Link to={"/legal?type=Terms of use"} className="option-text">
                <span className="underline">Terms of Use</span>
              </Link>
              <div> and </div>
              <Link to={"/legal?type=Privacy Policy"} className="option-text">
                <span className="underline">Privacy Policy</span>
              </Link>
            </div>
          </div> */}
          <div className=' '>
            <CommonButton
              type='submit'
              text='Submit'
              error={readTimeStatus(TIME_KEY.CONTACT_FORM)}
              disabled={readTimeStatus(TIME_KEY.CONTACT_FORM)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(EnquiryForm);
