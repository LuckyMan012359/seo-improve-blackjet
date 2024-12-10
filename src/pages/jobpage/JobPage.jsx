import React, { useCallback, useEffect, useState } from 'react';
import { getCareerDetail, submitJobApplication } from 'services/api';
import { Link, useParams } from 'react-router-dom';
import { Entermobilegetapp } from 'components/Popup';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CommonButton from 'components/formcomponents/CommonButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useMediaQuery, Checkbox, LinearProgress } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Errors from 'components/errors/Errors';
import CommonInput from 'components/formcomponents/CommonInput';
import CommonLabel from 'components/formcomponents/CommonLabel';
import MobileEmailSmartField from 'components/formcomponents/MobileEmailSmartField';
import CustomEditor from 'components/custom-editor/CustomEditor';
import { uploadFilePublic } from 'api/onboarding';
import DesktopOnlyPage from 'components/desktopOnlyPage/DesktopOnlyPage';
import { readTimeStatus, saveTimeAndCheck, TIME_KEY } from 'utils';
/**
 * Renders a job page with information about the job and a form to submit an application
 * @param {Object} jobDetail - The job detail object from the API
 * @returns {React.ReactElement} - The job page component
 * @example
 * <JobPage jobDetail={{}} />
 */
const JobPage = () => {
  const [jobDetail, setJobDetail] = useState({});
  const [activeLink, setActiveLink] = useState('AboutRole');
  const isMobile = useMediaQuery('(max-width : 699px)');
  const { id } = useParams();

  const getJobDetail = async (id) => {
    try {
      const res = await getCareerDetail(id);

      setJobDetail(res?.data?.data);
      setActiveLink(res?.data?.data?.requirements[0]?._id || '');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJobDetail(id);
  }, [id]);

  if (isMobile) {
    return <DesktopOnlyPage heading='Careers' />;
  }

  if (!jobDetail) return <div>Loading...</div>;

  return (
    <>
      <div className='job-page-container'>
        <Entermobilegetapp />

        <div className='job-page'>
          <div className='job-title'>
            <ul>
              {jobDetail?.requirements?.map((requirement) => {
                return (
                  <li
                    role='button'
                    onClick={() => setActiveLink(requirement?._id)}
                    key={requirement?._id}
                    className={activeLink === requirement?._id ? 'active' : ''}
                  >
                    {requirement?.title}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='job-description'>
            <JobDetail jobDetail={jobDetail} />

            <div className='line'></div>

            <JobTitleInfo jobDetail={jobDetail} activeLink={activeLink} />
          </div>
        </div>
      </div>
      <JobForm jobDetail={jobDetail} />
    </>
  );
};

const JobDetail = ({ jobDetail }) => {
  const handleShare = async () => {
    const getFullUrl = window.location.href;
    try {
      if (navigator.share && typeof navigator.share === 'function') {
        await navigator.share({
          title: 'Black Jet Careers',
          text: `${jobDetail?.job_name}`,
          url: getFullUrl,
        });
      }
    } catch (error) {
      console.error('Unsupported', error);
    }
  };
  return (
    <div className='job-detail'>
      <div className='job-heading'>{jobDetail?.job_name}</div>

      <div className='job-basic-info-wrap'>
        <div className='job-category'>
          <span>
            <BusinessCenterOutlinedIcon />
          </span>
          <span>{jobDetail?.job_category}</span>
        </div>
        <div className='job-type'>
          <span>
            <AccessTimeOutlinedIcon />
          </span>
          <span>{jobDetail?.job_type}</span>
        </div>
        <div className='job-location'>
          <span>
            <LocationOnOutlinedIcon />
          </span>
          <span>{jobDetail?.job_location}</span>
        </div>

        <div className='job-apply'>
          <CommonButton
            text={'Apply Now'}
            onClick={() => {
              // scroll to the bottom
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth',
              });
            }}
          />
          <div className='share-icon' role='button' onClick={handleShare}>
            <img src='https://file.rendit.io/n/hpR9egKO7yWAEJYoBHcR.svg' alt='Share' id='Share' />
          </div>
        </div>
      </div>
    </div>
  );
};

const JobTitleInfo = ({ jobDetail, activeLink }) => {
  const { title, description } =
    jobDetail.requirements?.find((requirement) => requirement?._id === activeLink) || {};
  return (
    <div className='job-title-info'>
      <div className='job-title-info-heading'>{title}</div>
      <div
        className='job-title-info-description'
        dangerouslySetInnerHTML={{ __html: description }}
      ></div>
    </div>
  );
};

const schema = yup.object().shape({
  fullName: yup.string().required('Name is required'),
  email: yup.string().required('Email is required'),
  desiredSalary: yup.string().required('Desired salary is required'),
  salary: yup.string().required('Salary is required'),

  // coverLetter: yup.string().required('Cover letter is required'),
  phone: yup.string().required('Phone number is required'),
  file: yup
    .mixed()
    .required('File is required')
    .test('fileSize', 'File is too large', (value) => {
      return value && value[0]?.size <= 5 * 1024 * 1024; // 5MB max
    })
    .test('fileType', 'Unsupported file format', (value) => {
      return (
        value && ['application/pdf', 'application/msword', 'text/plain'].includes(value[0]?.type)
      );
    }),
  termsCheck: yup
    .bool()
    .oneOf([true], 'You must agree to the terms and conditions.')
    .required('You must agree to the terms and conditions.'),
});
const JobForm = ({ jobDetail }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    trigger,
    watch,
    setError,
    control,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [mobile, setMobile] = useState();
  // const [errorMessage, setErrorMessage] = useState('');
  const [checkNumber, setCheckNumber] = useState(true);
  const [flag, setFlag] = useState('https://flagcdn.com/au.svg');
  const [countryCode, setCountryCode] = useState('+61');
  const [loading, setLoading] = useState(false);
  const [isFormSubmittedSuccessfully, setIsFormSubmittedSuccessfully] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', values?.file[0]);

      // get file name

      // first upload the file to the server
      const response = await uploadFilePublic(formData);

      const payLoad = {
        career_id: jobDetail?._id,
        full_name: values?.fullName,
        phone: values?.phone,
        phone_code: countryCode,
        email: values?.email,
        salary: values?.salary,
        desired_salary: values?.desiredSalary,
        cvUrl: response?.data?.data?.imageUrl,
        cv: response?.data?.data?.key,
        is_visa_sponsorship: values?.visaCheckYes ? true : false,
        cover_letter: values?.enQuiry,
        privacy_policy_terms_of_use: values?.termsCheck ? true : false,
      };

      const res = await submitJobApplication(payLoad);

      if (res?.status === 200) {
        setLoading(false);
        setIsFormSubmittedSuccessfully(true);
        saveTimeAndCheck(10, TIME_KEY.JOB_FORM);
        reset();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  });

  const handleEditChange = useCallback(
    (value) => {
      setValue('enQuiry', value.target.getContent());
      trigger('enQuiry');
    },
    [setValue, trigger],
  );

  if (isFormSubmittedSuccessfully) {
    return (
      <div className='job-form-container-success'>
        <div className='job-form-container'>
          <div className='job-form-heading'>{jobDetail?.job_name}</div>
          <div className='job-form-body'>
            <div className='job-form-body-success'>
              We appreciate your interest in joining our team. Your application has been received
              and will be reviewed. We will contact you if you are selected for the next steps.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='job-form-container'>
      {loading ? (
        <div className='loader-wrap-editor'>
          <LinearProgress color='#000' />
        </div>
      ) : (
        ''
      )}
      <div className='job-form-heading'>{jobDetail?.job_name}</div>
      <div className='job-form-body'>
        <form onSubmit={onSubmit} className='job-main-form'>
          <div>
            <div>
              <CommonLabel label='Full legal name' />
              <CommonInput
                placeholder='Enter your full legal name'
                register={register}
                name='fullName'
                error={errors?.fullName}
                controlled={false}
                type='text'
              />
              <Errors error={errors?.fullName} message={errors?.fullName?.message} />
            </div>
            <div className='hidden-on-tablet'></div>
          </div>

          <div>
            <div>
              <CommonLabel label='Contact number' />
              <MobileEmailSmartField
                isPhone={true}
                // email={email}
                // setEmail={setEmail}
                mobile={mobile}
                setMobile={(value) => {
                  if (value?.length === 0) {
                    setError('phone', {
                      type: 'manual',
                      message: 'Phone number is required',
                    });
                  }
                  // Remove Error
                  if (value?.length > 0) {
                    setError('phone', null);
                  }
                  setMobile((prev) => {
                    setValue('phone', +value);
                    return value;
                  });
                }}
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
              <Errors error={errors?.phone} message={errors?.phone?.message} />
            </div>
            <div>
              <CommonLabel label='Email' />
              <CommonInput
                placeholder='Enter your email address'
                register={register}
                name='email'
                error={errors?.email}
                controlled={false}
                type='email'
              />
              <Errors error={errors?.email} message={errors?.email?.message} />
            </div>
          </div>

          <div>
            <div>
              <CommonLabel label='Your current salary' />
              <CommonInput
                placeholder='What’s your current salary?'
                register={register}
                name='salary'
                error={errors?.salary}
                controlled={false}
                type='text'
              />
              <Errors error={errors?.salary} message={errors?.salary?.message} />
            </div>
            <div>
              <CommonLabel label='Your desired salary' />
              <CommonInput
                placeholder='What’s your desired salary?'
                register={register}
                name='desiredSalary'
                error={errors?.desiredSalary}
                controlled={false}
                type='text'
              />
              <Errors error={errors?.desiredSalary} message={errors?.desiredSalary?.message} />
            </div>
          </div>

          <div>
            <div className='file-upload-form-container'>
              <Controller
                name='file'
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <div className='file-upload'>
                    <input
                      type='file'
                      id='fileInput'
                      className='file-input'
                      onChange={(e) => field.onChange(e.target.files)} // Correctly handle file input change
                    />
                    <label htmlFor='fileInput' className='upload-label'>
                      <span className='icon'>
                        <AttachFileIcon />
                      </span>
                      <span className='text'>{field.value?.[0]?.name || 'Attach CV'}</span>
                    </label>
                  </div>
                )}
              />
              <Errors error={errors?.file} message={errors?.file?.message} />
            </div>
            <div></div>
          </div>

          <div>
            <div className='job-form-sub-heading-container'>
              <h1 className='job-form-sub-heading'> Work Authorization for Australia </h1>

              <div className='job-form-sub-heading-description'>
                <p>
                  Do you now or in the future require visa sponsorship in order to accept employment
                  in Australia?
                </p>
                <div className='job-form-sub-heading-description-checkbox'>
                  <Checkbox
                    id='visaCheckYes'
                    disableRipple
                    name='visaCheckYes'
                    {...register('visaCheckYes')}
                    disabled={watch('visaCheckNo')}
                  />
                  <label htmlFor='yes'>Yes</label>
                </div>
                <div className='job-form-sub-heading-description-checkbox'>
                  <Checkbox
                    id='visaCheckNo'
                    disableRipple
                    name='visaCheckNo'
                    {...register('visaCheckNo')}
                    disabled={watch('visaCheckYes')}
                  />
                  <label htmlFor='no'>No</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div>
              <CommonLabel label='Cover letter' />
              <CustomEditor
                initialValue={getValues().coverLetter}
                // value={enQuiryVal}
                onChange={handleEditChange}
              />
              <Errors error={errors?.enQuiry} message={errors?.enQuiry?.message} />
            </div>
          </div>

          <div>
            <div>
              <div>
                <Checkbox
                  checked={watch('termsCheck')}
                  id='termsCheck'
                  disableRipple
                  name='termsCheck'
                  {...register('termsCheck')}
                />
                <span className='terms-check-text'>
                  <label htmlFor='agree-check-enquiry'>I agree to the</label>
                  <Link to={'/legal?type=Terms of use'} className='option-text'>
                    <span className='underline'>Terms of Use</span>
                  </Link>
                  <span className='and-txt'> and </span>
                  <Link to={'/legal?type=Privacy Policy'} className='option-text'>
                    <span className='underline'>Privacy Policy</span>
                  </Link>
                </span>
                {/* <label htmlFor='terms-check' className='terms-check-text'>
                  I agree to the Terms of Use and Privacy Policy
                </label> */}
                <div className='ml-3'>
                  <Errors error={errors?.termsCheck} message={errors?.termsCheck?.message} />
                </div>
              </div>

              <div>
                <CommonButton
                  text={'Submit'}
                  type='submit'
                  className='submit-button'
                  error={loading || readTimeStatus(TIME_KEY.JOB_FORM)}
                  disabled={loading || readTimeStatus(TIME_KEY.JOB_FORM)}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPage;
