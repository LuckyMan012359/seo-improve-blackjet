import { useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DesktopAnimation from './DesktopAnimation';
import LargerScreenAnimation from './LargeScreenAnimation';
import TabAnimation from './TabAnimation';
import MobileAnimation from './MobileAnimation';

const ids = {
  MOBILE_MAP_ANIMATION: 'mobile-map-animation',
  TAB_MAP_ANIMATION: 'tab-map-animation',
  DESKTOP_MAP_ANIMATION: 'desktop-map-animation',
  LARGE_MAP_ANIMATION: 'large-map-animation',
};

const MapAnimation = (props) => {
  const desktop = useMediaQuery('(max-width : 1799px)');
  const isMobile = useMediaQuery('(max-width : 700px)');

  //When coming from route mean /flyfreely
  const mobile = props?.isRoute || isMobile;
  const tab = useMediaQuery('(max-width : 1049px)');
  const [animateClass, setAnimateClass] = useState('');
  const [isAnimationPlay, setIsAnimationPlay] = useState(false);

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (animateClass) {
      const id = mobile
        ? ids.MOBILE_MAP_ANIMATION
        : tab
        ? ids.TAB_MAP_ANIMATION
        : desktop
        ? ids.DESKTOP_MAP_ANIMATION
        : ids.LARGE_MAP_ANIMATION;
      const mapAnimation = document.getElementById(id);
      let timeoutId;
      // Play animation after 35 seconds
      if (isAnimationPlay) {
        timeoutId = setTimeout(() => {
          if (mapAnimation) {
            setTimer(timer + 1);
          }
        }, 35000);
      }
      // Clean up the timeout on component unmount
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animateClass, timer]);

  useEffect(() => {
    const map = document.getElementById(checkScreen());
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAnimationPlay(entry.isIntersecting);
        if (entry.isIntersecting && !animateClass) {
          setAnimateClass('animate');
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // Change this threshold as per your requirement
      },
    );

    if (map) {
      observer.observe(map);
    }

    return () => {
      if (map) {
        observer.unobserve(map);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * This function determines which SVG element to animate based on the
   * current screen size.
   *
   * @returns {string} The id of the SVG element to animate.
   */
  const checkScreen = () => {
    if (mobile) {
      return ids.MOBILE_MAP_ANIMATION;
    } else if (tab) {
      return ids.TAB_MAP_ANIMATION;
    } else if (desktop) {
      return ids.DESKTOP_MAP_ANIMATION;
    } else {
      return ids.LARGE_MAP_ANIMATION;
    }
  };
  const style = {
    animationPlayState: isAnimationPlay ? 'running' : 'paused',
  };

  if (mobile) {
    return (
      <MobileAnimation
        style={style}
        animateClass={animateClass}
        timer={timer}
        id={ids.MOBILE_MAP_ANIMATION}
      />
    );
  } else if (tab) {
    return (
      <TabAnimation
        style={style}
        animateClass={animateClass}
        timer={timer}
        id={ids.TAB_MAP_ANIMATION}
      />
    );
  } else if (desktop) {
    return (
      <DesktopAnimation
        style={style}
        animateClass={animateClass}
        timer={timer}
        id={ids.DESKTOP_MAP_ANIMATION}
      />
    );
  } else {
    return (
      <LargerScreenAnimation
        animateClass={animateClass}
        timer={timer}
        id={ids.LARGE_MAP_ANIMATION}
        style={style}
      />
    );
  }
};

export default MapAnimation;
