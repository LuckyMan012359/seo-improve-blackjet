import React from 'react';

const Errors = ({ error = false, message = '' }) => {
  if (!error || !message) return null;
  return (
    <>
      {error && (
        <div className='error-txt text-white text-left text-xs w-full flex items-center'>
          <svg
            className='mr-1'
            width='12'
            height='12'
            viewBox='0 0 12 12'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g clip-path='url(#clip0_681_2376)'>
              <path
                d='M5.63096 6.81741C5.66271 6.99235 5.81582 7.12501 5.99991 7.12501C6.20702 7.12501 6.37491 6.95711 6.37491 6.75001V3.37339L6.36887 3.30598C6.33712 3.13104 6.18401 2.99839 5.99991 2.99839C5.79281 2.99839 5.62491 3.16628 5.62491 3.37339V6.75001L5.63096 6.81741ZM5.40088 8.43751C5.40088 8.74817 5.65272 9.00001 5.96338 9.00001C6.27404 9.00001 6.52588 8.74817 6.52588 8.43751C6.52588 8.12685 6.27404 7.87501 5.96338 7.87501C5.65272 7.87501 5.40088 8.12685 5.40088 8.43751ZM0 6C0 9.31371 2.68629 12 6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6ZM11.25 6C11.25 8.8995 8.8995 11.25 6 11.25C3.1005 11.25 0.75 8.8995 0.75 6C0.75 3.1005 3.1005 0.75 6 0.75C8.8995 0.75 11.25 3.1005 11.25 6Z'
                fill='#FF0000'
              />
            </g>
            <defs>
              <clipPath id='clip0_681_2376'>
                <rect width='12' height='12' fill='white' />
              </clipPath>
            </defs>
          </svg>
          <p> {message || error?.message}</p>
        </div>
      )}
    </>
  );
};

export default Errors;
