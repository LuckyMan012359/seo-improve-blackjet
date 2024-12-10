// import 'swiper/css';
import PhoneRecognized from 'components/onboarding/PhoneRecognized';
import OnboardingEmail from 'components/onboarding/OnboardingEmail';
import BasicInfo from 'components/onboarding/BasicInfo';
import MembershipSelection from 'components/onboarding/MembershipSelection';
import PaymentMethod from 'components/onboarding/PaymentMethod';
import PreorderPeriod from 'components/onboarding/PreorderPeriod';
import { useContext, useEffect,  useState } from 'react';
import { useMediaQuery } from '@mui/material';
import EmailToPhone from 'components/onboarding/EmailToPhone';
import OnboardingContext from 'context/OnboardingContext';
import OtpScreen from './OtpScreen';
import {  useNavigate } from 'react-router-dom';
import Landscape from './Landscape';

import { CURRENT_INDEX, LAST_INDEX } from 'constants/actions';
import FramerMotion from 'components/animations/FramerMotion';
import { ROUTE_LIST } from 'routes/routeList';

const PhoneOnboarding = () => {
  const orientation = useMediaQuery('(orientation: portrait)');

  const navigate = useNavigate();

  // const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMediaQuery('(max-width : 699px)');
  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);
  const [isAlready, setIsAlready] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [commonOnboarded, setCommonOnboarded] = useState(false);
  const [device, setDevice] = useState('');

  const [showCross, setCross] = useState(false);
 
  const [fromWhereData, setFromWhereData] = useState(null);
  const lastInd = onboardingForms.lastInd;
  const currentIndex = onboardingForms.currentIndex;

  useEffect(() => {
    if (!isMobile) {
      navigate(ROUTE_LIST.SMART_FIELD);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const goTo = (index) => {
    // if (swiperRef.current) {
    // swiperRef.current.slideTo(index)
    if (currentIndex !== 1 && currentIndex !== 3) {
      // setLastInd((lastInd) => [...lastInd, currentIndex]);
      dispatchOnboardingForms({ type: LAST_INDEX, payload: [...lastInd, currentIndex] });
    }
    // setCurrentIndex(index);
    dispatchOnboardingForms({ type: CURRENT_INDEX, payload: index });
    // }
  };
  

  const handleBack = () => {
    // if (currentIndex === 4) {
    //     const last = localStorage.getItem("last") || "0"
    //     goTo(Number(last))
    // } else {
    //     goTo(currentIndex - 1)
    // }
    if (lastInd.length > 0) {
      // setIsBack(true);
      const gotoIndex = lastInd[lastInd.length - 1];
      // swiperRef.current.slideTo(gotoIndex)
      // setCurrentIndex(gotoIndex);
      dispatchOnboardingForms({ type: CURRENT_INDEX, payload: gotoIndex });

      const last = [...lastInd];
      last.pop();
      // setLastInd(last);
      dispatchOnboardingForms({ type: LAST_INDEX, payload: last });
      // setTimeout(() => {
      //   setIsBack(false);
      // }, 1000);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
 

    if (window.history.length > 2) {
      // Check for at least two entries (SPA + initial visit)
      navigate(-1);
    } else {
      navigate('/');
    }
    return;

 
  };

  const Components = [
    {
      component: (
        <PhoneRecognized
          setDevice={setDevice}
          goTo={goTo}
        
          isPreOrder={onboardingForms?.isPreOrder}
          isMobile={isMobile}
          setIsAlready={setIsAlready}
          isAlready={isAlready}
          setCommonOnboarded={setCommonOnboarded}
          setFromWhereData={setFromWhereData}
        />
      ),
    },
    {
      component: (
        <OtpScreen
          currentIndex={currentIndex}
          device={device}
          goTo={goTo}
         
          isPreOrder={onboardingForms?.isPreOrder}
          isMobile={isMobile}
          setIsAlready={setIsAlready}
          onboarded={commonOnboarded}
          fromWhereData={fromWhereData}
          
        />
      ),
    },
    {
      component: (
        <EmailToPhone
          setDevice={setDevice}
          goTo={goTo}
          
          isPreOrder={onboardingForms?.isPreOrder}
          isMobile={isMobile}
          setIsAlready={setIsAlready}
          setCommonOnboarded={setCommonOnboarded}
        />
      ),
    },
    {
      component: (
        <OtpScreen
          currentIndex={currentIndex}
          device={device}
          goTo={goTo}
         
          isPreOrder={onboardingForms?.isPreOrder}
          isMobile={isMobile}
          setIsAlready={setIsAlready}
          onboarded={commonOnboarded}
          fromWhereData={fromWhereData}
        />
      ),
    },
    {
      component: (
        <OnboardingEmail
          goTo={goTo}
          
          isPreOrder={onboardingForms?.isPreOrder}
          isMobile={isMobile}
          setIsAlready={setIsAlready}
          setFromWhereData={setFromWhereData}
          setDevice={setDevice}
        />
      ),
    },
    {
      component: (
        <BasicInfo
          currentIndex={currentIndex}
          goTo={goTo}
          
          isPreOrder={onboardingForms?.isPreOrder}
          isMobile={isMobile}
        />
      ),
    },
    {
      component: (
        <MembershipSelection
          goTo={goTo}
      
          isPreOrder={onboardingForms?.isPreOrder}
          isMobile={isMobile}
          setRegistered={setRegistered}
        />
      ),
    },
    {
      component: (
        <PaymentMethod
          currentIndex={currentIndex}
          goTo={goTo}
        
          isPreOrder={onboardingForms?.isPreOrder}
          isMobile={isMobile}
        />
      ),
    },
    {
      component: (
        <PreorderPeriod
          goTo={goTo}
         
          isPreOrder={onboardingForms?.isPreOrder}
          isMobile={isMobile}
          isAlready={isAlready}
          registered={registered}
          currentIndex={currentIndex}
          setCross={setCross}
        />
      ),
    },
  ];

  if (!orientation) {
    return <Landscape />;
  }

  return (
    <FramerMotion key={currentIndex}>
      <div id='phone-onboarding-container' className='phone-onboarding open'>
        <div className='mobile-header-wrap w-full h-[60px]'>
          {(currentIndex === 0 || showCross) && (
            <>
              <img
                className='close-btn cursor-pointer'
                src='images/close-icon-white.svg'
                alt=''
                onClick={handleClose}
              />
            </>
          )}
          {currentIndex > 0 && !showCross && (
            <img
              className='close-btn cursor-pointer'
              src='images/back.svg'
              alt=''
              onClick={handleBack}
            />
          )}
          {currentIndex > 0 && (
            <>
              <div className=' horizontal'>
                <div
                  style={{ width: `${currentIndex * 11 || 11}vw` }}
                  className=' h-[0px] border-2 small-w z-40 absolute border-solid border-[#fffdfd] top-[50px] left-[68px]'
                ></div>
              </div>
            </>
          )}
        </div>
        <div
          className={`slider-wrapper w-full ${
            currentIndex === 1 || currentIndex === 3 ? 'pt-[60px]' : ''
          }`}
        >
          <>{Components[currentIndex].component}</>
        </div>
      </div>
    </FramerMotion>
  );
};

export default PhoneOnboarding;
