import React, { useEffect, useState } from 'react';
import CommonButton from 'components/formcomponents/CommonButton';
import Virtualview from 'components/Virtualview';
import { handleVirtualView } from 'helpers';
import CustomModal from 'components/modal/CustomModal';
import CTAOnboarding from 'components/onboarding/CTAOnboarding';
import { useBlackJetContext } from 'context/OnboardingContext';
import { CHANGE_PREORDER_STATUS } from 'constants/actions';
import { useNavigate } from 'react-router-dom';
import { Entermobilegetapp } from 'components/Popup';

import Landscape from 'components/phoneonboarding/Landscape';
import { useMediaQuery } from '@mui/material';
import useIsMobile from 'Hook/useIsMobile';
import { ROUTE_LIST } from 'routes/routeList';
import { virtualTour } from 'assets';
const Booking = ({ open, setOpen }) => {
  const [bookingVisible, setBookingVisible] = useState(false);

  const { onboardingForms, dispatchOnboardingForms } = useBlackJetContext();
  const details = onboardingForms?.membershipData;
  const navigate = useNavigate();
  const orientation = useMediaQuery('(orientation: portrait)');
  const isMobile = useIsMobile();

  const handlePreOrder = () => {
    // console.count('fixed_router');
    // toggleDrawer()
    navigate(ROUTE_LIST.PHONE_ONBOARDING);
    dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: true });
  };

  useEffect(() => {
    if (!open) {
      if (
        document.getElementsByTagName('body')[0] &&
        document.getElementsByTagName('body')[0].classList.contains('booking-modal')
      ) {
        document.getElementsByTagName('body')[0].classList.toggle('booking-modal');
      }
    }
  }, [open]);

  async function onClick() {
    // feature detect
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            // for iOS phone only
            setBookingVisible((prev) => !prev);
            setTimeout(() => {
              handleVirtualView();
            }, 0);
            // window.addEventListener('deviceorientation', () => {});
          }
        })
        .catch(console.error);
    } else {
      // other browsers
      setBookingVisible((prev) => !prev);
      setTimeout(() => {
        handleVirtualView();
      }, 0);
    }
  }

  const handleOpenClick = async () => {
    await onClick();
  };

  if (!orientation && isMobile && !bookingVisible) {
    return <Landscape />;
  }

  return (
    <div className='mob-booking-wrap'>
      <Entermobilegetapp />
      {/* <div className="mobile-heading">Bookings</div> */}
      <div className='common-form-wrap'>
        {/* <div className='fixed-sub-header'>
          <div className='form-group' onClick={handleModalOpen}>
            <CommonInput readOnly={true} type="number" name="book a flight" placeholder="Book a flight" />
            <img className='flight-search-icon' src="/images/flight-icon.svg" alt="" />
          </div>
          <div className='flight-type-select'>
            <span className='active'>Upcoming
            </span>
            <span>Previous
            </span>
          </div>
        </div> */}
        <div className='tour-img-wrap cursor-pointer' role='button' onClick={handleOpenClick}>
          <img className='tour-img' src={virtualTour} alt='' />
          <span className='tour-click'>
            Tour the plane{' '}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='11'
              height='8'
              viewBox='0 0 11 8'
              fill='none'
            >
              <path
                d='M1 4C1 3.72386 1.22386 3.5 1.5 3.5H8.29289L5.64645 0.853553C5.45118 0.658291 5.45118 0.341709 5.64645 0.146447C5.84171 -0.0488156 6.15829 -0.0488156 6.35355 0.146447L9.85355 3.64645C10.0488 3.84171 10.0488 4.15829 9.85355 4.35355L6.35355 7.85355C6.15829 8.04882 5.84171 8.04882 5.64645 7.85355C5.45118 7.65829 5.45118 7.34171 5.64645 7.14645L8.29289 4.5H1.5C1.22386 4.5 1 4.27614 1 4Z'
                fill='white'
              />
            </svg>
          </span>
        </div>
        <div className='tour-cards-scroll'>
          {/* 1 */}
          <div className='homeCard'>
            <div className='home-inner'>
              <img src='/images/member-mob-1.svg' alt='settings' />
              <h1 className='homeCardHeader'>
                Private jet <span>travel experience</span> within your reach
              </h1>
            </div>
            <p className='homeCardDesc'>
              Gone are the days when private jet travel was reserved for the ultra-wealthy and
              corporate tycoons. Our innovative approach makes accessible for those who value their
              time and peace of mind.
            </p>
          </div>
          {/* 2 */}
          <div className='homeCard stress'>
            <div className='home-inner'>
              <img src='/images/member-mob-2.svg' alt='close' />
              <h3 className='homeCardHeader'>
                Community <span>and</span> <br /> networking
              </h3>
            </div>
            <p className='homeCardDesc'>
              Join a community of discerning Black Jet members, fostering meaningful connections
              both in the skies and on the ground.
            </p>
          </div>
          {/* 3 */}
          <div className='homeCard guest'>
            <div className='home-inner'>
              <img src='/images/member-mob-3.svg' alt='close' />
              <h3 className='homeCardHeader'>Guest Passes</h3>
            </div>
            <p className='homeCardDesc'>
              With a Black Jet membership, every three months a complementary Guest Pass is reserved
              for you, letting you introduce a chosen one to fly with you on a flight. With an
              active Black Jet membership, your yet-to-be-used Guest Passes never expire.
            </p>
          </div>
          {/* 4 */}
          <div className='homeCard'>
            <div className='home-inner'>
              <img src='/images/member-mob-4.svg' alt='search' />
              <h3 className='homeCardHeader'>
                Health <span>and</span> safety
              </h3>
            </div>
            <p className='homeCardDesc'>
              You fly with a maximum of 7 other passengers. With less contact points and reduced
              stress, our travel experience grants you more time for relaxation. Arrive healthier,
              rejuvenated, and ready to focus on what's truly important.
            </p>
          </div>
          {/* 5 */}
          <div className='homeCard health'>
            <div className='home-inner'>
              <img src='/images/member-mob-5.svg' alt='favorite' />
              <h3 className='homeCardHeader'>Flexibility</h3>
            </div>
            <p className='homeCardDesc'>
              Instantly book your flight at any moment, with the freedom to cancel without penalty
              up to 24 hours before takeoff. The era of travel tailored to your preferences is here.
            </p>
          </div>
          {/* 6 */}
          <div className='homeCard commit'>
            <div className='home-inner'>
              <img src='/images/member-mob-6.svg' alt='television' />
              <h3 className='homeCardHeader'>
                No drawn-out boarding procedures, no security lines, no loudspeakers
              </h3>
            </div>
            <p className='homeCardDesc'>
              Arrive and board your aircraft in minutes with Black Jet, bypassing security checks,
              check-in lines, or long walks to the gate. Our members-only flights ensure everyone's
              identity is pre-verified, streamlining your travel experience.
            </p>
          </div>
          {/* 7 */}
          <div className='homeCard'>
            <div className='home-inner'>
              <img src='/images/member-mob-7.svg' alt='user' />
              <h1 className='homeCardHeader'>Private terminal lounges</h1>
            </div>
            <p
              // className=""
              className='homeCardDesc'
            >
              Travel in style from our private terminal lounges. Indulge in a selection of carefully
              chosen healthy snacks and beverages for a refined experience.
            </p>
          </div>
          {/* 8 */}
          <div className='homeCard'>
            <div className='home-inner'>
              <img src='/images/member-mob-8.svg' alt='favorite' />
              <h3 className='homeCardHeader'>
                Stress-free <span>and</span> <br /> hassle-free
              </h3>
            </div>
            <p className='homeCardDesc'>
              Enjoy serene departures and arrivals from our private terminal, where our hostess
              greets you by name without complex check-ins or boarding. Seamless, comfortable, and
              convenient travel tailored to you.
            </p>
          </div>
          {/* 9 */}
          <div className='homeCard'>
            <div className='home-inner'>
              <img src='/images/member-mob-9.svg' alt='whybeamember' />
              <h3 className='homeCardHeader'>No commitment, cancel anytime</h3>
            </div>
            <p className='homeCardDesc'>
              Benefit from our membership's monthly payments and auto-renewal. Cancel anytime to
              stop auto-renewal if unsatisfied—no lock-in contracts, no risk.
            </p>
          </div>
          {/* 10 */}
          <div className='homeCard'>
            <div className='home-inner'>
              <img src='/images/member-mob-10.svg' alt='whybeamember' />
              <h3 className='homeCardHeader'>Arrive 15 minutes before departure</h3>
            </div>
            <p className='homeCardDesc'>
              Arrive a mere 15 minutes before departure at our exclusive private terminal — say
              goodbye to busy terminals and lengthy lines.
            </p>
          </div>
          {/* 11 */}
          <div className='home-last-div homeCard'>
            <div className='home-inner'>
              <img
                className='h-[39px] 4k:h-[70px] 4k:w-[72px] lg:w-[34px] lg:h-[34px] w-10'
                src='/images/member-mob-11.svg'
                alt='thumbsup'
              />
              <h1 className='homeCardHeader'>Unlimited flights</h1>
            </div>
            <p className='homeCardDesc'>
              Enjoy unlimited flights with a fixed monthly fee. Absolutely no hidden charges, no
              surprises.
            </p>
          </div>
        </div>
        <CommonButton
          text={
            <div className='flex items-center justify-center w-full'>
              <img src='/images/Black Jet Logo.svg' alt='blackjet logo' />
              {!details?.preOrder ? 'Become a member' : 'Pre-order now'}
              {/* Pre-order to  */}
            </div>
          }
          type='button'
          onClick={handlePreOrder}
        />
      </div>
      <div id='virtual-view-container'>
        {bookingVisible && (
          <Virtualview
            bookingVisible={bookingVisible}
            visible={true}
            handleButtonClick={() => handleVirtualView(setBookingVisible)}
          />
        )}
      </div>
      <div className='Modal'>
        <CustomModal openDialog={open} handleCloseDialog={() => setOpen(false)} size='sm'>
          <CTAOnboarding setOpen={setOpen} />
        </CustomModal>
      </div>
    </div>
  );
};

export default Booking;
