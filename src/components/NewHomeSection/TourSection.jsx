import { tour } from 'assets';
import { Text } from 'components';
import Virtualview from 'components/Virtualview';
import React, { useState } from 'react';
// import { useDetectClickOutside } from 'react-detect-click-outside';


/**
 * @function TourSection
 * @description Component for Tour Section
 * @returns {jsx} A JSX element
 * @example
 * <TourSection />
 */
const TourSection = () => {
  const [visible, setVisible] = useState(false);
  // const ref = useDetectClickOutside({ onTriggered: closePopup });
  // const [mouseDown, setMouseDown] = useState(false);

  const [isVirtualviewVisible, setVirtualviewVisible] = useState(false);

  /**
   * @function closePopup
   * @description Close the virtual view and tour section if the virtual view is visible and the mouse is not down.
   * @param {object} e - The event object
   * @example
   * <TourSection />
   */
  // function closePopup(e) {
  //   if (isVirtualviewVisible && !mouseDown) {
  //     setVirtualviewVisible(false);
  //     setVisible(false);
  //   }
  //   setMouseDown(false);
  // }
  /**
   * @function handleButtonClick
   * @description Toggle the visibility of the virtual view and the tour section, and scroll to the corresponding container.
   * @example
   * <TourSection />
   */
  const handleButtonClick = () => {
    setVisible(!visible);
    var element = document.getElementById(
      isVirtualviewVisible ? 'buttonContainer' : 'frameConatiner',
    );

    if (element) {
      setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 500);
    }
    setVirtualviewVisible(!isVirtualviewVisible);
  };

  return (
    <div>
      <div id='buttonContainer' className='tour-section-main'>
        <div className='tour-txt-div' orientation='horizontal'>
          <div className='text-section sm:border-b-2 sm:border-[#333]'>
            <h1>What you fly in</h1>
            <div className='list-wrap'>
              <div className='list-div '>
                <img src='/images/img_upload.svg' alt='upload' />
                <p>
                  Elevate <span> your </span> flying experience
                  <span> in our</span> luxurious 8-seat cabin,
                  <span> a masterful creation brought to life by the design maestros at </span> BMW
                  Designworks
                </p>
              </div>
              <div className='list-div '>
                <img src='/images/img_upload.svg' alt='upload_One' />
                <p>
                  <span> Thanks to the</span> fuel-efficient design
                  <span> of the turbine-driven propeller, flying on our aircraft</span> consumes
                  less fuel <span>than if you were to</span> drive the route,
                  <span> reducing your carbon footprint</span>
                </p>
              </div>
              <div className='list-div '>
                <img src='/images/img_upload.svg' alt='upload_Two' />
                <p>
                  <span>
                    While the flight duration is, on average, a mere 20 minutes longer than that of
                    public air transport,
                  </span>{' '}
                  our private terminals <span> ensure you </span>
                  save a<span> total of</span> 120 minutes <span>on each round trip</span>
                </p>
              </div>
            </div>
          </div>
          <div className='text-section'>
            <h1>Proven safety record</h1>
            <div className='list-wrap'>
              <div className='list-div '>
                <img src='/images/img_upload.svg' alt='upload' />
                <p>
                  <span> With </span> safe operation <span>of over</span> seven million flight hours
                  <span> and 1,700 aircrafts, the aircraft </span> touts a safety record{' '}
                  <span> on par with </span> twin-engine jets
                </p>
              </div>
              <div className='list-div '>
                <img src='/images/img_upload.svg' alt='upload_One' />
                <p>
                  Powered by a jet engine,
                  <span> the turbine-driven propeller combines </span>
                  jet reliability <span> with </span> propeller fuel efficiency
                </p>
              </div>
              <div className='list-div '>
                <img src='/images/img_upload.svg' alt='upload_Two' />
                <p>
                  <span>
                    Even though our aircraft is designed for a single pilot, our policy is to
                    operate with{' '}
                  </span>
                  two pilots <span>for</span> all flights, <span> ensuring an </span> apex of safety
                  and redundancy <span>when you fly</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div id='frameConatiner' className='w-screen'>
          <div
            className={`overflow-hidden h-0 transition-[height] duration-[1000ms] ease-in-out ${
              isVirtualviewVisible ? '!h-screen' : ''
            }`}
            // ref={ref}
            // onMouseDown={() => setMouseDown(true)}
            // onMouseLeave={()=>setMouseDown(false)}
            // onMouseUp={() => setMouseDown(false)}
          >
            <Virtualview
              visible={visible}
              setVisible={setVisible}
              handleButtonClick={handleButtonClick}
            />
          </div>
        </div>
        <div className='relative w-full tour-banner-container'>
          <img
            className='tour-banner desktop-img opacity-80 h-full mx-auto object-cover rounded-[1px] w-full md:w-full'
            alt='airplane-image'
            src={tour}
          />
          <div
            onClick={handleButtonClick}
            className={`${
              isVirtualviewVisible ? 'hidden' : ''
            } absolute cursor-pointer sm:hidden rounded-full bg-[#141414] top-[calc(0%-60px)] bg-black left-[calc(50%-60px)] md:h-[118px] h-[120px] right-[0] w-[120px]`}
          >
            <div className='absolute bg-white-A700 h-[88px] inset-[0] justify-center m-auto rounded-[50%] w-[88px]'></div>
            <div className='absolute border border-solid border-white-A700 flex flex-col h-full inset-[0] items-center justify-center m-auto p-6 sm:px-5 rounded-[50%] w-[120px]'>
              <Text
                className='tour-button my-4 4k:!font-bold 4k:!text-[14px] 4k:font-hauora text-center text-sm w-[99%] sm:w-full'
                size='txtHauoraBold14'
              >
                Tour the plane
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourSection;
