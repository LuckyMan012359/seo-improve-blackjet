import { uploadFile } from 'api/onboarding';
import {
  AMEX,
  CHECK_MOBILE,
  CHECK_PHONE,
  MASTERCARD,
  VISA,
  VISAMASTER,
} from '../constants/regex';
import { cardTypes } from 'constants';
import { parsePhoneNumber } from 'libphonenumber-js';
import toast from 'react-hot-toast';

export function formatNumber(num) {
  // Convert the number to a string
  let numStr = num.toString();

  // Pad the string with zeros to ensure it has a minimum length of three characters
  while (numStr.length < 3) {
    numStr = '0' + numStr;
  }

  return numStr;
}

function checkLuhn(input) {
  // remove all non digit characters
  let value = input.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;
  // loop through values starting at the rightmost side
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = parseInt(value.charAt(i));

    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export const isValidCreditCardNumber = (value, type) => {
  // Regular expressions for common credit card vendors
  const testLuhn = value;
  const isValidEntry = checkLuhn(testLuhn);
  if (!isValidEntry) return false;

  const regex = {
    AMEX,
    // BCGLOBAL,
    // CARTEBLANCHE,
    // DINERSCLUB,
    // DISCOVER,
    // INSTAPAYMENT,
    // JCB,
    // KOREANLOCAL,
    // LASER,
    // MAESTRO,
    MASTERCARD,
    // SOLO,
    // SWITCH,
    // UNIONPAY,
    VISA,
    VISAMASTER,
  };

  // Check if value matches any of the regex patterns
  // const isValid = Object.values(regex).some(pattern => pattern.test(value));
  if (type === cardTypes.MASTERCARD) {
    return regex.MASTERCARD.test(value);
  } else if (type === cardTypes.VISA) {
    return regex.VISA.test(value);
  } else if (type === cardTypes.AMEX) {
    return regex.AMEX.test(value);
  }

  return false;
};

export const checkAmexCvv = (value) => {
  return AMEX.test(value);
};

export const isValidDate = (value) => {
  if (!value) return true; // Skip validation if value is empty
  const [month, year] = value.split('/');
  const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year
  const currentMonth = new Date().getMonth() + 1; // January is 0 in JavaScript

  if (
    Number(year) < currentYear ||
    (Number(year) === currentYear && Number(month) < currentMonth)
  ) {
    return false; // Card has expired
  }
  return true;
};

export function detectIOSDevice() {
  // let type = new window.MobileDetect(window.navigator.userAgent)
  // if (type.os() === "iOS") {
  //     return true
  // }
  // return false;
  // return [
  //     'iPad Simulator',
  //     'iPhone Simulator',
  //     'iPod Simulator',
  //     'iPad',
  //     'iPhone',
  //     'iPod'
  //   ].includes(navigator.platform)
  //   // iPad on iOS 13 detection
  //   || (navigator.userAgent.includes("Mac") && "ontouchend" in document)

  return (
    (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
    /Macintosh/.test(navigator.userAgent)
  );
}

export function checkMobile() {
  const isMobile = CHECK_MOBILE.test(navigator.userAgent);
  return isMobile;
}

export const checkOnlyPhone = () => {
  const isMobile = CHECK_PHONE.test(navigator.userAgent);
  return isMobile;
};

export const messageFormatter = (message) => {
  const newMessage = message?.replaceAll(/<br\/>/g, '');
  return newMessage;
};

export function countOccurrences(mainString, subString) {
  // Escape special characters in the substring
  const escapedSubString = subString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create a regular expression with the escaped substring
  const regex = new RegExp(escapedSubString, 'g');

  // Use match() to find all occurrences of the substring in the main string
  const matches = mainString.match(regex);

  // Return the count of occurrences
  return matches ? (matches.length >= 2 ? 2 : matches.length + 1) : 1;
}

export const keyValues = (e) => {
  if (
    e.key.toLowerCase() === 'e' ||
    e.key === '+' ||
    e.key === '-' ||
    e.key === '*' ||
    e.key === '/'
  ) {
    e.preventDefault();
  }
};

export const checkGyro = () => {
  let gyroPresent = false;
  window.addEventListener('devicemotion', function (event) {
    if (event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)
      gyroPresent = true;
  });
  return gyroPresent;
};

// function checkGyroscopeSupport(callback) {
//   if (!window.DeviceOrientationEvent) {
//     // Gyroscope not supported
//     callback(false);
//     return;
//   }

//   const handleOrientation = () => {
//     // Gyroscope is supported
//     callback(true);
//     window.removeEventListener('deviceorientation', handleOrientation, true);
//   };

//   window.addEventListener('deviceorientation', handleOrientation, true);
// }

// checkGyroscopeSupport((isSupported) => {
//   if (isSupported) {
//     console.log('Gyroscope is supported on this device.');
//   } else {
//     console.log('Gyroscope is not supported on this device.');
//   }
// });

export const toggleDrawer = (bool = '') => {
  // const phoneOnboardingContainer = document?.getElementById("phone-onboarding-container")
  // if (phoneOnboardingContainer) {
  //     phoneOnboardingContainer?.classList?.toggle("open")
  // }
};

export const isTouchDevice = () =>
  'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

export const getMediaURL = async (payload) => {
  let formdata = new FormData();
  formdata.append('image', payload);
  let url = await uploadFile(formdata);
  return url?.data?.data || '';
};

// export const handleFooterNavbar = () => {
//   const footerNav = document.getElementById('footer-navbar-target');
//   if (footerNav) {
//     footerNav.classList.toggle('slide-in');
//   }
// };

export const handleFooterNavbar = (isOpen) => {
  const footerNav = document.getElementById('footer-navbar-target');
  if (footerNav) {
    if (isOpen) {
      footerNav.classList.add('slide-in');
    } else {
      footerNav.classList.remove('slide-in');
    }
  }
};

export const isFaqOpened = () => {
  const footerNav = document.getElementById('mobile-faq');
  if (footerNav) {
    return footerNav.classList.contains('slide-in');
  }
  return false;
};

export const stickyBody = (isSticky, isMobile = false) => {
  const html = document.getElementsByTagName('html');
  if (html?.length && html[0] && isSticky) {
    html[0].style.overflow = 'hidden';

    html[0].style.height = '100%';
    if (isMobile) {
      html[0].style.position = 'fixed';
    }
  }
  if (html?.length && html[0] && !isSticky) {
    html[0].style.overflow = 'initial';
    html[0].style.height = 'initial';
    html[0].style.position = 'initial';
  }
};
export const handleFaqSlide = (isOpen = false) => {
  // const footerNav = document.getElementById('mobile-faq');
  // const html = document.getElementsByTagName('html');
  // if (footerNav) {
  //   if (isOpen) {
  //     footerNav.classList.add('slide-in');
  //   }
  //   if (html?.length && html[0] && footerNav?.classList?.contains('slide-in') && !isOpen) {
  //     html[0].style.overflow = 'hidden';
  //     footerNav.classList.remove('slide-in');
  //   } else {
  //     html[0].style.overflow = 'auto';
  //   }
  // }
};

export const isLegalOpened = () => {
  const footerNav = document.getElementById('legal-mobile');
  if (footerNav) {
    return footerNav.classList.contains('slide-in');
  }
  return false;
};

export const handleLegalSlide = (isOpen = false) => {
  //isOpen receives event that time is passed mean true
  // const footerNav = document.getElementById('legal-mobile');
  // const html = document.getElementsByTagName('html');
  // if (footerNav) {
  //   if (isOpen) {
  //     footerNav.classList.add('slide-in');
  //   }
  //   if (html?.length && html[0] && footerNav?.classList?.contains('slide-in') && !isOpen) {
  //     html[0].style.overflow = 'hidden';
  //     footerNav.classList.remove('slide-in');
  //   } else {
  //     html[0].style.overflow = 'auto';
  //   }
  // }
};

export const isAboutOpened = () => {
  const footerNav = document.getElementById('about-mobile');
  if (footerNav) {
    return footerNav.classList.contains('slide-in');
  }
  return false;
};
export const handleAboutSlide = (isOpen = false) => {
  // const footerNav = document.getElementById('about-mobile');
  // const html = document.getElementsByTagName('html');
  // if (footerNav) {
  //   if (isOpen) {
  //     footerNav.classList.toggle('slide-in');
  //   }
  //   if (html?.length && html[0] && footerNav?.classList?.contains('slide-in') && !isOpen) {
  //     html[0].style.overflow = 'hidden';
  //     footerNav.classList.remove('slide-in');
  //   } else {
  //     html[0].style.overflow = 'auto';
  //   }
  // }
};

export const isContactOpened = () => {
  const footerNav = document.getElementById('contact-mobile');
  if (footerNav) {
    return footerNav.classList.contains('slide-in');
  }
  return false;
};

export const handleContactSlide = (isOpen = false) => {
  // const footerNav = document.getElementById('contact-mobile');
  // const html = document.getElementsByTagName('html');
  // if (footerNav) {
  //   if (isOpen) {
  //     footerNav.classList.add('slide-in');
  //   }
  //   // footerNav.classList.toggle('slide-in');
  //   if (html?.length && html[0] && footerNav?.classList?.contains('slide-in') && !isOpen) {
  //     html[0].style.overflow = 'hidden';
  //     footerNav.classList.remove('slide-in');
  //   } else {
  //     html[0].style.overflow = 'auto';
  //   }
  // }
};

export function isValidMongoId(id) {
  // Check if the ID is a 24-character hexadecimal string
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export function generateUniqueRandomString(length) {
  const localStorage = window.localStorage.getItem('unique_id');
  if (localStorage) {
    return localStorage;
  }
  const date = new Date();
  return date.getTime().toString();
}

export const handleVirtualView = (setBookingVisible) => {
  toast.dismiss();
  if (setBookingVisible) {
    setBookingVisible((prev) => !prev);
  }
  showPopup();
  const view = document.getElementById('virtual-view-container');
  if (view) {
    view.classList.toggle('slide-in');
  }
};

export const convertToAmexFormat = (str) => {
  str = str.replaceAll(' ', '');
  let ans = '';
  for (let i = 0; i < str.length; i++) {
    if (i === 4 || i === 10) {
      if (str[i] !== ' ') {
        ans += ' ';
      }
    }
    ans += str[i] !== ' ' ? str[i] : '';
  }
  return ans;
};

export const openApp = () => {
  const isIOS = detectIOSDevice();
  if (isIOS) {
    window.open(process.env.REACT_APP_BLACKJET_APPSTORE_URL, '_blank');
  } else {
    window.open(process.env.REACT_APP_BLACKJET_PLAYSTORE_URL, '_blank');
  }
};

export const handleErrorClick = (getValues, neglect = {}) => {
  const obj = getValues();
  const array = Object.keys(obj);
  for (let index = 0; index < array.length; index++) {
    const name = array[index];
    if (name === 'payment_details') {
      let paymentKeys = ['cardholder_name', 'card_number', 'card_expiry', 'cvv'];
      for (let j = 0; j < paymentKeys.length; j++) {
        const paymentName = paymentKeys[j];
        if (!obj[name][paymentName]) {
          const curEle = document.getElementsByName(`${name}.${paymentName}`);
          if (curEle?.length && curEle[0]) {
            curEle[0].focus();
          }
          break;
        }
      }
    } else if (!obj[name] && !neglect[name]) {
      const curEle = document.getElementsByName(name);
      if (curEle?.length && curEle[0]) {
        curEle[0].focus();
      }
      break;
    }
  }
};

export const checkValidAustralianNumber = (mobile) => {
  const phoneNumber = parsePhoneNumber(mobile, 'AU');
  if (phoneNumber) {
    return phoneNumber.isValid();
  } else {
    return false;
  }
};

export function capitalizeString(str) {
  if (!str) return str;
  return str.replace(/(^|\s)\S/g, function (match) {
    return match.toUpperCase();
  });
}

export function hidePopup() {
  const popups = document.getElementsByClassName('popup-container');
  for (let i = 0; i < popups.length; i++) {
    popups[i].style.display = 'none';
  }
}

export function showPopup() {
  const popups = document.querySelectorAll('.popup-container');
  popups.forEach((popup) => {
    popup.style.display = 'block'; // or 'flex', 'inline-block', etc., depending on your layout
  });
}

export function hideSafariTabsSafeArea() {
  const popups = document.getElementsByClassName('safari-top-safe-area');
  for (let i = 0; i < popups.length; i++) {
    popups[i].style.display = 'none';
  }
}

function getDeviceType() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Regular expressions for detecting various device types
  const isMobile = /android|iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isTablet = /iPad/.test(userAgent) && !window.MSStream;
  const isDesktop = !isMobile && !isTablet;

  if (isTablet) {
    return 'Tablet';
  } else if (isMobile) {
    return 'Mobile';
  } else if (isDesktop) {
    return 'Desktop';
  } else {
    return 'Unknown';
  }
}
export function getDeviceTypeNotation() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Regular expressions for detecting various device types
  const isMobile = /android|iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isTablet = /iPad/.test(userAgent) && !window.MSStream;
  const isDesktop = !isMobile && !isTablet;

  if (isTablet) {
    return 'TB';
  } else if (isMobile) {
    return 'MB';
  } else if (isDesktop) {
    return 'DK';
  } else {
    return 'Unknown';
  }
}

function getIPAddress() {
  return fetch('https://api.ipify.org?format=json')
    .then((response) => response.json())
    .then((data) => data.ip)
    .catch((error) => {
      console.error('Error fetching IP address:', error);
      return null;
    });
}

function getBrowserAndDeviceInfo() {
  // Helper function to get browser name
  function getBrowserName() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
    if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) return 'Opera';
    if (userAgent.indexOf('Trident') > -1) return 'Internet Explorer';
    if (userAgent.indexOf('Edge') > -1) return 'Edge';
    if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
    if (userAgent.indexOf('Safari') > -1) return 'Safari';
    return 'Unknown';
  }

  // Device and browser information
  const deviceInfo = {
    mobileExtra: null,
    deviceName: getBrowserName(),
    deviceType: getDeviceType(),
    screenResolution: {
      width: window.screen.width,
      height: window.screen.height,
    },
    webExtra: {
      userAgent: navigator.userAgent,
      browserName: getBrowserName(),
      platform: navigator.platform,
      language: navigator.language,
      viewportSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      cookiesEnabled: navigator.cookieEnabled,
      javaEnabled: navigator.javaEnabled(),
      online: navigator.onLine,
    },
  };

  return deviceInfo;
}

