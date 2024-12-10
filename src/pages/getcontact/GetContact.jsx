import React, { useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import { Entermobilegetapp } from 'components/Popup';
import FramerMotion from 'components/animations/FramerMotion';
import EnquiryForm from 'components/enquiryform/EnquiryForm';
import { handleContactSlide, isContactOpened } from 'helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_LIST } from 'routes/routeList';

/**
 * GetContact is a component that handles the contact us form rendering.
 * It also handles the slide-in animation for the contact us form on mobile devices.
 * If the user is on a mobile device and navigates to the contact us page, this component
 * will automatically open the contact us form.
 * When the user submits the form or clicks the close button, this component will close the form
 * and redirect the user to the previous page or the landing page if there is no previous history.
 * @returns {JSX.Element} The rendered contact us component
 */
const GetContact = () => {
  const isMobile = useMediaQuery('(max-width : 699px)');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    if (isMobile && pathname === ROUTE_LIST.CONTACT_US) {
      if (!isContactOpened()) {
        handleContactSlide(true);
      }
    }
  }, [isMobile, pathname]);

  /**
   * Closes the contact us form and redirects the user to the previous page
   * or the landing page if there is no previous history.
   * @returns {void}
   */
  const handleCloseContactUs = () => {
    // setTimeout(() => {
    if (window.history.length > 2) {
      // Check for at least two entries (SPA + initial visit)
      navigate(-1);
    } else {
      navigate('/'); // Redirect to landing page if no previous history
    }
    // }, 250);
    // handleContactSlide();
  };

  return (
    <FramerMotion key={'getcontact'}>
      <div id='contact-mobile'>
        <Entermobilegetapp />
        <img
          className='close-btn'
          src='images/close-icon-white.svg'
          alt='close-icon-white'
          onClick={handleCloseContactUs}
        />
        <EnquiryForm type={'contact_us'} enquirybg='contact-form'>
          <div className='contact-heading fixed-header-pages'>Get In Contact</div>
        </EnquiryForm>
        {isMobile && (
          <span className='bottom-trademark-contact'>©2023 Black Jet Mobility Pty Ltd</span>
        )}
      </div>
    </FramerMotion>
  );
};

export default GetContact;
