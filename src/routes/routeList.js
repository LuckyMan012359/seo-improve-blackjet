export const ROUTE_LIST = {
  HOME: '/',
  APP_HOME: '/app-mb',
  FAQ: '/faqs',
  LEGAL: '/legal',
  CONTACT_US: '/contactus',
  CAREERS: '/careers',
  JOB_PAGE: '/job/:id',
  ABOUT_US: '/aboutus',
  NEWS: '/news',
  MEDIA: '/media',
  INVESTORS: '/investors',
  PROFILE: '/profile',
  BOOKING: '/booking',
  NOT_FOUND: '*',

  EMAIL_ADDRESS: '/email-address',
  COMPENDIUM: '/compendium',
  GRATIAS_TIBI_AGO: '/gratias-tibi-ago',
  SMART_FIELD: '/smart-field',
  REFINED_SELECTION: '/refined-selection',
  PHONE_NUMBER: '/phone-number',
  AT_YOUR_CONVENIENCE: '/at-your-convenience',
  A_DAY_WITH_BLACKJET: '/a-day-with-blackjet',
  PHONE_ONBOARDING: '/phone-onboarding',
  VIRTUAL_VIEW: '/virtual-view',
  MOBILE_ANIMATION: 'mobile-animation',

  // outer route
  REFER: '/refer/:id',
  GUEST_INVITE: '/invite/:id',
  SHARED_FLIGHT: '/shared-flight/:id',

  // Email verification
  EMAIL_VERIFICATION_PASS: '/email-verification/pass',
  EMAIL_VERIFICATION_FAIL: '/email-verification/fail/:id',
};

const appRedirectUrl = process.env.REACT_APP_REDIRECTION_URL;
export const PWA_REDIRECTION_LINK = {
  MEMBERSHIP: `${appRedirectUrl}/#/membership_plan`,
  FAQ: `${appRedirectUrl}/#/faq`,
  REDIRECTION: `${appRedirectUrl}/#/pwa`,
};
