import { useMediaQuery } from '@mui/material';
import HandAnimationPhone from 'components/handAnimation/HandAnimationPhone';
import React, {  } from 'react';
import { Parallax } from 'react-scroll-parallax';


/**
 * PhoneInHand component
 *
 * This component renders a section of the homepage that shows a phone in hand
 * with a sleek and innovative app, and allows the user to book personal flights
 * in seconds.
 *
 * @returns {JSX.Element}
 */
const PhoneInHand = () => {
  const isMobile = useMediaQuery('(max-width : 699px)');
  return (
    // <Suspense fallback={<div>Loading HandAnimation...</div>}>

      <div className='experience-black-wrap'>
        {/* <HandAnimation className="large-ex-screen" /> */}
        <HandAnimationPhone className='large-ex-screen' />

        <div>
          <div className='experience-section'>
            <div className='transform-wrap'>
              <div className='experience-section-left'>
                {isMobile ? (
                  <h2>
                    Experience
                    <br />
                    Black Jet Mobile
                  </h2>
                ) : (
                  <h2>
                    Experience {' '}
                    <br />
                    Black Jet Mobile
                  </h2>
                )}
              </div>
            </div>
            <Parallax className='transform-wrap desktop-phone' speed={20}>
              <div className='experience-section-right '>
                <div className='experience-right-card'>
                  <img className='experience-img' src='/images/sleek.svg' alt='clock' />
                  <div className='experience-text'>
                    <p>Sleek & Innovative App</p>
                    <div className='booking-description'>
                      <h3>
                        <span>Select your </span> seats <span>with a</span> simple drag-and-drop,{' '}
                        <span>all at </span> your fingertips.
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='experience-right-card'>
                  <img className='experience-img' src='/images/img_clock.svg' alt='clock' />
                  <div className='experience-text'>
                    <p>Book Personal Flights in Seconds</p>
                    <div className='booking-description'>
                      <h3>
                        Effortlessly quick, <span>with</span> no more digital detours{' '}
                        <span>across multiple websites</span>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </Parallax>
          </div>
          <div className='experience-section'>
            <Parallax translateX={['200px', '-100px']}>
              <div className='mobile-hand'>
                <div className='experience-section-right '>
                  <div className='experience-right-card'>
                    <img className='experience-img' src='/images/sleek.svg' alt='clock' />
                    <div className='experience-text'>
                      <p>Sleek & Innovative App</p>
                      <div className='booking-description'>
                        <h3>
                          <span>Select your </span> seats <span>with a</span> simple drag-and-drop,{' '}
                          <span>all at </span> your fingertips.
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className='experience-right-card'>
                    <img className='experience-img' src='/images/img_clock.svg' alt='clock' />
                    <div className='experience-text'>
                      <p>Book Personal Flights in Seconds</p>
                      <div className='booking-description'>
                        <h3>
                          Effortlessly quick, <span>with</span> no more digital detours{' '}
                          <span>across multiple websites</span>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Parallax>
          </div>
        </div>

        {/* Tabs--screens */}
      </div>

    // </Suspense>
  );
};

export default PhoneInHand;
