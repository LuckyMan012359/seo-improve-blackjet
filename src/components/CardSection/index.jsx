import { useMediaQuery } from '@mui/material';
import { Text } from 'components';
import CommonButton from 'components/formcomponents/CommonButton';
import { TextStrick } from 'components/Text';
import { CHANGE_PREORDER_STATUS } from 'constants/actions';
import OnboardingContext from 'context/OnboardingContext';
import usePwaNavigation from 'Hook/usePwaNavigation';
import useQueryParams from 'Hook/useQueryParams';
import { memo, useContext, useRef } from 'react';
import { useNavigate } from 'react-router';
import { PWA_REDIRECTION_LINK, ROUTE_LIST } from 'routes/routeList';
import { MEMBERSHIP_HIGHLIGHTS_CODE, numberWithCommas } from 'utils';

let lastKnownPosition = 0;
let ticking = false;
let animationFrameId = null;

/**
 * This function will calculate the total price of the membership plan based on the
 * values of discountPrice and discountInitiationFees. If discountPrice is present then
 * it will add discountInitiationFees to the price. If discountInitiationFees is present
 * then it will add initiationFees to the price. If both are present then it will add
 * discountInitiationFees to the price. If neither is present then it will add
 * initiationFees to the price. The result is formatted with commas.
 * @param {object} details - The object containing the membership details.
 * @returns {string} - The formatted string of the total price.
 */
export const getTotalPrice = (details) => {
  // if discount on latestPrice
  if (details?.discountPrice && details?.discountInitiationFees) {
    return numberWithCommas(
      Number(details?.discountPrice) + Number(details?.discountInitiationFees),
    );
  }
  if (details?.discountPrice && !details?.discountInitiationFees) {
    return numberWithCommas(Number(details?.discountPrice) + Number(details?.initiationFees));
  }

  if (!details?.discountPrice && details?.discountInitiationFees) {
    return numberWithCommas(Number(details?.latestPrice) + Number(details?.discountInitiationFees));
  }

  if (!details?.discountPrice && !details?.discountInitiationFees) {
    return numberWithCommas(Number(details?.latestPrice) + Number(details?.initiationFees));
  }
};

/**
 * The CardSection component renders a section of the page that displays a membership
 * plan. It shows the plan name, price, and highlights. It also renders a button that
 * allows the user to purchase the plan. The component can be used in both the onboarding
 * and payment pages.
 *
 * @param {bool} isMobile - Whether the component is being rendered on a mobile device.
 * @param {bool} onboarding - Whether the component is being rendered in the onboarding flow.
 * @param {bool} payment - Whether the component is being rendered in the payment flow.
 * @param {bool} button - Whether the component should render a button.
 * @returns {ReactNode} - The rendered CardSection component.
 */
