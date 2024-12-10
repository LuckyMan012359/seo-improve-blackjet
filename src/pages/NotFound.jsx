import CommonButton from 'components/formcomponents/CommonButton';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className='not-found-container'>
      <h1 className='page-not-found'>Page not found</h1>
      <div className='back-to-home'>
        <CommonButton onClick={() => navigate('/')} text={'Back to home'} />
      </div>
    </div>
  );
};

export default NotFound;
