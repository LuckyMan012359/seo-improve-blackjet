import React, { useContext, useEffect } from 'react';
import CardSection from 'components/CardSection';
import { useLocation, useNavigate } from 'react-router-dom';
import ScrollToTopOnMount from 'components/layout/ScrollToTopOnMount';
import FreePreviewCard from 'components/FreePreviexCard';
import useQueryParams from 'Hook/useQueryParams';
import CommonButton from 'components/formcomponents/CommonButton';
import { onboard } from 'api/onboarding';
import OnboardingContext from 'context/OnboardingContext';
import { CHANGE_PREORDER_STATUS } from 'constants/actions';
import { ROUTE_LIST } from 'routes/routeList';

/**
 * Renders the membership selection page, which shows the available plans and allows
 * the user to select one. If the user is on a mobile device, it will render a button
 * to allow the user to continue without purchasing a plan.
 *
 * @param {function} goTo - function to navigate to a specific step
 * @param {boolean} isMobile - whether the user is on mobile
 * @param {boolean} isPreOrder - whether the user is in the pre-order phase
 * @param {function} setRegistered - function to set the registered state
 */

const MembershipSelection = ({ goTo, isMobile, isPreOrder, setRegistered = () => {} }) => {
  const queryParams = useQueryParams();
  const type = queryParams.type || '';
  const navigate = useNavigate();


  const location = useLocation();
  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);
  useEffect(() => {
    if (location.pathname === ROUTE_LIST.REFINED_SELECTION && !onboardingForms?.sessionToken) {
      dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: false });
      navigate(ROUTE_LIST.SMART_FIELD);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  /**
   * Handles the free plan
   * @function
   * @param {boolean} isMobile - whether the user is on mobile
   * @param {string} type - whether the user is in the pre-order phase
   * @param {function} goTo - function to navigate to a specific step
   * @param {function} setRegistered - function to set the registered state
   */
  const handleFree = async () => {
    if (isMobile) {
      let response = await onboard();
      if (response?.data?.status_code === 200) {
        goTo(8);
        setRegistered(true);
      }
    } else if (type !== 'pre-order') {
      navigate(ROUTE_LIST.GRATIAS_TIBI_AGO);
    } else {
      navigate(`${ROUTE_LIST.GRATIAS_TIBI_AGO}?type=pre-order`);
    }
  };
  const heading = location?.state?.heading ? (
    <h2 className='heading-membership-selection'>{location?.state?.heading}</h2>
  ) : (
    <h1 className='choose-txt'>Choose a plan</h1>
  );
  const subHeading = location?.state?.subHeading && (
    <h2 className='sub-heading-membership-selection'>{location.state.subHeading}</h2>
  );

  return (
    <div className='free-card membership-card-login'>
      <ScrollToTopOnMount />
      {!isMobile && (
        <div className='headings-membership-selection'>
          {heading}
          {subHeading}
        </div>
      )}
      <div className='free-card-main'>
        <div className='col-md-6 card-section-wrapper !justify-end'>
          <CardSection
            setRegistered={setRegistered}
            isPreOrder={isPreOrder}
            goTo={goTo}
            isMobile={isMobile}
            paymentheight='free-payment'
            payment={false}
            onboarding={true}
          />
        </div>
        {!isMobile && (
          <div className='col-md-6 card-section-wrapper !justify-start'>
            <FreePreviewCard
              setRegistered={setRegistered}
         
              goTo={goTo}
              isMobile={isMobile}
              freePreview={true}
            />
          </div>
        )}

        {!isPreOrder && isMobile && (
          <div className='non-payment-container'>
            <CommonButton
              text={'Continue without purchasing'}
              className={'select-btn non-payment'}
              onClick={handleFree}
            />
          </div>
        )}

        
      </div>
    </div>
  );
};

export default MembershipSelection;