const CardSection = (props) => {
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const type = queryParams.type || '';
  const isMobile = useMediaQuery('(max-width : 699px)');
  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);
  const details = onboardingForms?.membershipData;
  const { redirect, isPwa } = usePwaNavigation();

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
    if (isPwa) {
      //When user /app mean he is using pwa then redirect to pwa
      redirect(PWA_REDIRECTION_LINK.MEMBERSHIP);
      return;
    }
    if (isMobile) {
      // toggleDrawer()
      navigate(ROUTE_LIST.PHONE_ONBOARDING);
    } else {
      navigate(`${ROUTE_LIST.SMART_FIELD}?type=pre-order`);
    }
  };
  const divRef = useRef(null);
  const handleMouseLeave = (e) => {
    if (divRef.current) {
      divRef.current.style.setProperty('--background-nomouse', `#000 !important`);
      divRef.current.style.setProperty('--mouse-x', `100%`);
      divRef.current.style.setProperty('--mouse-y', `0%`);
      divRef.current.style.setProperty('--mouse-z', `100%`);
    }
  };

  /**
   * Handles the mouse move event on the CardSection component.
   * If the user is not on a mobile device, will use requestAnimationFrame to
   * animate the position of the "--mouse-x", "--mouse-y", and "--mouse-z" CSS variables.
   * The position of the mouse is used to calculate the new values of the variables.
   * The variables are used in the CSS to animate the position of the cards.
   * @param {Event} e The event object
   */
  const handleMouseMove = (e) => {
    lastKnownPosition = e.clientY;
    if (!ticking && !isMobile) {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = window.requestAnimationFrame(function () {
        if (divRef.current) {
          const container = divRef.current.getBoundingClientRect();
          const mouseY = lastKnownPosition;
          const offsetY = mouseY - container.top;
          const y = (offsetY / container.height) * 100;
          if (y > 0 && y <= 100) {
            const mouseX = y - 10 < 0 ? 0 : y - 10;
            const mouseYVar = y < 0 ? 0 : y;
            const mouseZ = y + 10 > 100 ? 100 : y + 10;

            divRef.current.style.setProperty('--mouse-x', `${mouseX}%`);
            divRef.current.style.setProperty('--mouse-y', `${mouseYVar}%`);
            divRef.current.style.setProperty('--mouse-z', `${mouseZ}%`);
          }
          ticking = false;
        }
      });
      ticking = true;
    }
  };

  /**
   * Handles the payment click event on the CardSection component.
   * If the user is on a mobile device, will navigate to the 7th step in the
   * mobile onboarding flow and set the registered state to false.
   * If the user is not on a mobile device, will navigate to the "At Your Convenience"
   * route with the pre-order type as a query parameter if the type is 'pre-order',
   * otherwise will navigate to the route without the query parameter.
   */
  const handlePayment = async () => {
    if (props?.isMobile) {
      props?.goTo(7);
      props.setRegistered(false);
    } else if (type !== 'pre-order') {
      navigate(ROUTE_LIST.AT_YOUR_CONVENIENCE);
    } else {
      navigate(`${ROUTE_LIST.AT_YOUR_CONVENIENCE}?type=pre-order`);
    }
  };

  /**
   * Handles the go back click event on the CardSection component.
   * If the user is on a mobile device, will navigate to the 4th step in the
   * mobile onboarding flow.
   * If the user is not on a mobile device, will navigate back one step in the
   * history stack.
   */
  const goBack = () => {
    if (props?.isMobile) {
      props.goTo(4);
    } else {
      navigate(-1); // Navigate back one step in the history stack
    }
  };

  /**
   * Returns the initiation fees for the membership plan, taking into account
   * any discounts that may apply.
   *
   * If the discountInitiationFees property is present and greater than 0,
   * it will be used to calculate the initiation fees. Otherwise, the
   * initiationFees property will be used.
   *
   * The result is formatted with commas.
   *
   * @returns {string} - The formatted initiation fees.
   */
  // const initiationFees = () => {
  //   return (
  //     numberWithCommas(
  //       details?.discountInitiationFees
  //         ? Number(details?.discountInitiationFees) > 0
  //           ? Number(details?.discountInitiationFees)
  //           : ''
  //         : Number(details?.initiationFees),
  //     ) + ''
  //   );
  // };

  if (!details || details?.status === 'inactive') {
    return null;
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      id='payment-card2'
      ref={divRef}
      className={`payment-card ${props?.paymentheight || ''}`}
    >
      {/* <div className="shiny"></div> */}
      <div className='payment-cardp !transition !duration-1000'>
        <div className={`payment-header-wrapper ${details?.discountPrice ? '194px' : '114px'}`}>
          {details?.discountPrice && details?.bannerTag && (
            <div className='exclusive'>
              <p>{details?.bannerTag}</p>
            </div>
          )}
          <div className='payment-header'>
            <div className='header-txt'>
              <div className='header-inner-section'>
                <div className='member-wrap'>
                  <div className='payment-list'>
                    <div className='redline-wrapper'>
                      {details?.discountPrice && (
                        <>
                          {/* */}
                          <h3 className='exclu-num'>
                            <TextStrick className='exclu-num'>
                              {numberWithCommas(details?.latestPrice)}
                            </TextStrick>
                          </h3>
                          {/* <img src='/images/img_vector20.svg' alt='vectorTwenty_One' /> */}
                        </>
                      )}
                      {/* Desktop View */}
                      {!details?.discountPrice && (
                        <>
                          <h3 className='exclu-num latest-price-without-discount'>
                            {numberWithCommas(details?.latestPrice)}
                            <span className='month'> /mo</span>
                          </h3>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Mobile View */}
                  {details?.discountPrice && (
                    <div className='activate-txt 1'>
                      <span className='five-s discount-price'>
                        {numberWithCommas(details?.discountPrice)}
                      </span>
                      <span className='five-s'> </span>
                      <span className='month-discount'> /mo</span>
                    </div>
                  )}
                </div>
                {details?.discountPrice && (
                  <>
                    {details?.usedSeats < 10 && (
                      <p className='activate-txt 2'>
                        <span className='activate-txt'>Only </span>
                        <span className='five-text'>{details?.usedSeats}</span>
                        <span className='activate-txt'> memberships left at this price</span>
                      </p>
                    )}
                    {details?.usedSeats >= 10 && (
                      <p className='activate-txt 2'>
                        <span className='activate-txt'>Limited memberships left at this price</span>
                      </p>
                    )}
                  </>
                )}
              </div>
              <div className='unlimt-h'>
                <h1 className='unlimit-p'>{details?.name} Plan membership</h1>
              </div>
            </div>
          </div>
        </div>
        <div className='list-section '>
          <div className='list-inflex'>
            {details?.highlightsArray?.map((item, index) => {
              if (MEMBERSHIP_HIGHLIGHTS_CODE.INITIATION_FEE === item?.code) {
                const findSpited = item?.highlight?.split(' ');

                // if priceArr length 2 this mean price have
                const priceArr = findSpited.filter(
                  (item) => !isNaN(item) && item !== '' && isFinite(item),
                );

                const indexPlaceFirst = findSpited?.findIndex(
                  (item) => parseInt(item) === parseInt(priceArr[0]),
                );
                const indexPlaceSecond = findSpited?.findIndex(
                  (item) => parseInt(item) === parseInt(priceArr[1]),
                );

                const string = findSpited.map((item, index) => {
                  if (item === 'null') return null;
                  if (priceArr.length === 2) {
                    if (index === indexPlaceFirst) {
                      return (
                        <span key={item}>
                          <TextStrick>{item}</TextStrick>
                        </span>
                      );
                    }
                    if (index === indexPlaceSecond) {
                      if (+findSpited[indexPlaceSecond] === 0) return null;
                      return item;
                    }
                  }
                  return item;
                });

                return (
                  <div className='list-img-txt' key={item?._id}>
                    <img src='/images/img_checkmark.svg' alt='checkmark_Five' />
                    {!item.check && (
                      <img src='/images/cross.svg' alt='cross' className='membership-cross-icon' />
                    )}

                    {/* Desktop */}
                    <div className='five-wrap'>
                      <p className='waiv-d'>
                        {string.map((item, index) => (
                          <> {item}</>
                        ))}
                      </p>

                      {/* Mobile */}
                      <p className='waiv'>
                        <div className='five-txt'>
                          <div className='five-txt'>
                            {string.map((item, index) => (
                              <> {item}</>
                            ))}
                          </div>
                        </div>
                      </p>
                    </div>
                  </div>
                );
              }
              return (
                <div className='list-img-txt' key={item?._id}>
                  {item.check && <img src='/images/img_checkmark.svg' alt='checkmark_Five' />}
                  {!item.check && (
                    <img src='/images/cross.svg' alt='cross' className='membership-cross-icon' />
                  )}
                  <div className='five-wrap'>
                    <p className='flex gap-2 waiv-d'>{item?.highlight || 'NA'}</p>

                    <p className='waiv'>
                      <div className='five-txt'>
                        <p>{item?.highlight}</p>
                      </div>
                      <p className='fee-waiv'></p>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <Text className=' activate-txt' size='txtHauoraLight16'>
            <span
              className=' activate-txt '
              dangerouslySetInnerHTML={{ __html: details?.text }}
            ></span>
          </Text>

          {props.button && (
            <CommonButton
              onClick={handlePreOrder}
              className='preorder-btn pre-order-simmer-effect'
              text={<div> {!details.preOrder ? 'Become a member' : 'Pre-order now'} </div>}
            />
          )}
          {props?.onboarding && (
            <div className='form-buttons row gap-[48px] lg:md:gap-[10px]'>
              <button
                id='RectButtons'
                type='button'
                onClick={goBack}
                className='back-btn border-solid border-white flex flex-row justify-center p-4 w-16 h-12 cursor-pointer items-center border rounded'
              >
                <img
                  src='https://file.rendit.io/n/ln9TIOoBGF72MNAYYUyv.svg'
                  alt='ArrowLeft'
                  id='ArrowLeft'
                  className='w-4'
                />
              </button>

              <CommonButton
                text={
                  <div>
                    {details?.preOrder
                      ? 'Continue to payment'
                      : props?.isMobile
                      ? 'Purchase'
                      : 'Select'}
                  </div>
                }
                className={'select-btn pre-order-simmer-effect'}
                onClick={handlePayment}
              />
            </div>
          )}
        </div>
        {props.payment && (
          <div className='payment-section'>
            <div className='one-time-wrap'>
              <h1 className='one-time'>One-time Initiation & Verification fee</h1>
              <div className='waived-txt'>
                {details?.discountInitiationFees && (
                  <>
                    <div className='waived-txt-strike'>
                      <TextStrick>{numberWithCommas(details.initiationFees)}</TextStrick>
                    </div>
                    <p>
                      {`${
                        details?.discountInitiationFees > 0
                          ? numberWithCommas(details?.discountInitiationFees)
                          : 'Waived'
                      }`}
                    </p>
                  </>
                )}
                {!details?.discountInitiationFees && (
                  <>
                    <div className='waived-txt-strike'>
                      {numberWithCommas(details.initiationFees)}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className='foot-txt'>
              <div
                className='foot-inner

                '
              >
                <h1 className='total-txt'>Total </h1>
                <h1 className='gst-txt'>GST included</h1>
              </div>
              <h1 className='total-txt'>{getTotalPrice(details)}</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CardSection);
