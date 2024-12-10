import React from 'react';
import {  useNavigate } from 'react-router-dom';
import { ROUTE_LIST } from 'routes/routeList';

/**
 * A component that renders a call-to-action (CTA) to create an account if an email is already in use.
 * @param {Function} setOpen - A function to set the open state of the CTA modal.
 * @returns {React.ReactElement} - A React component that renders a CTA modal.
 */
const CTAOnboarding = ({ setOpen }) => {
  const navigate = useNavigate();
  
/**
 * Handles the creation of an account.
 * @function
 * @param {boolean} [isOpen=false] - The open state of the CTA modal.
 * @returns {undefined} - Does not return a value.
 */
  const handleCreate = () => {
    setOpen(false);
    // toggleDrawer()
    navigate(ROUTE_LIST.PHONE_ONBOARDING);
  };
  return (
    <div className='cta-onboarding booking-popup-wrap'>
      {/* <h2 className='heading'><span>{email}</span> is already in use with an existing account</h2> */}
      <p className='info'>
        Get a peek at our seamless unique booking process by dedicating less than a minute to create
        an account
      </p>
      <div className='flex buttons'>
        <button className='create' onClick={handleCreate}>
          Create a free account
        </button>
        <button className='close-cta' onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CTAOnboarding;
