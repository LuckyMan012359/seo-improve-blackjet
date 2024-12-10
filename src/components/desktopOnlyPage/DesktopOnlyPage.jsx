import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * DesktopOnlyPage
 *
 * This component renders a page with a heading and a message, explaining that
 * the page is not supported on mobile devices.
 *
 * @param {string} [heading='Investors'] - The heading to display on the page
 *
 * @returns {JSX.Element} The rendered component
 */
const DesktopOnlyPage = ({ heading = 'Investors' }) => {
  const navigate = useNavigate();
  /**
   * Closes the page and navigates the user back to the homepage.
   * @function
   */
  const handleClose = () => {
    navigate('/');
  };
  return (
    <div className='screen-not-available'>
      <div className='top-section'>
        <img
          onClick={handleClose}
          className='close-btn'
          src='/images/close-icon-white.svg'
          alt='close-icon-white'
        />
        <h1>{heading}</h1>
        <div></div>
      </div>
      <div className='mid-text'>
        <p className='mid-top-text'>We're sorry, this page is not supported on mobile devices</p>
        <p className='mid-bottom-text'>
          Please visit this page on a desktop browser. We apologize for any inconvenience.
        </p>
      </div>
      <span className='bottom-trademark'>©2023 Black Jet Mobility Pty Ltd</span>
    </div>
  );
};

export default memo(DesktopOnlyPage);
