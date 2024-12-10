import './profilemenu.css';
import React, { memo, useEffect, useRef } from 'react';
import { useState } from 'react';
import useOutsideClick from '../../Hook/useOutsideClick';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Img } from 'components';
import { useMediaQuery } from '@mui/material';
import { handleFooterNavbar } from 'helpers';
import CommonButton from 'components/formcomponents/CommonButton';
import { useBlackJetContext } from 'context/OnboardingContext';
import { CHANGE_PREORDER_STATUS } from 'constants/actions';

import ReactDOM from 'react-dom';
import { ROUTE_LIST } from 'routes/routeList';
import { isDesktopOnlyValidRoute } from 'utils';
const ProfileMenu = () => {
  const [isGrowAnimation, setIsGrowAnimation] = useState(false);
  const location = useLocation();
  const path = location.pathname || '/';
  const ref = useRef(null);
  const isMobile = useMediaQuery('(max-width:699px)');
  const navigate = useNavigate();
  const { onboardingForms, dispatchOnboardingForms } = useBlackJetContext();
  const details = onboardingForms?.membershipData;

  
  const [isOpen, setIsOpen] = useState(false);





  useOutsideClick('MenuContainer', (e) => {
    // console.log('it_should_be_not_clicked')
    if (isGrowAnimation) {
      setIsOpen(false);
      const container = ref.current;
      if (container?.classList?.contains('grow-animation')) {
        container?.classList?.add('collapse-animation');
        container?.classList?.remove('grow-animation');
        setIsGrowAnimation(false);
      }
    }
  });

  const toggleGrowthAnimation = (e) => {
    // e.stopPropagation();
    // e.preventDefault();

    // setIsGrowAnimation(isGrowAnimation === "grow" ? "shrink" : "grow");
    if (ref.current) {
      const container = ref.current;
      setIsGrowAnimation((pre) => {
        if (pre) {
          container.classList.add('collapse-animation');
          container.classList.remove('grow-animation');
          // setIsGrowAnimation(false);
        } else {
          container.classList.remove('collapse-animation');
          container.classList.add('grow-animation');
          // setIsGrowAnimation(true);
        }
        return !pre;
      });
    }
  };

  const openFooterNavbar = (e) => {
    if (isMobile) {
      setIsOpen((prevState) => !prevState);
    }
  };



  useEffect(() => {
    handleFooterNavbar(isOpen);
    return () => {
      // Ensure that the overlay is closed when the component unmounts
      handleFooterNavbar(false);
    };
  }, [isOpen]);

  // useMemo(() => {
  //   // Close the overlay whenever the location changes
  //   setIsOpen(false);
  // }, [location]);

  return (
    <div>
      <div ref={ref} id='MenuContainer' className={`demo`} onClick={openFooterNavbar} role='button'>
        {ReactDOM.createPortal(<Overlay isOverlayOpen={isOpen} />, document.getElementById('root'))}
        <Img
          onClick={toggleGrowthAnimation}
          className={`img1 toggle-container `}
          src={`${!isGrowAnimation ? '/images/Menu.svg' : '/images/menuCross.svg'}`}
          alt='burger-menu'
        />
        <Img
          className={`img2 toggle-container `}
          src={`/images/img_navigation.svg`}
          alt='burger-menu'
        />
        <div className='menu-popup-large'>
          <div className='inner-popup' onClick={toggleGrowthAnimation}>
            <ProfileLinks />
            {/* {path !== '/' && (
              <Link to='/' className='option-text'>
                Home
              </Link>
            )}
            {path !== ROUTE_LIST.CONTACT_US && (
              <Link to={ROUTE_LIST.CONTACT_US} className='option-text'>
                Contact us
              </Link>
            )}
            {path !== ROUTE_LIST.ABOUT_US && (
              <Link to={ROUTE_LIST.ABOUT_US} className='option-text'>
                About us
              </Link>
            )}
            {path !== ROUTE_LIST.LEGAL && (
              <Link to={ROUTE_LIST.LEGAL} className='option-text'>
                Legal
              </Link>
            )}
            {path !== ROUTE_LIST.FAQ && (
              <Link to={ROUTE_LIST.FAQ} className='option-text'>
                FAQs
              </Link>
            )} */}
            {path?.indexOf(ROUTE_LIST.SMART_FIELD) === -1 && (
              <CommonButton
                className='!block'
                onClick={() => {
                  if (isMobile) {
                    // toggleDrawer()
                    navigate(ROUTE_LIST.PHONE_ONBOARDING);
                  } else {
                    navigate(`${ROUTE_LIST.SMART_FIELD}?type=pre-order`);
                  }
                  dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: true });
                }}
                text={!details?.preOrder ? 'Become a member' : 'Pre-order now'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Overlay = ({ isOverlayOpen }) => {
  return <div className={`overlay ${isOverlayOpen ? 'overlay-show' : 'overlay-hide'}`}></div>;
};

const ProfileLinks = () => {
  const { onboardingForms } = useBlackJetContext();
  const {
    aboutUsLocationIds = [],
    // careersLocationIds = [],
    contactUsLocationIds = [],
    faqsLocationIds = [],
    // investorsLocationIds = [],
    legalLocationIds = [],
    // mediaPressLocationIds = [],
    // newsLocationIds = [],
  } = onboardingForms?.savedLocation || {};

  const location = useLocation();
  const path = location.pathname || '/';
  const navLinks = [
    {
      name: 'Home',
      path: ROUTE_LIST.HOME,
      allowRoute: true,
    },
    {
      name: 'Contact us',
      path: ROUTE_LIST.CONTACT_US,
      allowRoute: isDesktopOnlyValidRoute(contactUsLocationIds),
    },
    {
      name: 'About us',
      path: ROUTE_LIST.ABOUT_US,
      allowRoute: isDesktopOnlyValidRoute(aboutUsLocationIds),
    },
    {
      name: 'Legal',
      path: ROUTE_LIST.LEGAL,
      allowRoute: isDesktopOnlyValidRoute(legalLocationIds),
    },
    {
      name: 'FAQs',
      path: ROUTE_LIST.FAQ,
      allowRoute: isDesktopOnlyValidRoute(faqsLocationIds),
    },
  ];
  return (
    <>
      {navLinks.map((item) => {
        return (
          item.allowRoute && (
            <>
              {path !== item.path && (
                <Link to={item.path} className='option-text'>
                  {item.name}
                </Link>
              )}
            </>
          )
        );
      })}
    </>
  );
};

export default memo(ProfileMenu);
