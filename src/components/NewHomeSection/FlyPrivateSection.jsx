import { useMediaQuery } from '@mui/material';
import { flightChair } from 'assets';
import { Img } from 'components';
import { TextAccent } from 'components/Text';
import React from 'react';
import { Parallax } from 'react-scroll-parallax';

/**
 * Component for the "New Way to Fly Private" section of the home page.
 *
 * This component renders a section that displays a picture of a plane on the
 * left and a list of features on the right. The features are displayed in a
 * parallax effect, with the text and images moving at different speeds as the
 * user scrolls.
 *
 * The component takes no props.
 *
 * @returns {React.ReactElement} The JSX element for the "New Way to Fly Private"
 * section.
 */
const FlyPrivateSection = () => {
  const isMobile = useMediaQuery('(max-width : 699px)');

  return (
    <div>
      <div className='new-way-main'>
        <div className='new-way-img'>
          <Img
            className='side-img'
            src={flightChair}
            alt='picture'
          />
          {!isMobile && (
            <div className='desk-section-div'>
              <div className=' parallax-div'>
                <Parallax speed={20}>
                  <div className='new-way-div '>
                    <div className='new-way-inner'>
                      <Img src='/images/img_icons8infinity.svg' alt='icons8infinity' />
                      <div className='new-way-txt'>
                        <h3 className='new-way-header' size='txtHauoraBold16'>
                          Unlimited Flights
                        </h3>
                        <p size='txtHauoraMedium14WhiteA700'>All-you-can-fly</p>
                      </div>
                    </div>
                  </div>
                  <div className='new-way-div'>
                    <div className='new-way-inner'>
                      <img src='/images/terminal.svg' alt='calendar' />
                      <div className='new-way-txt'>
                        <h3 className='new-way-header' size='txtHauoraBold16'>
                          Private Terminal Lounge
                        </h3>
                        <p size='txtHauoraMedium14WhiteA700'>
                          Arrive 15 minutes <span>before</span> departure
                        </p>
                      </div>
                    </div>
                  </div>
                </Parallax>
              </div>
            </div>
          )}
          {isMobile && (
            <Parallax translateX={['200px', '-100px']}>
              <div className='mobile-section-div'>
                <div className='parallax-div'>
                  <div className='new-way-div h-[96px]'>
                    <div className='new-way-inner'>
                      <img src='/images/img_icons8infinity.svg' alt='icons8infinity' />
                      <div className='new-way-txt'>
                        <h3 className='new-way-header' size='txtHauoraBold16'>
                          Unlimited Flights
                        </h3>
                        <p size='txtHauoraMedium14WhiteA700'>All-you-can-fly</p>
                      </div>
                    </div>
                  </div>
                  <div className='new-way-div h-[124px]'>
                    <div className='new-way-inner'>
                      <img src='/images/terminal.svg' alt='calendar' />
                      <div className='new-way-txt'>
                        <h3 className='new-way-header' size='txtHauoraBold16'>
                          Private Terminal Lounge
                        </h3>
                        <p size='txtHauoraMedium14WhiteA700'>
                          Arrive 15 minutes <span>before</span> departure
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Parallax>
          )}
        </div>
        <div className='new-way-private'>
          <div className='new-txt'>
            {isMobile ? (
              <h1 className='new-way-txt new-way-heading' size='txtHauoraMedium40'>
                New Way to Fly Private
              </h1>
            ) : (
              <>
              <h1 className='new-way-txt new-way-heading' size='txtHauoraMedium40'>
                New Way to 
              </h1>
              <h1 className='new-way-txt new-way-heading' size='txtHauoraMedium40'>
               Fly Private
              </h1>
              </>
            )}
            <h5>
              Unlimited all-you-can-fly
              <h5>
                <span>Starting with at least </span>three weekly round trips
                <span> between </span> Sydney <span>and </span> Melbourne,
                <span> Black Jet will ramp up to offer multiple daily flights.</span>
              </h5>
              <h5>
                {' '}
                <span>
                  Our future plans include <TextAccent>expanding</TextAccent> to{' '}
                  <TextAccent>new destinations</TextAccent>.
                </span>
              </h5>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlyPrivateSection;
