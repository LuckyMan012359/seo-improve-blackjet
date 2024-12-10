import React, { useContext, useEffect, useRef, useState, memo } from 'react';
import { Img } from 'components';
import ProfileMenu from 'components/Home/ProfileMenu';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CommonButton from 'components/formcomponents/CommonButton';

import { useMediaQuery } from '@mui/material';
import CommonInput from 'components/formcomponents/CommonInput';
import OnboardingContext, { useBlackJetContext } from 'context/OnboardingContext';
import { IS_CHAT_OPEN, RESET_ONBOARDING } from 'constants/actions';
import { ROUTE_LIST } from 'routes/routeList';
import { goToTop } from 'utils';
// import { ROUTE_LIST } from 'Routes';
// import $ from 'jquery';
const URLMap = {
  [ROUTE_LIST.SMART_FIELD]: 15,
  [ROUTE_LIST.PHONE_NUMBER]: 30,
  [ROUTE_LIST.COMPENDIUM]: 45,
  [ROUTE_LIST.REFINED_SELECTION]: 60,
  [ROUTE_LIST.AT_YOUR_CONVENIENCE]: 75,
  [ROUTE_LIST.GRATIAS_TIBI_AGO]: 100,
};

const MODE = {
  UPCOMING: 'UPCOMING',
  PREVIOUS: 'PREVIOUS',
};

/**
 * Header component with logo, navigation links, and booking modal button.
 * @prop {boolean} open - whether the booking modal is open or not
 * @prop {function} setOpen - function to set the open state of the booking modal
 * @return {ReactElement} - the header component
 */
