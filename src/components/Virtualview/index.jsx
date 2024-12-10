import { Img } from 'components';
import React, { useEffect, useRef, useState } from 'react';
import { panaromaScenes } from 'constants/panaroma';
import { hidePopup, hideSafariTabsSafeArea } from 'helpers';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { useDebounce } from 'Hook/useDebounce';
import { stateOffImg, stateOnImg } from 'assets/images';
import { showMessage } from 'utils/notify';
var viewer = null;

const indMap = {
  0: 'lavatory',
  1: 'front',
  2: 'middle',
  3: 'middle-rear',
  4: 'rear',
};
// let oldPitch = null;
// let oldYaw = null;

/**
 * Virtualview component
 * @param {function} handleButtonClick button click handler
 * @param {boolean} visible whether the component is visible or not
 * @param {function} setVisible setter for visible
 * @param {boolean} bookingVisible whether the booking page is visible or not
 * @returns {React.ReactElement} Virtualview component
 */
const Virtualview = ({ handleButtonClick, visible, setVisible, bookingVisible = false }) => {
  const [renderCount, setRenderCount] = useState(0);
  const [imageURLInd, setImageURLInd] = useState(2);
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:699px)');
  const isTab = useMediaQuery('(max-width:1049px)');
  const isPage = location?.pathname?.indexOf('virtual-view') > -1 ? true : false;
  const isBooking = location?.pathname?.indexOf('booking') > -1 ? true : false;
  const [gyroPermission, setGyroPermission] = useState(false);

  const debouncedValue = useDebounce(renderCount, 1000);

  const ref = useRef(null);

  useEffect(() => {
    if (isPage) {
      hideSafariTabsSafeArea();
    }

    if (bookingVisible) {
      hidePopup();
    }
    if (window.pannellum && ref.current) {
      handleImageChange();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, visible, bookingVisible]);

  useEffect(() => {
    // handleImageChange()
    changeScene();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageURLInd, isPage]);

  /**
   * Handles the change of the image in the virtual view component.
   * It will destroy the current viewer and create a new one with the new image.
   * @function
   */
  const handleImageChange = () => {
    if (ref.current) {
      if (window.pannellum && viewer) {
        viewer.destroy();
      }
      viewer = window.pannellum.viewer(ref.current, {
        default: {
          firstScene: indMap[imageURLInd],
          autoRotate: 1,
          autoLoad: true,
          sceneFadeDuration: 2000,
          autoRotateInactivityDelay: 30000,
          showZoomCtrl: false,
          keyboardZoom: false,
          mouseZoom: false,
          disableKeyboardCtrl: true,
          showFullscreenCtrl: false,
          showControls: false,
          hfov: isMobile ? 50 : isTab ? 75 : 100,
          minHfov: 50,
          maxHfov: isMobile ? 50 : 120,
          orientationOnByDefault: bookingVisible,
          startOrientation: bookingVisible,
          // destroy: !bookingVisible,
          // "hotSpotDebug":true
        },
        scenes: panaromaScenes(setImageURLInd),
        destroy: !bookingVisible,
      });

      // stopOrientation()
    }
  };


  useEffect(() => {
    if (viewer?.isOrientationActive()) {
      setGyroPermission(viewer?.isOrientationActive());
    }
    if (location?.pathname === '/booking') {
      _startOrientation();
    }
  }, [debouncedValue, location?.pathname, isMobile]);

  /**
   * Starts the orientation of the panorama viewer, if supported by the device.
   * The gyro permission is also set to true.
   */
  const _startOrientation = () => {
    if (viewer && viewer?.isOrientationSupported()) {
      viewer.startOrientation();
      setGyroPermission(true);
    }
  };

  /**
   * Stops the orientation of the panorama viewer, if active.
   * Also sets the gyro permission to false.
   */
  const stopOrientation = () => {
    if (viewer && viewer?.isOrientationActive()) {
      setGyroPermission(false);
      viewer.stopOrientation();
    }
  };

  /**
   * Changes the scene of the panorama viewer to the scene specified by the current image index.
   * If the scene is front or rear, a deviation of 180 degrees is added to the yaw if the image index is 2 or 4.
   * If the scene is middle, a deviation of 180 degrees is added to the yaw if the image index is 1.
   * The loadScene method is called with the new scene and yaw values, and the new pitch value.
   */
  const changeScene = () => {
    if (viewer) {
      try {
        const newYaw = viewer.getYaw();
        const newPitch = viewer.getPitch();
        const scene = viewer.getScene();
        let deviation = 0;
        if (scene === 'front') {
          deviation = imageURLInd === 4 || imageURLInd === 2 ? 180 : 0;
        } else if (scene === 'rear') {
          deviation = imageURLInd === 1 ? 180 : 0;
        } else if (scene === 'middle') {
          deviation = imageURLInd === 1 ? 180 : 0;
        }
        viewer.loadScene(indMap[imageURLInd], newPitch, newYaw + deviation);
        // viewer.setNorthOffset(northOffset)
      } catch (err) {
        console.log(err);
      }
    }
  };

  // const clickNext = () => {
  //   const allowed = { 0: 1, 1: 2, 2: 4 };
  //   setImageURLInd((index) => (allowed[index] ? allowed[index] : index));
  // };

  // const clickPrev = () => {
  //   const allowed = { 1: 0, 2: 1, 4: 2 };
  //   setImageURLInd((index) => (allowed[index] || index === 1 ? allowed[index] : index));
  // };
  const handleTouchStart = (event) => {
    // setGyroPermission(false);
    setRenderCount((prev) => prev + 1);
  };
  /**
   * Handles the click event on the panorama viewer.
   * If the device supports the Device Orientation API, it requests permission for the API.
   * If the permission is granted, it starts the orientation of the panorama viewer and sets the gyro permission to true.
   * If the permission is not granted, it does not start the orientation of the panorama viewer.
   * If the device does not support the Device Orientation API, it starts the orientation of the panorama viewer and sets the gyro permission to true.
   */
  const onClick = async () => {
    // feature detect
    // setGyroPermission(true);

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            _startOrientation();
            setGyroPermission(true);
            handleShowMessage();
          }
        })
        .catch(console.error);
    } else {
      // other browsers
      _startOrientation();
      setGyroPermission(true);
      handleShowMessage();
    }
  };

