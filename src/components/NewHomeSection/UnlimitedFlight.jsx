import { useMediaQuery } from '@mui/material';
import { TextStrick } from 'components/Text';
import CommonButton from 'components/formcomponents/CommonButton';
import { CHANGE_PREORDER_STATUS } from 'constants/actions';
import OnboardingContext from 'context/OnboardingContext';

import React, { useContext} from 'react';
import { useNavigate } from 'react-router';
import { ROUTE_LIST } from 'routes/routeList';
import { numberWithCommas } from 'utils';

/**
 * A component for the "Unlimited flights" section of the home page.
 * Will only be rendered if the user has not pre-ordered and there is a valid membership data.
 * If the user has pre-ordered, the component will not be rendered.
 * The component displays the discounted price and the original price of the membership.
 * The component also displays the number of memberships left at the discounted price.
 * The component has a call-to-action button to pre-order the membership.
 * If the user is on a mobile device, the component will navigate to the phone onboarding route when the button is clicked.
 * If the user is not on a mobile device, the component will navigate to the smart field route with the pre-order type as a query parameter.
 * @returns {React.ReactElement} The JSX element for the "Unlimited flights" section.
 */
const UnlimitedFlight = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width : 699px)');
  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);
  const details = onboardingForms?.membershipData;
  
  /**
   * Handles the pre-order click event.
   * Dispatches the CHANGE_PREORDER_STATUS action, then navigates to the appropriate
   * route depending on whether the user is on a mobile device or not.
   * If the user is on a mobile device, will navigate to the phone onboarding route.
   * If the user is not on a mobile device, will navigate to the smart field route with the
   * pre-order type as a query parameter.
   */
  const handlePreOrder = () => {
    dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: true });
    if (isMobile) {
      // toggleDrawer()
      navigate(ROUTE_LIST.PHONE_ONBOARDING);
    } else {
      navigate(`${ROUTE_LIST.SMART_FIELD}?type=pre-order`);
    }
  };

  if (!details || details.status === 'inactive') {
    return null;
  }

  return (
    <div className='unlimited-flights-wrap'>
      <div className='unlimited-flights-card'>
        <div className='unlimited-flights'>
          <h2 className='unlimited-heading'>
            Unlimited flights <span>for a</span> fixed monthly price
          </h2>
          <div className='online-price-wrap'>
            <div className='section-border' />
            <div className='online-price-text'>
              {details?.discountPrice && (
                <>
                  {/* Desktop & Tabs */}
                  {details?.usedSeats < 10 && (
                    <p className='only-members mobile-none'>
                      <span className='price-text'>Only</span>
                      <span className='price-text white-text'>{details?.usedSeats}</span>
                      <span className='price-text'>memberships left at this price</span>
                    </p>
                  )}
                  {details?.usedSeats >= 10 && (
                    <p className='only-members mobile-none'>
                      <span className='price-text'>Limited memberships left at this price</span>
                    </p>
                  )}
                </>
              )}
              <div className='discount-price-wrap'>
                <div className='cut-price'>
                  {details?.discountPrice && (
                    <p>
                      <TextStrick>{numberWithCommas(details?.latestPrice)}</TextStrick>
                      {/* <img
                        className='cut-price-img'
                        src='/images/img_vector20.svg'
                        alt='vectorTwenty'
                      /> */}
                    </p>
                  )}
                  {!details?.discountPrice && (
                    <p className='latest-price-without-discount'>
                      {numberWithCommas(details?.latestPrice)} <span className='month'>/mo</span>
                    </p>
                  )}
                </div>
                <div className='original-price'>
                  {details?.discountPrice && (
                    <p>
                      <span>{numberWithCommas(details?.discountPrice)}</span>
                      <span className='qnty-tag'>/mo</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Discount seat */}

              {details?.discountPrice && (
                <>
                  {/* Mobile width 360px */}
                  {details?.usedSeats < 10 && (
                    <p className='only-members mobile-block'>
                      <span className='price-text'>Only</span>
                      <span className='price-text white-text'>{details?.usedSeats}</span>
                      <span className='price-text'>memberships left at this price</span>
                    </p>
                  )}
                  {details?.usedSeats >= 10 && (
                    <p className='only-members mobile-block'>
                      <span className='price-text'>Limited memberships left at this price</span>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <CommonButton
          text={<div> {!details.preOrder ? 'Become a member' : 'Pre-order Now'} </div>}
          className='preorder-btn pre-order-simmer-effect'
          onClick={handlePreOrder}
        />
      </div>
    </div>
  );
};

export default UnlimitedFlight;
