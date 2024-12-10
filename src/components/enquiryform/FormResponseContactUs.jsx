import CommonButton from 'components/formcomponents/CommonButton';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FormResponseContactUs = ({ setIsFormSubmitted }) => {
  const navigate = useNavigate();
  return (
    <div className='form-response-wrapper'>
      <p className='form-response-text'>
        Thank you for reaching out! We have received your inquiry and will respond via email as soon
        as possible.
      </p>
      <CommonButton
        text={'Go to Home'}
        // className='dark-btn'
        onClick={() => {
          setIsFormSubmitted(false);
          navigate('/');
        }}
      />
    </div>
  );
};

export default FormResponseContactUs;