/**
 * Shows a message to the user, informing them to point their phone
 * towards the desired direction and tap the arrows to advance forward.
 * The message is displayed for 10 seconds.
 */
  const handleShowMessage = () => {
    showMessage(
      <>Point your phone towards the desired direction. Tap arrows to advance forward</>,
      '14px',
      10 * 1000, // 10 seconds
    );
  };

  const srcSet = isMobile
    ? [
        {
          media: '(max-width: 699px)',
          srcSet: `images/tour-mobile-cross-simple.svg 699w`,
          sizes: '699px',
        },
      ]
    : [
        {
          media: '(max-width: 699px)',
          srcSet: `images/tour-mobile-cross.svg 699w`,
          sizes: '699px',
        },
        {
          media: '(max-width: 1049px)',
          srcSet: `images/tour-tab-cross.svg 1049w`,
          sizes: '1049px',
        },
        {
          media: '(max-width: 1799px)',
          srcSet: `images/tour-desktop-cross.svg 1799w`,
          sizes: '1799px',
        },
        {
          srcSet: `images/tour-large-cross.svg 2560w`,
          sizes: '2560px',
        },
      ];

  return (
    <div
      className={`relative ${!isPage && !isBooking ? 'mt-[70px]' : ''} h-screen airplane-panorama`}
    >
      {!isPage && (
        <Img
          src={'/images/Close.svg'}
          alt='Close'
          onClick={handleButtonClick}
          className={`close-img-icon absolute rounded-full top-14 cursor-pointer left-8 z-[100] ${
            isMobile ? 'close-img-icon-mobile' : ''
          }`}
          srcSet={srcSet}
        />
      )}
      {/* <iframe
        ref={ref}
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
        src="https://raz.ro/temp/v5/" // Replace with the correct path to your index.html file
        title="VirtualRoute"
        style={iframeStyle}

      /> */}
      <ul className='options'>
        <li onClick={() => setImageURLInd(0)}>Lavatory</li>
        <li onClick={() => setImageURLInd(1)}>Front</li>
        <li onClick={() => setImageURLInd(2)}>Middle</li>
        {/* <li onClick={() => setImageURLInd(3)}>Mid-Rear</li> */}
        <li onClick={() => setImageURLInd(4)}>Rear</li>
      </ul>
      {(visible || isPage) && (
        <div>
          {isMobile && (
            <div role='button'>
              {gyroPermission ? (
                <img
                  onClick={() => stopOrientation()}
                  className={`virtual-viw-orientation-icon ${!isPage && 'virtual-view-not-page'}`}
                  src={stateOnImg}
                  alt='on'
                />
              ) : (
                <img
                  className={`virtual-viw-orientation-icon ${!isPage && 'virtual-view-not-page'}`}
                  onClick={() => onClick()}
                  src={stateOffImg}
                  alt='off'
                />
              )}
            </div>
          )}
          <div onTouchEndCapture={handleTouchStart} id='panorama' ref={ref}></div>
        </div>
      )}
    </div>
  );
};

export default Virtualview;
