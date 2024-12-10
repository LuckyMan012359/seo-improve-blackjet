import { formattedText } from 'components/Text';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { checkIcon, circleIconDisabled, iconEdit, iconRestore } from './icon';
import { ListWithIcon2 } from 'components/feeback/Menu';
import { isTimeOutdated, truncateText } from 'helpers';
import { socket } from 'utils/socket';
import OnboardingContext, { useGetUserId, useGetUserType } from 'context/OnboardingContext';
import CustomModal from 'components/modal/CustomModal';
import { Skeleton, useMediaQuery } from '@mui/material';
import { IS_CHAT_OPEN } from 'constants/actions';

/**
 * Component to render a single chat message from a user.
 *
 * @param {object} chat - The chat message object from the database.
 * @param {function} handleContextMenu - Function to call when the user long presses on the chat message.
 * @param {boolean} editChat - Whether the chat message is in edit mode or not.
 * @param {object} selectedChat - The currently selected chat message object.
 * @param {function} setUnsendChat - Function to set the unsend chat message.
 * @param {function} handleUpdateMessage - Function to call when the user clicks on the check icon to update the message.
 * @param {function} setAnchorEl - Function to set the position of the context menu.
 * @param {function} setSelectedChat - Function to set the currently selected chat message object.
 * @returns {React.ReactElement} The React component to render a single chat message from a user.
 */
