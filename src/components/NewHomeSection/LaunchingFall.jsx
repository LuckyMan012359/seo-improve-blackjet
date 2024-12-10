import { useMediaQuery } from '@mui/material';
import CardSection from 'components/CardSection';
import { TextSecondary } from 'components/Text';
import OnboardingContext from 'context/OnboardingContext';
import React, { useContext } from 'react';

/**
 * A component that renders a launching soon screen with a countdown timer
 * and a description of the benefits of flying private.
 *
 * @returns {React.ReactElement} The JSX element representing the launching
 * soon screen.
 */
const LaunchingFall = () => {
  const isMobile = useMediaQuery('(max-width : 699px)');
  const { onboardingForms } = useContext(OnboardingContext);
  const details = onboardingForms?.membershipData;
  return (
    <div>
      <div className='launching-div'>
        <div className=' launching-inner'>
          <div className='launching-txt'>
            {details?.preOrder && (
              <>
                {isMobile ? (
                  <h1>Launching Spring 2025</h1>
                ) : (
                  <h1>
                    Launching <br />
                    Spring 2025
                  </h1>
                )}
                <h2 className={`${isMobile ? '' : 'whitespace-nowrap'}`}>
                  Flying private
                  <span> is now a </span>smart financial<br></br> decision
                </h2>
              </>
            )}
            {!details?.preOrder && (
              <h2 className={`${isMobile ? '' : 'whitespace-nowrap'}`}>
                Flying private <TextSecondary> is now a </TextSecondary>
                smart <br /> financial decision
              </h2>
            )}
          </div>
          <div className='col-md-6 card-section-wrapper'>
            <CardSection button={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchingFall;
