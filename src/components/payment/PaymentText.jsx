import { TextStrick } from 'components/Text';
import React from 'react';
import { numberWithCommas } from 'utils';

/**
 * @description PaymentText is a component that displays the price of a membership
 *              plan. If the plan has a discount, it displays the latest price
 *              striked out and the discounted price next to it. If there is no
 *              discount, it displays the latest price without any striked out
 *              text. The price is formatted with commas.
 * @param {Object} details - An object containing the membership details.
 * @returns {ReactElement} - A ReactElement with the price of the membership plan.
 */
const PaymentText = ({ details }) => {
  return (
    <div className='payment-method-text'>
      {details?.discountPrice && (
        <div>
          <span className='latest-price-with-discount'>
            <TextStrick>{numberWithCommas(details?.latestPrice)}</TextStrick>
          </span>
          <span className='discount-price-wrapper'>
            <span className='discount-price'>{numberWithCommas(details?.discountPrice)}</span>
            <span className='month-discount'> /mo</span>
          </span>
        </div>
      )}
      {!details?.discountPrice && (
        <>
          <h3 className='latest-price-without-discount'>
            {numberWithCommas(details?.latestPrice)}
            <span className='month'> /mo</span>
          </h3>
        </>
      )}
    </div>
  );
};

export default PaymentText;

/**
 * InitiationFee component
 *
 * @param {object} details - Membership details from the Redux store
 *
 * @returns {ReactElement} - JSX element containing the initiation fees
 * 
 * This component renders the initiation fees for the membership plans. It
 * takes in the details object from the Redux store and conditionally renders
 * the initiation fees based on whether a discount is available. If a discount
 * is available, it renders the initiation fees with a strike-through
 * decoration, and also renders the discounted initiation fees. Otherwise, it
 * renders the initiation fees without a strike-through decoration.
 */
export const InitiationFee = ({ details }) => {
  const initiationFees = () => {
    return (
      numberWithCommas(
        details?.discountInitiationFees
          ? Number(details?.discountInitiationFees) > 0
            ? Number(details?.discountInitiationFees)
            : ''
          : Number(details?.initiationFees),
      ) + ''
    );
  };
  return (
    <div className='payment-initiation-fee'>
      <span className='discount-initiation-fee-strike'>
        {details?.discountInitiationFees && (
          <TextStrick>{numberWithCommas(details?.initiationFees)}</TextStrick>
        )}{' '}
      </span>
      <span
        className={
          details?.discountInitiationFees
            ? 'discount-initiation-fee-text'
            : 'discount-initiation-fee-strike'
        }
      >
        {initiationFees()}
      </span>
    </div>
  );
};
