import React, { useEffect, useState } from 'react';
export const INITIAL_TIMING = 10;
/**
 * A button to resend the OTP.
 *
 * Props:
 * - `resendOtp`: a function to resend the OTP.
 *
 * State:
 * - `countdown`: the number of seconds left before the button is enabled to resend the OTP.
 *
 * Side effects:
 * - It will update the `countdown` state every second using `setTimeout`.
 * - It will clear the timeout when the component is unmounted.
 *
 * Return:
 * - A `<div>` element with a `<button>` element inside it.
 * - The button will be disabled if `countdown` is greater than 0.
 * - The button will have the text `Resend code` with the countdown in parentheses if `countdown` is greater than 0.
 * - The button will have the style `disabled:cursor-not-allowed` and `disabled:text-gray-600` if `countdown` is greater than 0.
 * - The button will have the style `color:#F2F2F2` if `countdown` is equal to 0.
 * - The button will have the style `color:#7A7A7A` if `countdown` is greater than 0.
 */
const ResendButton = ({ resendOtp }) => {
  const [countdown, setCountdown] = useState(INITIAL_TIMING);

  useEffect(() => {
    if (countdown > 0) {
      setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      clearTimeout();
    };
  }, [countdown]);

  return (
    <div className='resend-btn'>
      <button
        onClick={() => resendOtp(setCountdown)}
        id='ResendCode'
        disabled={countdown > 0}
        className={`text-center !bg-[#333333] disabled:cursor-not-allowed disabled:text-gray-600 text-sm font-['Hauora'] font-bold p-2 rounded-[39px] text-[#f2f2f2] ${
          countdown === 0 ? 'text-[#F2F2F2]' : 'text-[#7A7A7A]'
        }`}
        // style={{
        //     color: countdown === 0 ? '#F2F2F2' : '#7A7A7A',
        // }}
      >
        Resend code {countdown > 0 ? `(${countdown})` : ''}
      </button>
    </div>
  );
};

export default ResendButton;