const Header = ({ open = false, setOpen = () => {} }) => {
  // there is tow logo "B" and BlackJet
  const [showLogo1, setShowLogo1] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  // const [visible, setVisible] = useState(true);

  const [toggleMode, setToggleMode] = useState(MODE.UPCOMING);

  const location = useLocation();
  // const param = useParams();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const isMobile = useMediaQuery('(max-width:699px)');
  const { onboardingForms, dispatchOnboardingForms } = useBlackJetContext();
  const hiddenSection = [
    ROUTE_LIST.SMART_FIELD,
    ROUTE_LIST.COMPENDIUM,
    ROUTE_LIST.EMAIL_ADDRESS,
    ROUTE_LIST.REFINED_SELECTION,
    ROUTE_LIST.AT_YOUR_CONVENIENCE,
    ROUTE_LIST.GRATIAS_TIBI_AGO,
    ROUTE_LIST.PHONE_NUMBER,
    ROUTE_LIST.REFER,
    ROUTE_LIST.GUEST_INVITE,
  ].map((route) => route.split('/')[1]);

  const firstSegment = location.pathname.split('/')[1];

  const showRoute = hiddenSection.includes(firstSegment);

  const handleDivClick = () => {
    // Navigate to another page when the div is clicked
    dispatchOnboardingForms({
      type: RESET_ONBOARDING,
    });
    goToTop();
    navigate('/');
  };

  const handleShowChat = (e) => {
    e.stopPropagation();
    console.log('clicked', onboardingForms.isChatOpen);
    dispatchOnboardingForms({
      type: IS_CHAT_OPEN,
      payload: { open: true, isResize: false, isMobile },
    });
  };

  useEffect(() => {
    if (showRoute) {
      setShowLogo1(false);
    } else {
      setShowLogo1(true);
    }
  }, [showRoute]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowLogo1(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (location.pathname === '/') {
        if (window.scrollY > 100 && location.pathname === '/') {
          setShowLogo1(false);
        } else {
          setShowLogo1(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowLogo1(false);
    }
    if (window.scrollY < 100 && location.pathname === '/') {
      setShowLogo1(true);
    }
    const handleScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (location?.pathname !== '/booking' && location?.pathname !== '/profile') {
        const currentScrollPos = window.pageYOffset;
        const header = headerRef.current;
        if (header) {
          if (prevScrollPos > currentScrollPos || currentScrollPos === 0) {
            header.classList.remove('slide-out');
            header?.classList?.add('slide-in');
          } else {
            header.classList.add('slide-out');
            header.classList.remove('slide-in');
          }
          setPrevScrollPos(currentScrollPos);
        }
      } else {
        const header = headerRef.current;
        header?.classList?.add('slide-in');
        setPrevScrollPos(window.pageYOffset);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos, location.pathname]);

  const handleModalOpen = () => {
    if (document.getElementsByTagName('body')[0] && !open) {
      document.getElementsByTagName('body')[0].classList.toggle('booking-modal');
    }
    setOpen(true);
  };

  const handleChangeMode = (mode) => {
    if (mode === MODE.UPCOMING) {
      setToggleMode(MODE.UPCOMING);
    } else {
      setToggleMode(MODE.PREVIOUS);
    }
  };

  return (
    <div
      className={`relative ${!isMobile && 'border-[1px] border-solid border-transparent'}`}
      // style={{
      //   border: !isMobile && '1px solid transparent',
      // }}
    >
      <header
        ref={headerRef}
        className={`header-wrap mobile-header-wrap ${
          location.pathname === '/' ? 'home-no-blur' : ''
        } fixed flex sm:px-0  bg-[#000000A6] z-50 flex-col  px-[48px] inset-x-[0] items-center justify-center mx-auto  top-[0] w-full`}
      >
        {showRoute && (
          <>
            <div className=' horizontal'>
              <div
                // style={{ width: `${URLMap[location.pathname] || 20}%` }}
                className={`${
                  URLMap[location.pathname] === 10
                    ? 'w-[10%]'
                    : URLMap[location.pathname] === 20
                    ? 'w-[20%]'
                    : URLMap[location.pathname] === 30
                    ? 'w-[30%]'
                    : 'w-[20%]'
                } h-0 border-2 z-40 absolute border-solid border-[#fffdfd] top-[50px] left-[68px]`}
              ></div>
            </div>
          </>
        )}

        <div className='sm:flex  sm:items-center h-[52px] relative w-full'>
          <div className='absolute h-full  sm:relative sm:flex sm:items-center  bottom-[0]  sm:w-full flex sm:justify-center flex-row md:gap-10 inset-x-[0] items-center justify-between w-full'>
            <div
              onClick={handleShowChat}
              className='hidden sm:px-[16px] h-full min-h-full sm:flex sm:items-center relative'
            >
              <ChatNotification />
            </div>

            <div
              onClick={() => handleDivClick()}
              className='relative w-1/3 sm:flex sm:justify-center sm:w-full mobile-logo-wrap'
            >
              {!(location.pathname === '/booking' || location.pathname === '/profile') && (
                <Img
                  className={` ${
                    !showLogo1 ? 'visible' : ''
                  } sm:left-[50%] h-[38px] sm:h-[20px] sm:w-full  w-[46px] cursor-pointer mob-logo`}
                  src='/images/img_television.svg'
                  alt='television'
                  id='logo1'
                />
              )}
              {location.pathname === '/' && (
                <Img
                  className={`absolute w-[160px] sm:w-[100%] top-0 sm:left-0 h-[38px] sm:h-[20px]  ${
                    showLogo1 ? 'visible' : ''
                  }  cursor-pointer`}
                  src='/images/Workmark_wh.svg'
                  alt='television'
                  id='logo2'
                />
              )}
              {location.pathname === '/booking' && <div className='mobile-heading'>Bookings</div>}
            </div>

            {!showRoute && (
              <div className='h-[63px] sm:!px-[8px] sm:h-fit sm:w-fit flex items-center sm:justify-end md:h-auto relative w-[383px] '>
                <Link to={ROUTE_LIST.SMART_FIELD}>
                  <CommonButton
                    className='!text-gray-900 header-btn sm:hidden xl:text-[14px] border px-[12px] py-[8px] border-solid border-white-A700 cursor-pointer  h-[40px] leading-[normal] text-center text-sm '
                    text={'Create a free Account'}
                  />
                </Link>

                <div className='desktop-menu absolute sm:!w-fit sm:!h-fit sm:relative flex flex-col gap-3 h-401px] items-end justify-start  right-[0] rounded w-[40px]'>
                  <ProfileMenu />
                </div>
              </div>
            )}
          </div>
        </div>
        {location?.pathname === '/booking' && (
          <div className='fixed-sub-header'>
            <div className='form-group' onClick={handleModalOpen}>
              <CommonInput
                readOnly={true}
                type='number'
                name='book a flight'
                placeholder='Book a flight'
              />
              <img className='flight-search-icon' src='/images/flight-icon.svg' alt='flight-icon' />
            </div>
            <div className='flight-type-select'>
              <span
                role='button'
                className={toggleMode === MODE.UPCOMING && 'active'}
                onClick={() => handleChangeMode(MODE.UPCOMING)}
              >
                Upcoming
              </span>
              <span
                role='button'
                className={toggleMode === MODE.PREVIOUS && 'active'}
                onClick={() => handleChangeMode(MODE.PREVIOUS)}
              >
                Previous
              </span>
            </div>
          </div>
        )}
      </header>
      {!showRoute && (
        <div
          id='profile-links'
          className='z-50 fixed sm:!w-fit sm:!h-fit sm:relative flex flex-col gap-3 items-end justify-start  right-[0] rounded w-[40px] h-[40px]'
        >
          <ProfileMenu />
        </div>
      )}
    </div>
  );
};

/**
 * A functional component that renders a notification with a count of unread messages.
 * @param {object} props - The props object with the following properties:
 * @param {string} className - The class name to be applied to the container element.
 * @param {string} imgClass - The class name to be applied to the img element.
 * @return {JSX.Element} The JSX element representing the notification.
 */
export const ChatNotification = ({ className, imgClass, ...props }) => {
  const { onboardingForms } = useContext(OnboardingContext);

  const count = onboardingForms.messageCount;
  return (
    <div className={`relative ${className}`} {...props}>
      {count > 0 && (
        <div className='chat-notification'>
          <div className='chat-notification-number'>{count}</div>
        </div>
      )}
      <Img className={`${imgClass} w-[21px] min-w-[21px]  `} src='/images/Chat.svg' alt='Chat' />
    </div>
  );
};

export default memo(Header);
