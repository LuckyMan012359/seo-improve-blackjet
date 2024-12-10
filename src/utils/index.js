import { VALID_ROUTES } from 'constants/validRoute';

export const handleSectionNavigation = (id) => {
  const element = document.getElementById(id);
  const offset = 45;
  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = element?.getBoundingClientRect().top ?? 0;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

/**
 * Formats a number with commas as thousand separators.
 *
 * @param {number|string} number - The number to be formatted.
 * @return {string} The formatted number as a string.
 */
export function numberWithCommas(number) {
  let num = Number(number);
  // Check if input is empty or not a number/string
  if (!num || (typeof num !== 'number' && typeof num !== 'string')) {
    return '';
  }

  // Convert number to string for consistent handling
  num = num.toString();

  // Split the string by decimal point (if any)
  const parts = num.split('.');

  // Apply comma separation to the integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Join the parts back with a decimal (if applicable)
  return parts.join('.');
}

// scroll to top
export const goToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export const MEMBERSHIP_HIGHLIGHTS_CODE = {
  INITIATION_FEE: 'OTIF Price & D Price',
};

export const isMobileValidRoute = (locationIds = [], pathname) => {
  return locationIds.find((ele) => ele.name === VALID_ROUTES.MB_MENU)?.isAdd || false;
};

export const isDesktopValidRoute = (locationIds = [], pathname) => {
  return (
    locationIds.find(
      (ele) => ele.name === VALID_ROUTES.DK_TB_MENU || ele.name === VALID_ROUTES.DK_TB_FOOTER,
    )?.isAdd || false
  );
};

export const isDesktopOnlyValidRoute = (locationIds = [], pathname) => {
  return locationIds.find((ele) => ele.name === VALID_ROUTES.DK_TB_MENU)?.isAdd || false;
};

export const isDesktopFooterValidRoute = (locationIds = [], pathname) => {
  return locationIds.find((ele) => ele.name === VALID_ROUTES.DK_TB_FOOTER)?.isAdd || false;
};

export const FORM_SUBMISSION_TIME = 15;
export const TIME_KEY = {
  CONTACT_FORM: 'contactFormTime',
  JOB_FORM: 'jobFormTime',
}

/**
 * Saves the current time to localStorage and checks if the time difference
 * between the saved time and the current time is less than 1 minute (60000 ms).
 * If the time difference is less than 1 minute, returns false. Otherwise, saves
 * the current time and returns true.
 * @returns {boolean} whether the time difference is less than 1 minute
 */
export function saveTimeAndCheck(timeInSeconds = 1, timeKey) {
  const currentTime = Date.now();
  const savedTime = localStorage.getItem(timeKey);

  if (savedTime) {
    const elapsedTime = currentTime - parseInt(savedTime, 10);
    const time = 1000 * timeInSeconds;
    if (elapsedTime < time) {
      // Time has not expired, return false
      return false;
    }
  }

  // Save the current time and return true
  localStorage.setItem(timeKey, currentTime.toString());
  return true;
}

/**
 * Reads the saved time from localStorage and checks if the time difference
 * between the saved time and the current time is less than 1 minute (60000 ms).
 * If the time difference is less than 1 minute, returns true. Otherwise, returns false.
 * @returns {boolean} whether the time difference is less than 1 minute
 */
export function readTimeStatus(timeKey) {
  const currentTime = Date.now();
  const savedTime = localStorage.getItem(timeKey);

  if (savedTime) {
    const elapsedTime = currentTime - parseInt(savedTime, 10);
    return elapsedTime < 1000 * FORM_SUBMISSION_TIME; // Returns true if within 1 minute, else false
  }

  return false; // No saved time in localStorage
}