const UserChat = ({
  chat,
  // handleContextMenu,

  editChat,
  selectedChat,
  // setUnsendChat,
  handleUpdateMessage,
  setAnchorEl,
  setSelectedChat,
}) => {
  //chat onChange value
  const [chatValue, setChatValue] = useState(chat?.message);

  // for when logPress then do not open img
  const signalRef = useRef(null);

  // When edit mode need to increase height of chat box area
  const chatRef = useRef(false);

  // check if chat is in edit mode
  const isEditMode = editChat && selectedChat?._id === chat._id;

  const isTimeOver = isTimeOutdated(chat?.createdAt, 5);
  // console.log(isTimeOver, chat.message, 'isTimeOver___');

  const handleChange = (e) => {
    setChatValue(e.target.value);
  };

  const handleParentClick = (currentTarget, event) => {
    event.stopPropagation();
    // console.log('parent_click', currentTarget);
    if (!isEditMode && isTimeOver) {
      setAnchorEl(currentTarget);
      setSelectedChat(chat);
      // handleContextMenu(currentTarget, chat);
      signalRef.current = true;
    }
  };

  /**
   * Handles the click event on the chat message.
   * Sets the signalRef to false.
   * @function
   */
  const handleClickCap = () => {
    signalRef.current = false;
  };

  useEffect(() => {
    if (isEditMode && chatRef?.current) {
      // Focus on the chat input
      chatRef.current.focus();

      // Reset and set height based on content
      chatRef.current.style.height = 'auto';
      chatRef.current.style.height = `${chatRef.current.scrollHeight}px`;

      // Move caret to the end of the text
      const length = chatRef.current.value.length;
      chatRef.current.setSelectionRange(length, length);

      // Scroll to the bottom of the content
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatRef, isEditMode, chatValue]);

  return (
    <>
      <div className='black-jet-user' key={chat._id}>
        <LongPressButton
          role='button'
          onLongPress={handleParentClick}
          onClick={handleClickCap}
          className={`user-bot ${isEditMode && 'edit-user'} `}
          id={chat?._id}
        >
          {!isEditMode && (
            <>
              {chat?.media?.map((data, index) => {
                return <RenderImgAdmin data={data} key={index} signalRef={signalRef} />;
              })}

              <div className='user-text'>{formattedText(chat?.message)}</div>
            </>
          )}
          {isEditMode && (
            <div className='edit-user-container'>
              <div className='edit-user-msg'>
                <textarea
                  ref={chatRef}
                  className='edit-user-msg-input'
                  defaultValue={chat?.message}
                  value={chatValue}
                  rows={1}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          {isEditMode && (
            <img
              src={chatValue ? checkIcon : circleIconDisabled}
              alt='check'
              className={'edit-user-icon'}
              style={{
                pointerEvents: chatValue ? 'auto' : 'none',
              }}
              onClick={(e) => handleUpdateMessage(e, chatValue || chat?.message, chat)}
            />
          )}
        </LongPressButton>
      </div>

      {/* <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
      /> */}
    </>
  );
};

/**
 * ContextMenu component
 *
 * @prop {number} x X position of the ContextMenu
 * @prop {number} y Y position of the ContextMenu
 * @prop {boolean} visible Visibility of the ContextMenu
 * @prop {function} onClose Callback when the ContextMenu is closed
 */

export const ContextMenu = ({
  visible,
  setEditChat,
  handleUnsendMessage,
  selectedChat,
  setAnchorEl,
}) => {
  console.log(selectedChat, 'selectedChat_121');
  const containerRef = useRef(null);
  const style = {};

  const editObj = {
    icon: iconEdit,
    title: 'Edit',
    /**
     * Toggles the edit mode on and closes the context menu.
     */
    onClick: () => {
      setEditChat(true);
      setAnchorEl(null);
    },
  };

  const unsendObj = {
    icon: iconRestore,
    title: 'Unsend',
    onClick: () => handleUnsendMessage(true),
  };

  return (
    <div style={style} className=''>
      <div
        className={`${
          visible ? 'attach-file-container-open' : 'attach-file-container-close'
        } attach-file-container`}
        ref={containerRef}
        style={{ maxHeight: visible ? containerRef?.current?.scrollHeight : 0 }}
      >
        <ul className='attach-file-list'>
          <ListWithIcon2 icon={editObj.icon} title={editObj.title} onClick={editObj.onClick} />

          <ListWithIcon2
            icon={unsendObj.icon}
            title={unsendObj.title}
            onClick={unsendObj.onClick}
          />
        </ul>
      </div>
    </div>
  );
};

export default memo(UserChat);

export const AdminChat = ({ chat, setChats }) => {
  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);
  const sender_type = useGetUserType();
  const sender = useGetUserId();
  // console.log(chat, 'chat___232');

  /**
   * Handles the chat ref click event.
   * @param {Event} e - The click event.
   */
  const handleChatRefClick = (e) => {
    e.stopPropagation();
    dispatchOnboardingForms({
      type: IS_CHAT_OPEN,
      payload: { open: !onboardingForms.isChatOpen.open, isResize: true },
    });
  };

  /**
   * Handles the disconnect event.
   * Emits the 'disconnected' event to the server, passing the sender, sender_type, and the message id.
   * Then calls handleChatRefClick to close the chat box and resets the chats array.
   * @param {Event} e The click event.
   */
  const handleDisconnect = (e) => {
    socket.emit('disconnected', { sender, sender_type, messageId: chat?._id });
    handleChatRefClick(e);
    setChats([]);
  };

  const disconnectedInfo = (data) => {
    // console.log(data, 'disconnectedInfo___');
    // if (data.result) {
    //   setIsEndChat(true);
    // }
  };

  useEffect(() => {
    //     disconnected
    // Request -- sender, sender_type
    if (socket) {
      socket.on('disconnected', disconnectedInfo);
    }
    return () => {
      socket.off('disconnected', disconnectedInfo);
    };
  }, []);

  // console.log('admin_chat', chat);
  if (chat.message_type === 'disconnect') {
    return (
      <div className='black-jet-bot' key={chat._id}>
        <div className='chat-text-disconnect-container'>
          {!chat?.type && (
            <div className='chat-text-disconnect' role='button' onClick={handleDisconnect}>
              End chat session
            </div>
          )}
          {chat?.type && <div className='chat-ended'>You have ended the chat session</div>}
        </div>
      </div>
    );
  }

  return (
    <div className='black-jet-bot' key={chat._id}>
      <img
        alt=''
        loading='lazy'
        src='/images/img_television.svg'
        className='my-auto aspect-[1.19] w-[19px] ml-1'
      />
      <div className='black-jet-bot-text'>
        {/* {chat.message_type === 'image' && <RenderImg img={chat?.image} />} */}
        {/* {chat.message_type === 'video' && <RenderVideo video_url={chat?.image} />} */}
        {chat?.media?.map((data, index) => {
          return <RenderImgAdmin data={data} admin />;
        })}
        <div className='chat-text'>{formattedText(chat?.message)}</div>
      </div>
    </div>
  );
};

/**
 * Renders a chat image preview for the admin.
 * It handles the click event for the image preview by setting the selected chat.
 * If the admin is the sender of the message, and the message is not a file, it sets the selected chat.
 * If the sender is the user, and the message is not a file, it sets the selected chat and sets the signal ref to false.
 * @param {object} data - The chat message data.
 * @param {boolean} admin - Whether the message is from the admin or the user.
 * @param {boolean} signalRef - A ref to track whether the image preview was clicked or not.
 * @returns {JSX.Element} The rendered chat image preview.
 */
const RenderImgAdmin = ({ data, signalRef, admin }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);

  /**
   * Handles the click event for the chat image preview.
   * If the admin is the sender of the message, and the message is not a file, it sets the selected chat.
   * If the sender is the user, and the message is not a file, it sets the selected chat and sets the signal ref to false.
   * @param {object} event - The click event object.
   */
  const handleSetSelectedChat = (event) => {
    if (admin) {
      if (data.type === 'file') return;
      setSelectedChat(data);
      return;
    }

    if (signalRef?.current) {
      return;
    }
    if (data.type === 'file') return;
    setSelectedChat(data);
    signalRef.current = false;
  };

  /**
   * Handles the load event for the image preview.
   * Sets the loading state to false when the image is loaded.
   */
  const handleImgLoad = () => {
    setImgLoading(false);
  };

  return (
    <div role='button' onClick={handleSetSelectedChat}>
      <ImgPreview selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
      <div className='chat-img'>
        {data.type === 'image' && (
          <div>
            <img
              src={data.mediaUrl}
              onLoad={handleImgLoad}
              alt=''
              className='rounded-sm'
              style={{
                opacity: imgLoading ? '0.2' : '1',
              }}
            />
            {imgLoading && (
              <Skeleton
                variant='rectangular'
                sx={{
                  minWidth: '4rem',
                }}
                animation='wave'
              />
            )}
          </div>
        )}

        {data.type === 'file' && <RenderPdf data={data} />}
        {data.type === 'video' && <RenderVideo data={data} />}
      </div>
    </div>
  );
};

/**
 * Renders a link to a PDF.
 *
 * @param {object} data - The data to render a pdf. The data should have a mediaUrl
 *                        property that is the URL of the PDF.
 *
 * @returns {ReactElement} A link to the PDF.
 */
const RenderPdf = ({ data }) => {
  // console.log(data, '____pdf');
  const pdfName = data.mediaUrl?.split('/')?.pop() || '';
  const breakPdfName = pdfName?.split('.') || [];


  const fileName = breakPdfName?.at(0) || '';
  if(!fileName ){
    return null
  }
  return (
    <a href={data.mediaUrl} target='_blank' rel='noopener noreferrer'>
      <div className='chat-pdf'>
        {truncateText(fileName, 20)}
        pdf
      </div>
    </a>
  );
};

/**
 * Renders a video.
 *
 * @param {object} data - The data to render a video. The data should have a mediaUrl
 *                        property that is the URL of the video.
 *
 * @returns {ReactElement} The rendered video.
 */
const RenderVideo = ({ data }) => {
  // console.log(data, '____video_url');
  return (
    <div>
      <video className='rounded-sm h-auto' controls poster={data.thumbnail} role='img'>
        <source src={data.mediaUrl} type='video/mp4' class='custom-video' />
      </video>
    </div>
  );
};

/**
 * Renders an image preview modal.
 *
 * @param {object} selectedChat - The chat that contains the image to be previewed.
 * @param {function} setSelectedChat - A function to set the selectedChat state to null.
 *
 * @returns {ReactElement} The rendered image preview modal.
 */
const ImgPreview = ({ selectedChat, setSelectedChat }) => {
  const isMobile = useMediaQuery('(max-width: 699px)');
  // const [imgLoading, setImgLoading] = useState(true);
  const handleCloseModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedChat(null);
  };
  if (!selectedChat) return null;

  return (
    <div>
      <CustomModal
        openDialog={Boolean(selectedChat)}
        handleCloseDialog={handleCloseModal}
        isTitleRequired={true}
        isActionButtonRequired={true}
        className='dialog-modal-container dialog-modal-container-chat'
        title={''}
        disableClose={false}
        onClick={(e) => e.stopPropagation()}
        maxWidth={`${isMobile ? 'xl' : 'lg'}`}
      >
        <div className='flex items-center justify-center'>
          {selectedChat.type === 'image' && (
            <div>
              <img src={selectedChat.mediaUrl} loading='lazy' alt='' />
            </div>
          )}
          {selectedChat.type === 'video' && <RenderVideo data={selectedChat} />}
        </div>
      </CustomModal>
    </div>
  );
};

