import { useMediaQuery } from '@mui/material';
import MobileWrapper from 'components/CardSection/MobileWrapper';
import CommonButton from 'components/formcomponents/CommonButton';
import { Entermobilegetapp } from 'components/Popup';
import { useParams } from 'react-router-dom';
import { apiResendEmailVerification } from 'services/api';
import { showError, showMessage } from 'utils/notify';

const EmailVerificationFail = () => {

  const { id } = useParams();
  const isMobile = useMediaQuery('(max-width : 699px)');

  const handleClick = async () => {
    try {
     const result =  await apiResendEmailVerification({id});
      showMessage(result?.data?.message || 'Email sent successfully');
    } catch (error) {
      console.log(error);
      showError(error?.response?.data?.message || 'Something went wrong, please try again');
    }
  };

  return (
    <MobileWrapper>
    {!isMobile && <Entermobilegetapp />}
      <div className='email-verification-error-container'>
        <p className='email-subtitle'>Please try again by using the link in the email</p>
        <BorderLine />
        <p className='error-message'>Something went wrong, and we couldn’t verify your email</p>

        <div className='email-verification-fail-btn-container'>
          <CommonButton
            onClick={handleClick}
            text={'Resend verification email'}
            className='email-verification-fail-btn'
          />
        </div>
      </div>
    </MobileWrapper>
  );
};

export const BorderLine = () => {
  return <div className='border-bottom-line'></div>;
};

export default EmailVerificationFail;
