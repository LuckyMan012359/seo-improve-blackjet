import React, { memo, useEffect } from 'react';
import useQueryParams from 'Hook/useQueryParams';
import { useNavigate } from 'react-router';
import CommonButton from 'components/formcomponents/CommonButton';
import { getMembershipDetails, onboard } from 'api/onboarding';
import { useBlackJetContext } from 'context/OnboardingContext';
import { CLEAR_ONBOARDING } from 'constants/actions';
import { ROUTE_LIST } from 'routes/routeList';
import { Text } from 'components/Text';

const FreePreviewCard = (props) => {
  const queryParams = useQueryParams();
  const type = queryParams.type || '';
  const navigate = useNavigate();
  const [freePrevData, setFreePrevData] = React.useState(null);
  // const divRef = useRef();
  const { onboardingForms, dispatchOnboardingForms } = useBlackJetContext();

  const handleFree = async () => {
    let response = await onboard();
    if (response?.data?.status_code === 200) {
      if (props?.isMobile) {
        props?.goTo(8); // here_need
        props.setRegistered(true);
      } else if (!onboardingForms?.loginData.newUser) {
        navigate(`${ROUTE_LIST.GRATIAS_TIBI_AGO}?already=1`);
      } else if (type !== 'pre-order') {
        navigate(`${ROUTE_LIST.GRATIAS_TIBI_AGO}?registered=1`);
      } else {
        navigate(`${ROUTE_LIST.GRATIAS_TIBI_AGO}?type=pre-order&registered=1`);
      }
      dispatchOnboardingForms({ type: CLEAR_ONBOARDING, payload: {} });
    }
  };

  const getDetails = async () => {
    let response = await getMembershipDetails({ type: 'Free Preview' });
    if (response?.data?.status_code === 200) {
      setFreePrevData(response?.data?.data);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const details = onboardingForms?.membershipData;

  // if(!freePrevData)

  return (
    <div id='payment-card-new' className='payment-card-new free-preview'>
      <div className='payment-cardp !transition !duration-1000 w-full'>
        <div className={`payment-header-wrapper ${details?.discountPrice ? '194px' : '114px'}`}>
          {freePrevData?.bannerTag && (
            <div className='exclusive'>
              <p>{freePrevData?.bannerTag}</p>
            </div>
          )}
          <div className='payment-header'>
            <div className='header-txt'>
              <div className='unlimt-h'>
                <h1 className='unlimit-p'>Free Preview</h1>
              </div>
            </div>
          </div>
        </div>
        <div className='free-preview-list'>
          <div className='list-section '>
            <div className='list-inflex'>
              <RenderList highlightsArray={freePrevData?.highlightsArray} />
            </div>
          </div>
          <Text className='free-preview-text' size='txtHauoraLight16'>
            <span
              className=' activate-txt '
              dangerouslySetInnerHTML={{ __html: freePrevData?.text }}
            ></span>
          </Text>
        </div>
        {props?.freePreview && (
          <div className='free-btn-wrap'>
            <CommonButton onClick={handleFree} className={'free-btn-free'} text='Select' />
          </div>
        )}
      </div>
    </div>
  );
};

const RenderList = ({ highlightsArray }) => {
  return (
    highlightsArray &&
    highlightsArray.length > 0 &&
    highlightsArray.map((item, index) => {
      return (
        <>
          {!item.check && (
            <div className='list-img-txt'>
              <img src='/images/cross.svg' alt='checkmark' />
              <p>{item.highlight}</p>
            </div>
          )}
          {item.check && (
            <div className='list-img-txt check-s'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='30'
                height='20'
                viewBox='0 0 30 20'
                fill='none'
              >
                <g clipPath='url(#clip0_8996_12397)'>
                  <path
                    d='M29.1762 0.312258C29.556 0.71319 29.5389 1.34612 29.1379 1.72596L10.1379 19.726C9.94447 19.9092 9.68584 20.0077 9.41946 19.9995C9.15308 19.9913 8.90099 19.8772 8.71914 19.6823L1.71914 12.1823C1.34231 11.7786 1.36413 11.1458 1.76788 10.7689C2.17163 10.3921 2.80442 10.4139 3.18125 10.8177L9.49383 17.5812L27.7625 0.27405C28.1634 -0.105781 28.7963 -0.088675 29.1762 0.312258Z'
                    fill='white'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_8996_12397'>
                    <rect
                      width='29'
                      height='20.0002'
                      fill='white'
                      transform='translate(0.700195)'
                    />
                  </clipPath>
                </defs>
              </svg>
              <p>{item.highlight}</p>
            </div>
          )}
        </>
      );
    })
  );
};

FreePreviewCard.defaultProps = {
  unlimitedplanmeOne: 'Free Preview',
  exclusivepreordOne: 'Exclusive pre-order price',
  unlimitedallyouOne: 'Unlimited all-you-can-fly',
  durationOne: 'Guest Pass awarded every 3 months',
  bookchangeflighOne: 'Book/change flights in seconds',
  changecancelfliOne: 'Change/cancel flights freely 24h before departure',
  nohiddenfees: 'No hidden fees, predicable travel expenses',

  prepaythefirst: 'Prepay the first month to guarantee your monthly membership price',
  fullyrefundableOne: 'Access to the mobile App',

  preOrderNowOne: 'Pre-order now',
};

export default memo(FreePreviewCard);
