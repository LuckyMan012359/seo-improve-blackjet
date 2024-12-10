// import Footer from 'components/Footer';
import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * The PwaAppLayout component is a layout component that wraps the
 * PWA's pages. It renders the Outlet component, which is where the
 * page content is rendered. It also renders the Footer component,
 * which is commented out in order to prevent the Footer from being
 * rendered on every page.
 */
const PwaAppLayout = () => {
  return (
    <>
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default PwaAppLayout;
