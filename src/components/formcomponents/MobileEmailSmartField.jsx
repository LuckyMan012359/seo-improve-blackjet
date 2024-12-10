import { emailIndMap } from 'constants';
import { emailsAccepted } from 'constants';
import { EMAIL_MOBILE_DISTINGUISHER, EMAIL_VALIDATION } from 'constants/regex';
import { useEffect, useRef, useState } from 'react';
import { useCountries } from 'use-react-countries';
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

const MobileEmailSmartField = ({
  isPhone = false,
  email = '',
  setEmail = () => {},
  mobile = '',
  setMobile = () => {},
  errorMessage = '',
  setErrorMessage = () => {},
  checkNumber = '',
  setCheckNumber = () => {},
  flag = '',
  setFlag = () => {},
  countryCode = '',
  setCountryCode = () => {},
  checkOtp = false,
  init = '',
  containerClassName = '',
  isNumeric = false,
  ...props
}) => {
  const { countries } = useCountries();
  const [isForced, setIsForced] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef(null);
  const [ind, setInd] = useState(0);

  useEffect(() => {
    if (init) {
      handleChange({ target: { value: init } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        setInd((ind) => (ind - 1 < 0 ? emailsAccepted?.length - 1 : ind - 1));
      } else if (event.key === 'ArrowDown') {
        setInd((ind) => (ind + 1 > emailsAccepted?.length - 1 ? 0 : ind + 1));
      } else if (event.key === 'Enter' && email) {
        handleChange({ target: { value: `${email?.split('@')[0]}@${emailIndMap[ind]}.com` } });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ind, email]);

  const handleChange = (e) => {
    if (!checkOtp) {
      const val = e.target.value;
      setErrorMessage('');
      if (EMAIL_MOBILE_DISTINGUISHER.test(val)) {
        //this means the entered value is a number
        if (val === '0' || val === '+61') {
          setFlag('https://flagcdn.com/au.svg');
          setCountryCode('+61');
          setMobile('');
        } else if (val === '+1') {
          setFlag('https://flagcdn.com/us.svg');
          setCountryCode('+1');
          setMobile('');
        } else {
          const code = val?.slice(0, 3);
          const code2 = val?.slice(0, 4);
          const country = countries.find(
            (c) => c.countryCallingCode === code || c.countryCallingCode === code2,
          );
          if (!!country?.countryCallingCode && country?.countryCallingCode !== countryCode) {
            setFlag(country?.flags?.svg);
            setCountryCode(country?.countryCallingCode);
            const split = val?.split(country?.countryCallingCode);
            const num = split?.length > 1 ? split[1] : '';
            setMobile(num);
          } else {
            setMobile(val?.replace(/^0+/, '')?.replace(/\s+/g, ''));
          }
        }
        setCheckNumber(true);
        setEmail('');
      } else {
        //this means the entered value is an email
        setEmail(val);
        setCheckNumber(isPhone || false);
        setMobile('');
      }
      if (!val) {
        setFlag('https://flagcdn.com/au.svg');
        setCountryCode('+61');
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <>
      <div
        className={`flex relative w-full ${containerClassName} ${isFocused && 'focus-input'}   ${
          errorMessage ? ' red-error !border-r-4' : '!border-none'
        }`}
      >
        <div placement='bottom-start' id='menu-tailwind'>
          {(checkNumber || isForced) && countryCode && (
            <button
              // ripple={false}
              variant='text'
              // color='blue-gray'
              className={`reset-Button outline-none country-flag-wrap flex justify-evenly items-center h-[58px] !p-3  gap-1 !bg-[#333333] !border-none   text-white-A700 w-[50px] rounded-r-none border-r-0 border-blue-gray-200 bg-blue-gray-500/10 min-w-[80px]`}
            >
              {flag && (
                <img
                  src={flag}
                  alt={countryCode} // Alt can be country name or code based on preference
                  className='h-4 w-[20px] object-fill'
                />
              )}
              <div className='divider-wrap'></div>
              <p>{countryCode}</p>
            </button>
          )}
        </div>
        <input
         
          value={checkNumber ? mobile : email}
          onChange={handleChange}
          placeholder={isPhone ? 'Enter your phone number' : `Enter your phone number or email`}
          className={` common-input ${
            isFocused && !checkOtp ? 'focused-input' : ''
          }  remove-arrow ${
            checkNumber || isForced ? ' !rounded-l-none rounded-r-[5px]' : 'rounded-[5px]'
          } !pl-[10px] outline-0 ${
            checkOtp ? 'cursor-not-allowed' : ''
          }   text-white-A700 !h-[58px]`}
          // containerProps={{
          //   className: 'min-w-0',
          // }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && ref.current.value === '') {
              setCheckNumber(false);
              setIsForced(false);
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={checkOtp}
          ref={ref}
          // inputMode={isNumeric ? 'numeric' : 'text'}
          type={isNumeric ? 'tel' : 'text'}
          pattern={isNumeric ? '[+0-9]*' : undefined}
        />
        {!isPhone && email && !EMAIL_VALIDATION.test(email) && (
          <div className='email-suggestions'>
            {emailsAccepted?.map((item, index) => (
              <div
                className={`${ind === index ? 'active' : ''}`}
                onClick={() => {
                  handleChange({ target: { value: `${email?.split('@')[0]}${item}` } });
                }}
                value={`${email?.split('@')[0]}${item}`}
              >{`${email?.split('@')[0]}${item}`}</div>
            ))}
          </div>
        )}
        {/* {!isPhone && email && (
        <datalist id="emails-datalist" className="w-full">
          <option value={`${email?.split("@")[0]}@gmail.com`}>{`${
            email?.split("@")[0]
          }@gmail.com`}</option>
          <option value={`${email?.split("@")[0]}@yahoo.com`}>{`${
            email?.split("@")[0]
          }@yahoo.com`}</option>
          <option value={`${email?.split("@")[0]}@outlook.com`}>{`${
            email?.split("@")[0]
          }@outlook.com`}</option>
          <option value={`${email?.split("@")[0]}@icloud.com`}>{`${
            email?.split("@")[0]
          }@icloud.com`}</option>
        </datalist>
      )} */}
      </div>
    </>
  );
};

export default MobileEmailSmartField;