/**
 * LongPressButton
 *
 * @description A button that can be pressed both as a regular click and as a
 *              long press.
 *
 * @param {function} onLongPress The callback to be called when the button is
 *                               long pressed.
 * @param {function} [onClick] The callback to be called when the button is
 *                             clicked.
 * @param {number} [delay=500] The delay in milliseconds for the long press.
 * @param {*} children The content of the button.
 * @param {*} props Other props to be passed to the button.
 * @returns {ReactElement} The rendered button.
 */
const LongPressButton = ({ onLongPress, onClick = () => {}, delay = 500, children, ...props }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    let timer;
    if (isPressed) {
      timer = setTimeout(() => {
        onLongPress(currentTarget, event);
        setPressTimer(null);
      }, delay);
      setPressTimer(timer);
    }

    // Cleanup the timer if the component unmounts or the press ends
    return () => {
      clearTimeout(timer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPressed, onLongPress, delay]);

  const handlePressStart = (e) => {
    e.stopPropagation();
    setIsPressed(true);
    setCurrentTarget(e.currentTarget);
    setEvent(e);
  };

  const handlePressEnd = (e) => {
    e.stopPropagation();
    setEvent(e);
    setIsPressed(false);
    clearTimeout(pressTimer);
    if (pressTimer) {
      onClick(); // Trigger onClick if not a long press
    }
  };

  const handlePressCancel = (e) => {
    setEvent(e);
    e.stopPropagation();
    setIsPressed(false);
  };

  return (
    <div
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressCancel}
      onTouchStart={handlePressStart} // For mobile
      onTouchEnd={handlePressEnd} // For mobile
      onTouchMove={handlePressCancel} // Cancel if the user moves their finger
      onTouchCancel={handlePressCancel} // If touch is canceled
      {...props}
    >
      {children}
    </div>
  );
};