export async function getCompleteInfo() {
  const browserAndDeviceInfo = getBrowserAndDeviceInfo();
  const ipAddress = await getIPAddress();

  return {
    ...browserAndDeviceInfo,
    ipAddress,
  };
}

export const openTopVariants = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: '100%' },
};

/**
 * Truncates the given text to the specified length and adds an ellipsis if truncated.
 * @param {string} text - The text to be truncated.
 * @param {number} maxLength - The maximum length of the text including the ellipsis.
 * @returns {string} - The truncated text with an ellipsis if necessary.
 */
export function truncateText(text, maxLength) {
  // If text length is less than or equal to maxLength, return text as is
  if (text.length <= maxLength) {
    return text;
  }

  // If maxLength is less than or equal to 3, just return ellipsis
  if (maxLength <= 3) {
    return '...';
  }

  // Calculate the length to truncate text (maxLength - 3 for ellipsis)
  const truncateLength = maxLength - 3;

  // Return truncated text with ellipsis
  return text.slice(0, truncateLength) + '...';
}

/**
 * Sorts an array of ISO date strings in ascending order.
 * @param {string[]} dates - The array of ISO date strings to be sorted.
 * @returns {string[]} - The sorted array of ISO date strings.
 */
export function sortDates(dates, key) {
  return dates.sort((a, b) => {
    // Convert the ISO date strings to Date objects for comparison
    return new Date(a[key] || a) - new Date(b[key] || b);
  });
}

