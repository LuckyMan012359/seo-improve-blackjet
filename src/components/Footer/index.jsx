import React, { memo, useEffect, useRef, useState } from 'react';
import {
  //  Menu, MenuItem,
  useMediaQuery,
} from '@mui/material';
import {
  // East,
  ExpandMore,
} from '@mui/icons-material';
import {
  // Img, Line, List,
  Text,
} from 'components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import moment from 'moment-timezone';
// import { countOccurrences, messageFormatter } from 'helpers';
// import Slide from '@mui/material/Slide';
import useOutsideClick from 'Hook/useOutsideClick';
import eventBus from 'helpers/eventBus';
// import ChatBox from './ChatBox';
import { useBlackJetContext } from 'context/OnboardingContext';
import { IS_CHAT_OPEN } from 'constants/actions';
import { ChatNotification } from 'components/Header';
import { ROUTE_LIST } from 'routes/routeList';
import { isDesktopFooterValidRoute } from 'utils';

const Footer = () => {
  const mobileWidth = useMediaQuery('(max-width : 1049px)');

  const location = useLocation();

  const chatRef = useRef(null);
  const pagesRef = useRef(null);

  const footerRef = useRef(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const { onboardingForms, dispatchOnboardingForms } = useBlackJetContext();
  const navigate = useNavigate();

  const {
    // aboutUsLocationIds = [],
    careersLocationIds = [],
    // contactUsLocationIds = [],
    // faqsLocationIds = [],
    // investorsLocationIds = [],
    legalLocationIds = [],
    // mediaPressLocationIds = [],
    // newsLocationIds = [],
  } = onboardingForms?.savedLocation || {};

  const hiddenSection = [
    ROUTE_LIST.SMART_FIELD,
    ROUTE_LIST.COMPENDIUM,
    ROUTE_LIST.EMAIL_ADDRESS,
    ROUTE_LIST.REFINED_SELECTION,
    ROUTE_LIST.AT_YOUR_CONVENIENCE,
    ROUTE_LIST.GRATIAS_TIBI_AGO,
    ROUTE_LIST.PHONE_NUMBER,
    '/booking',
    '/profile',
  ];

  const showRoute = hiddenSection.includes(location.pathname);

  // const open = Boolean(anchorEl);
  // const openMenu = Boolean(anchorMenu);

  useEffect(() => {
    eventBus.on('showchat', (count) => {
      if (chatRef?.current) {
        chatRef.current.classList.add('show-chat');
        chatRef.current.classList.remove('hide-chat');
        if (document.getElementsByTagName('html')[0]) {
          document.getElementsByTagName('html')[0].classList.add('show-chat');
        }
      }
    });
    return () => {
      eventBus.remove('showchat');
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (location?.pathname !== '/booking' && location?.pathname !== '/profile') {
        const currentScrollPos = window.pageYOffset;
        const footer = footerRef.current;
        if (footer) {
          if (prevScrollPos > currentScrollPos || currentScrollPos === 0) {
            footer.classList.remove('slide-out');
            footer?.classList?.add('slide-in');
          } else {
            footer.classList.add('slide-out');
            footer.classList.remove('slide-in');
          }
          setPrevScrollPos(currentScrollPos);
        }
      } else {
        const footer = footerRef.current;
        footer?.classList?.add('slide-in');
        setPrevScrollPos(window.pageYOffset);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos, location.pathname]);

  useOutsideClick('FooterLinks', () => {
    if (pagesRef.current) {
      const container = pagesRef.current;
      if (container.classList.contains('show-chat')) {
        container.classList.remove('show-chat');
        container.classList.add('hide-chat');
      }
    }
  });

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // const handleMenuClick = (event) => {
  //   setAnchorMenu(event.currentTarget);
  // };
  // const handleMenuClose = () => {
  //   setAnchorMenu(null);
  // };

  const handleChatRefClick = (e) => {
    e.stopPropagation();
    dispatchOnboardingForms({
      type: IS_CHAT_OPEN,
      payload: { open: !onboardingForms.isChatOpen.open, isResize: true },
    });
  };
  const handlePagesRefClick = () => {
    if (pagesRef?.current) {
      const container = pagesRef?.current;
      if (container.classList.contains('show-chat')) {
        container.classList.remove('show-chat');
        container.classList.add('hide-chat');
      } else {
        container.classList.remove('hide-chat');
        container.classList.add('show-chat');
      }
    }
  };

  const reserveText =
    'Flights operated by Black Jet Aviation Pty Ltd (subject to regulatory approval)';

  return (
    <>
      <div
        className='fixed main-footer-container bottom-0 w-full z-50'
        onMouseMove={(e) => e.preventDefault()}
        onMouseLeave={(e) => e.preventDefault()}
      >
        <footer className='footer-page-wrap sm:hidden backdrop-blur-[17.5px] bg-[rgba(20,20,20,0.25)] flex md:h-auto py-[6px] items-center justify-between mt-[-8px] mx-auto px-16 md:px-5 w-full z-[1]'>
          {/* <div className=" w-full h-[40px] !bg-[red]"></div> */}
          <div className='flex flex-row items-center justify-between w-full sm:flex-col-reverse sm:inline-block xl:md:gap-8 md:gap-10'>
            <div className='flex sm:flex-1 flex-col gap-0 items-start justify-center w-auto sm:w-full'>
              <div className='destkop-footer-wrap flex flex-row items-center justify-start w-auto gap-6 xl:!gap-3 md:!gap-4 tab:!gap-3 sm:text-center sm:flex-row-reverse sm:w-full relative'>
                {!showRoute && (
                  <>
                    <Text className=' footer-txt sm:hidden'>©2023 Black Jet Mobility Pty Ltd</Text>
                    {isDesktopFooterValidRoute(legalLocationIds) && (
                      <div className='w-auto text-sm text-gray-400  sm:flex sm:justify-center sm:w-1/2'>
                        <Link to={'/legal?type=Privacy Policy'} className='option-text'>
                          <Text className='sm:text-center footer-txt' size='txtHauoraRegular14'>
                            Privacy Policy
                          </Text>
                        </Link>
                      </div>
                    )}
                    {isDesktopFooterValidRoute(legalLocationIds) && (
                      <Link to={'/legal?type=Terms of use'} className='option-text'>
                        <Text
                          className='w-auto text-sm text-gray-400 footer-txt sm:text-center sm:w-1/2'
                          size='txtHauoraRegular14'
                        >
                          Terms of Use
                        </Text>
                      </Link>
                    )}

                    {isDesktopFooterValidRoute(careersLocationIds) && (
                      <Link to='/careers' className='option-text'>
                        <Text
                          className='careers-text w-auto text-sm text-gray-400 footer-txt sm:text-center sm:w-1/2'
                          size='txtHauoraRegular14'
                        >
                          Careers
                        </Text>
                      </Link>
                    )}
                    {/* <Menu
                    id="basic-menu"
                    className="transition-all mobile-dropdown"
                    anchorEl={anchorMenu}
                    open={openMenu}
                    onClose={handleMenuClose}
                    classes={{
                      list: "!h-full sm:hidden",
                      paper: `!translate-y-[calc(0%-30px)] sm:hidden border !border-[#737373] !rounded-[8px] translate-[height] ease-in-out duration-[300ms]  !h-[174px]  !w-[145px] !backdrop-blur-[47px] !bg-[rgba(20,20,20,0.35)]`,
                    }}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                    MenuListProps={{
                      "aria-labelledby": "basic-button-Menu",
                    }}
                  > */}

                    {/* </Menu> */}
                  </>
                )}
              </div>

              <Text className='hidden w-auto footer-txt sm:my-[30px] sm:justify-center sm:flex sm:w-full sm:text-center'>
                ©2023 Black Jet Mobility Pty Ltd
              </Text>
              <Text className='desktop-copy-right text-[9px] sm:w-full text-gray-600_01 w-full sm:!text-center su absolute top-[26px] md:top-[28px]'>
                {reserveText}
                {/* Desktop */}
              </Text>
            </div>

            {!showRoute && (
              <>
                <div className='accodian-footer-tag relative flex flex-row items-center font-medium justify-end w-auto gap-6 sm:flex-row sm:justify-center sm:flex-1 sm:w-full'>
                  {/* Desktop */}
                  {!mobileWidth && (
                    <>
                      {/* <Link className='w-auto footer-txt cursor-pointer' to='/media'>
                        Media/Press
                      </Link> */}
                      {/* <Link
                        className='mb-[5px] mt-auto footer-txt w-auto cursor-pointer'
                        to='/investors'
                      >
                        Investors
                      </Link> */}
                      {isDesktopFooterValidRoute(careersLocationIds) && (
                        <Link to='/careers' className='w-auto my-auto footer-txt cursor-pointer'>
                          Careers
                        </Link>
                      )}
                    </>
                  )}
                  <div className=' sm:hidden  flex flex-col h-full inset-y-[0] items-end justify-start my-auto md:pl-10 sm:pl-5  right-[0] w-[94%]'>
                    {/* <Menu
                    ref={chatRef}
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    // TransitionComponent={Slide}
                    classes={{
                      list: "!h-full !pt-0",
                      paper: `chat-wrap transition-all !translate-y-[calc(0%-0px)] border-[2px] !rounded-[8px] translate-[height] ease-in-out duration-[300ms]  h-[425px]  w-[300px] !backdrop-blur-[47px] !bg-[rgba(20,20,20,0.35)] ${
                        open ? "slide-in" : "slide-out"
                      }`,
                    }}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  > */}

                    {/* </Menu> */}
                    <button
                      id='basic-button'
                      // aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup='true'
                      // aria-expanded={open ? 'true' : undefined}
                      onClick={handleChatRefClick}
                      className=' border  border-solid text-gray-100 rounded relative chat-btn-wrap cursor-pointer flex items-center justify-center !border-[#B3B3B3] min-w-[145px]'
                      shape='round'
                      color='gray_400_01'
                      size='xs'
                      variant='outline'
                    >
                      <ChatNotification className={'mr-1'} imgClass={'!w-4 !min-w-4'} />
                      <div className='chat-btn-text font-medium leading-[normal] text-left text-sm focus:outline-none'>
                        Have a question
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </footer>
        <div className='mobile-arrow'>
          {/* {mobileWidth && !showRoute && (
            <div id='basic-button-Menu' onClick={handlePagesRefClick} className='mt-2'>
              <svg
                className={`rotate-[180deg] transition-[rotate] duration-[500ms] w-[25px] h-[25px] ease-in-out ${
                  openMenu ? 'rotate-[0deg]' : ''
                } !text-white-A700`}
                width='28'
                height='28'
                viewBox='0 0 28 28'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect x='0.5' y='0.5' width='27' height='27' rx='13.5' stroke='#BFBFBF' />
                <path
                  d='M19.8537 11.6458C20.0493 11.8407 20.0499 12.1573 19.855 12.3529L14.39 17.8374C14.1751 18.0531 13.8257 18.0531 13.6108 17.8374L8.14582 12.3529C7.9509 12.1573 7.95147 11.8407 8.14708 11.6458C8.34269 11.4509 8.65927 11.4515 8.85418 11.6471L14.0004 16.8117L19.1466 11.6471C19.3415 11.4515 19.6581 11.4509 19.8537 11.6458Z'
                  fill='#BFBFBF'
                />
              </svg>
            </div>
          )} */}
          <div
            id='FooterLinks'
            ref={pagesRef}
            className={`footer-pages-wrap cursor-pointer !translate-y-[calc(0%-30px)] sm:hidden border !border-[#737373] !rounded-[8px] translate-[height] ease-in-out duration-[300ms]  !h-[174px]  !w-[145px] !backdrop-blur-[47px] !bg-[rgba(20,20,20,0.35)] hide-chat`}
          >
            <div className='!h-full sm:hidden'>
              <div
                // onClick={handleMenuClose}
                className='flex justify-end w-full px-4 !pr-[6px]'
              >
                <ExpandMore
                  onClick={handlePagesRefClick}
                  className='text-white-A700 !text-[20px] ml-auto'
                />
              </div>
              <div>
                {/* Tab */}
                <ul className='gap-[24px] flex flex-col'>
                  {/* <li className='text-center footer-txt'>
                    <Link to='/media'>Media/Press</Link>
                  </li> */}
                  {isDesktopFooterValidRoute(careersLocationIds) && (
                    <li className='text-center footer-txt'>
                      <Link to='/careers'>Careers</Link>
                    </li>
                  )}
                  {/* <li className='text-center footer-txt'>
                    <Link to='/investors'>Investors</Link>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {!showRoute && (
          <>
            <footer className='h-[40px] hidden  sm:block backdrop-blur-[17.5px] bottom-0 sm:bg-inherit bg-[rgba(20,20,20,0.25)]  md:h-auto items-center justify-between mt-[-8px] mx-auto px-16 md:px-5 w-full z-[1]'>
              <div className='flex flex-row items-center justify-between w-full sm:flex-col-reverse sm:inline-block md:gap-10'>
                <div className='flex sm:flex-1 flex-col items-start justify-center w-auto sm:w-full px-3'>
                  <div className='flex flex-row items-center justify-center w-auto gap-6 sm:text-center sm:hidden sm:flex-row-reverse sm:w-full my-3'>
                    <Text className='flex w-auto text-sm text-[#ffffff55] text-center sm:hidden'>
                      ©2023 Black Jet Mobility Pty Ltd
                    </Text>
                    {/* <Link
                      to='/media'
                      className='w-auto text-sm text-[#ffffff55] text-center sm:flex sm:justify-center pb-3 sm:w-1/2'
                    >
                      <Text className='sm:text-center'>Media/Press</Text>
                    </Link> */}
                    {/* <Link to="/investors">
                      <Text className="w-auto text-sm text-[#ffffff55] text-center border-b pb-3 border-solid border-[#ffffff41] sm:text-center sm:w-1/2">
                        Investors
                      </Text>
                    </Link> */}
                    {isDesktopFooterValidRoute(careersLocationIds) && (
                      <Text className='w-auto text-sm text-[#ffffff55] sm:text-center sm:w-1/2 pb-3'>
                        <Link to='/careers'>Careers</Link>
                      </Text>
                    )}
                  </div>

                  {/* Mobile Footer */}
                  <div className='footer-mobile-wrap flex flex-row items-center justify-center w-auto gap-6 sm:text-center sm:flex-row-reverse sm:w-full'>
                    <Text className='flex w-auto text-sm text-gray-400 sm:hidden'>
                      ©2023 Black Jet Mobility Pty Ltd
                    </Text>
                    <div
                      href='/'
                      className='w-auto text-sm text-[#ffffff55] privacy-footer  sm:flex sm:justify-end sm:w-1/2'
                    >
                      <Link to={'/legal?type=Privacy Policy'} className='option-text'>
                        <Text className='sm:text-center whitespace-nowrap'>Privacy Policy</Text>
                      </Link>
                    </div>

                    <Link to={'/legal?type=Terms of use'} className='option-text'>
                      <Text className='w-auto text-sm text-[#ffffff55] privacy-footer sm:text-center sm:w-1/2'>
                        Terms of Use
                      </Text>
                    </Link>
                  </div>
                  <Text className='hidden w-auto text-sm text-[#ffffff55] mobility sm:my-[30px] mb-2 sm:justify-center sm:flex sm:w-full sm:text-center'>
                    ©2023 Black Jet Mobility Pty Ltd
                  </Text>
                  <Text className='sm:w-full  w-full subheading-footer sm:!text-center mb-20'>
                    {reserveText}
                    {/* Mobile */}
                  </Text>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
      <div
        className={`tab-footer-wrap ${location.pathname === '/' ? 'home-no-blur' : ''}`}
        ref={footerRef}
      >
        <ul>
          <li onClick={() => navigate('/')}>
            <img
              src={
                location.pathname === '/' ? '/images/home-user.svg' : '/images/home_inactive.svg'
              }
              alt=''
            />{' '}
          </li>
          <li onClick={() => navigate('/booking')}>
            <img
              src={
                location.pathname === '/booking'
                  ? '/images/booking_active.svg'
                  : '/images/ticket-icon.svg'
              }
              alt=''
            />{' '}
          </li>
          <li onClick={() => navigate('/profile')}>
            <img
              src={
                location.pathname === '/profile'
                  ? '/images/profile_active.svg'
                  : '/images/footer-user.svg'
              }
              alt=''
            />{' '}
          </li>
        </ul>
      </div>
    </>
  );
};

export default memo(Footer);
