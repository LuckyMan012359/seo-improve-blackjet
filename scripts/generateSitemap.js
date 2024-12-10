// /scripts/generateSitemap.js

const fs = require('fs');
const path = require('path');

// Environment variables for domain (replace with process.env or dotenv in production)
const DOMAIN = process.env.SITE_DOMAIN || 'https://seo-improve-blackjet-testing.vercel.app';

const ROUTE_LIST = {
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
  MOBILE_ANIMATION: '/mobile-animation',
  REFER: '/refer/:id',
  GUEST_INVITE: '/invite/:id',
  SHARED_FLIGHT: '/shared-flight/:id',
  EMAIL_VERIFICATION_PASS: '/email-verification/pass',
  EMAIL_VERIFICATION_FAIL: '/email-verification/fail/:id',
};

// Function to replace dynamic segments with placeholders or default values
const resolveDynamicRoute = (route, defaultValue = '123') => route.replace(/:\w+/g, defaultValue);

const generateSitemap = (routes, domain) => {
  const urls = Object.values(routes)
    .filter((route) => route !== '*') // Exclude wildcard routes
    .map((route) => `<url><loc>${domain}${resolveDynamicRoute(route)}</loc></url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

// Generate sitemap content
const sitemapContent = generateSitemap(ROUTE_LIST, DOMAIN);

// Write sitemap to public folder (or static folder in production)
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapContent);

console.log('Sitemap generated:', sitemapPath);