export function isTimeOutdated(givenTime, outdatedTime) {
  // Get the current time
  const currentTime = new Date();
  const givenTimeDate = new Date(givenTime);

  // Calculate the time difference in milliseconds
  const timeDifference = currentTime - givenTimeDate;

  // Define 5 minutes in milliseconds
  const fiveMinutesInMillis = outdatedTime * 60 * 1000;

  // Check if the time difference is greater than 5 minutes
  if (timeDifference > fiveMinutesInMillis) {
    return false; // Outdated
  } else {
    return true; // Within 5 minutes
  }
}

/**
 * Checks if the current time is between the given start and end time strings.
 * @param {string} startTimeStr - The start time string (e.g., "1 PM", "12 AM")
 * @param {string} endTimeStr - The end time string (e.g., "1 PM", "12 AM")
 * @returns {boolean} - True if the current time is between the start and end times, false otherwise
 * @example -
 * const startTime = '1 PM';
 * const endTime = '5 PM';
 * console.log(isCurrentTimeBetween(startTime, endTime)); // Output depends on the current local time
 */
export function isCurrentTimeBetween(startTimeStr, endTimeStr) {
  if (!startTimeStr || !endTimeStr) {
    return false;
  }
  // Helper function to parse time strings (e.g., "1 PM", "12 AM")
  function parseTime(timeStr) {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const adjustedHours =
      period === 'PM' && hours !== 12 ? hours + 12 : period === 'AM' && hours === 12 ? 0 : hours;
    return new Date().setHours(adjustedHours, minutes || 0, 0, 0);
  }

  const currentTime = new Date();
  const startTime = parseTime(startTimeStr);
  const endTime = parseTime(endTimeStr);

  // If endTime is before startTime, it means the time range spans across midnight
  if (endTime < startTime) {
    return currentTime >= startTime || currentTime <= endTime;
  } else {
    return currentTime >= startTime && currentTime <= endTime;
  }
}
