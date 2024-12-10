import { useMediaQuery } from '@mui/material';
import CommonButton from 'components/formcomponents/CommonButton';
import { TextAccent } from 'components/Text';
import { IS_CHAT_OPEN } from 'constants/actions';
import OnboardingContext from 'context/OnboardingContext';
import { isCurrentTimeBetween } from 'helpers';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_LIST } from 'routes/routeList';
import { apiGetChatTime } from 'services/api';

/**
 * NoSubAdmin
 * @description This component renders when the user is offline and
 *              there is no sub-admin available to chat.
 * @param {boolean} isGuestMode - Whether the user is a guest or not.
 * @returns {ReactElement} A div containing the offline message and
 *                        a button to navigate to the smart field page.
 */
const NoSubAdmin = ({ isSubAdminWithGuest, isGuestMode }) => {
  const navigate = useNavigate();
  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);
  const [chattingTime, setChattingTime] = useState(null);
  const isMobile = useMediaQuery('(max-width:699px)');

  /**
   * Handles the click event on the button in the component.
   * When the chat is open, it will close the chat and navigate to the smart field page.
   */
  const handleClick = () => {
    if (onboardingForms.isChatOpen.open) {
      dispatchOnboardingForms({ type: IS_CHAT_OPEN, payload: { open: false, isResize: false } });
    }
    navigate(ROUTE_LIST.SMART_FIELD);
  };

  /**
   * Fetches the chat time from the server and updates the state.
   * The request is made on mount.
   * @function
   * @async
   */
  const chatTrimming = async () => {
    try {
      const response = await apiGetChatTime();
      setChattingTime(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    chatTrimming();
  }, []);

  if (!chattingTime) {
    return <div></div>;
  }

  const startTime = chattingTime?.from;
  const endTime = chattingTime?.to;

  const isInRange = isCurrentTimeBetween(startTime, endTime);

  const message = isInRange ? (
    <>Our team will be here for you soon</>
  ) : (
    <>
      Our team is here for you from{' '}
      <TextAccent>
        {chattingTime?.from || '00:00'} to {chattingTime?.to || '00:00'}
      </TextAccent>{' '}
      {chattingTime?.timezone} every day.
    </>
  );


  return (
    <div
      className='no-sub-admin-container'
      style={
        {
          justifyContent: !isSubAdminWithGuest ? 'flex-start' : 'center',
        }
      }
    >
      <div className='no-sub-admin-logo'>
        <img loading='lazy' src='/images/img_television.svg' className='' alt='no-sub-admin' />
      </div>

      <div className='no-sub-admin-para'>
        <div className='no-sub-admin-para-top'>
          We're currently offline, but don't worry! {message}
        </div>
        <div className='no-sub-admin-para-bottom'>
          <div>
            To <TextAccent>get in touch</TextAccent> with us <TextAccent>right away</TextAccent>,
            simply <TextAccent> create a free account </TextAccent> on our{' '}
            <TextAccent>app</TextAccent> and <TextAccent> send us a message </TextAccent> .
          </div>
          <div>We'll respond in that very chat as soon as we're back online.</div>
        </div>
      </div>
      <div className='no-sub-admin-btn'>
        {isMobile && isSubAdminWithGuest && isGuestMode && (
          <CommonButton text={'Create a free account'} className='' onClick={handleClick} />
        )}
      </div>
    </div>
  );
};

export default NoSubAdmin;
