import { East } from '@mui/icons-material';
import { CircularProgress, Fade, Popper, Skeleton, useMediaQuery } from '@mui/material';
import { getDeviceTypeNotation, sortDates } from 'helpers';
import React, { useEffect, useRef, useState, useContext, memo, useMemo } from 'react';
import { socket } from 'utils/socket';
import NoSubAdmin from './chat/NoSubAdmin';
import Header from './chat/Header';
import UserChat, { AdminChat, ContextMenu } from './chat/UserChat';
import OnboardingContext, { useGetUserId, useGetUserType } from 'context/OnboardingContext';
import useOutsideClick from 'Hook/useOutsideClick';
import { CHAT_MESSAGE_COUNT, IS_CHAT_OPEN } from 'constants/actions';
import SlidAnimation from 'components/animations/SlidAnimation';
import { uploadMultipleChatFiles } from 'services/api';
import { AttachedFile, ChatArea } from './chat/ChatArea';
import { useLocation } from 'react-router-dom';
export const initialSize = {
  width: 300,
  height: 390,
};
/**
 * A functional component that renders a chat box with a sliding animation.
 *
 * @param {object} children - The child elements to be rendered inside the chat box.
 * @return {JSX.Element} The JSX element representing the chat box.
 */
const ChatBox = ({ children }) => {
  // for chat open or not
  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);
  const location = useLocation();

  //chat size
  const [size, setSize] = useState(initialSize);

  // sender id
  const sender = useGetUserId();

  //  sender => user | guest
  const sender_type = useGetUserType();

  // name only imageInfo but it use img as well file info
  const [imageInfo, setImageInfo] = useState(null);
  const [chats, setChats] = useState([]);
  const isMobile = useMediaQuery('(max-width : 699px)');

  const getUnreadCount = (data) => {
    dispatchOnboardingForms({
      type: CHAT_MESSAGE_COUNT,
      payload: data?.result ? data?.result?.unreadCount : data?.unreadCount,
    });
  };

  const handleStatusChange = (data) => {
    // console.log('statusChange', data);
    // if (data.chat_status === 'offline') {
    //   dispatchOnboardingForms({
    //     type: IS_CHAT_OPEN,
    //     payload: false,
    //   });
    //   setChats([]);
    // }
  };
  const handleSocketUpdate = (data) => {
    // console.log('updateSocket', data);
    socket.emit('unreadCount', { sender });
  };

  useOutsideClick('chat-container', closePopup);

  /**
   * Closes the chat window if it is currently open. If the chat is not open, this does nothing.
   */
  function closePopup() {
    if (onboardingForms.isChatOpen.open) {
      dispatchOnboardingForms({ type: IS_CHAT_OPEN, payload: { open: false, isResize: false } });
    }
  }

  useEffect(() => {
    const handleUnreadCount = (data) => {
      // console.log('unreadCount__', data);
      getUnreadCount(data);
    };
    if (socket) {
      socket.emit('updateSocket', { sender, sender_type, chat_type: sender_type });
    }

    if (socket) {
      socket.on('unreadCount', handleUnreadCount);
      socket.on('updateSocket', handleSocketUpdate);
    }

    // Cleanup on component unmount
    return () => {
      if (socket) {
        socket.off('unreadCount', handleUnreadCount);
        socket.off('updateSocket', handleSocketUpdate);
      }
    };
    // eslint-disable-next-line
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.emit('statusChange', {
        sender,
        sender_type,
        type: onboardingForms.isChatOpen.open ? 'online' : 'idle',
      });

      socket.on('statusChange', handleStatusChange);
    }

    // Cleanup on component unmount
    return () => {
      if (socket) {
        socket.off('statusChange', handleStatusChange);
      }
    };
    // eslint-disable-next-line
  }, [onboardingForms.isChatOpen.open]);

  // close popup when location change
  useMemo(() => {
    closePopup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <>
      <div
        className={`chat-overlay ${
          isMobile && onboardingForms.isChatOpen.open ? '!block' : '!hidden'
        }`}
      ></div>
      <div id='chat-container' className='main-chat-wrapper'>
        <SlidAnimation
          // style={{
          //   backdropFilter: isMobile ? 'initial' : 'blur(50px)',
          // }}
          className='chat-main-container'
          open={onboardingForms.isChatOpen.open}
        >
          <ChatArea size={size} setSize={setSize}>
            <SiteChat
              size={size}
              setSize={setSize}
              // only img
              imageInfo={imageInfo}
              setImageInfo={setImageInfo}
              // only pdf

              // chat
              chats={chats}
              setChats={setChats}
            />
          </ChatArea>
        </SlidAnimation>
      </div>
    </>
  );
};

export default memo(ChatBox);

/**
 * Handles all the logic for the SiteChat component, including the chat messages,
 * the user's input, sending messages, receiving messages, and displaying the
 * conversation history.
 *
 * @param {Object} props - The props object containing the following properties:
 *   - size: The size of the chat box, either 'small', 'medium', or 'large'.
 *   - setSize: The function to set the size of the chat box.
 *   - setImageInfo: The function to set the image info.
 *   - imageInfo: The image info object containing the image files and media.
 *   - fileInfo: The file info object containing the file and media.
 *   - chats: The array of chat objects containing the message, sender, and receiver.
 *   - setChats: The function to set the chats array.
 */
const SiteChat = ({
  setImageInfo,
  imageInfo,

  // chats,
  // setChats,
}) => {
  const lastChat = useRef(null);
  const lastChatBottom = useRef(null);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const isMobile = useMediaQuery('(max-width : 699px)');

  const sender_type = useGetUserType();
  const sender = useGetUserId();

  const [message, setMessage] = useState('');
  const [receiver, setReceiver] = useState(null); // sub admin data
  const [group_id, setGroupId] = useState('');
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [editChat, setEditChat] = useState(null);
  const [imgUploading, setImgUploading] = useState(false);

  /**
   * if get id then subadmin is available or if get undefined then subadmin is not available
   * it's also used for while user type is guest
   * if guest then we send isSubAdminAvailable as false
   */
  const isSubAdminAvailable = receiver?.subadmin_id;
  const isGuestMode = sender_type === 'guest';
  const subAdminNotAvailable = !receiver?.subadmin_id && isGuestMode;
  const isSubAdminWithGuest = Boolean(!receiver?.subadmin_id) && isGuestMode; // if subadmin is not available and user type is guest then we send isSubAdminWithGuest as true

  // infinite scroll
  const [scrollInfo, setScrollInfo] = useState({
    page: 1,
    limit: 30,
    currentScroll: 0,
    loading: false,
    isFullScrolled: false,
  });

  const receiver_type = 'subadmin';
  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);
  useOutsideClick('chat-container', closePopup);

  /**
   * Closes the chat window if it is currently open. If the chat is not open, this does nothing.
   */
  function closePopup() {
    setAnchorEl(null);
    if (onboardingForms.isChatOpen.open) {
      dispatchOnboardingForms({ type: IS_CHAT_OPEN, payload: { open: false, isResize: false } });
    }
  }

  /**
   * Sets the receiver (sub-admin) in the chat window to the given data.
   * Then calls initChat to initialize the chat with the receiver.
   * @param {object} data - The sub-admin data.
   */
  const getSubAdmin = (data) => {
    setReceiver(data?.result);
    initChat(data?.result?.subadmin_id);
  };

  /**
   * Initializes the chat by sending an initChat event to the server with the given receiver's id.
   * If the socket is not initialized, the sender is not set, or the receiver is not set, this does nothing.
   * @param {object} receiver - The sub-admin data.
   */
  const initChat = (subadmin_id = '') => {
    if (socket && sender) {
      socket.emit('initChat', {
        sender,
        sender_type,
        receiver: subadmin_id,
        receiver_type,
        device_type: getDeviceTypeNotation(),
      });
    }
  };
  // groupId = group_id

  /**
   * Handles the change event of the chat message input by setting the message to the event target's value.
   * @param {object} event - The change event object.
   */
  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  /**
   * Handles the getConversationList event by setting the chat messages and
   * updating the scroll info. If the data is empty, it sets the isFullScrolled
   * state to true. If the data is not empty, it adds the new messages to the
   * chat messages array and updates the scroll info by setting the new page
   * number. It also scrolls to the bottom of the chat if the page is 1.
   * @param {object} data - The data object from the getConversationList event.
   * @param {number} page - The page number of the getConversationList event.
   */
  const getConversationListHandler = (data, page) => {
    setScrollInfo((prev) => {
      return {
        ...prev,
        loading: false,
      };
    });

    if (data?.result?.length === 0) {
      setScrollInfo((prev) => {
        return {
          ...prev,
          isFullScrolled: true,
        };
      });
    }

    if (data.result.length > 0) {
      setChats((prev) => {
        const findDuplicate = prev.find((ele) => ele?._id === data?.result[0]?._id);
        if (findDuplicate) {
          return prev;
        }
        const result = [...data?.result, ...prev];
        const sorted = sortDates(result, 'createdAt');
        return sorted;
      });

      setScrollInfo((prev) => {
        if (prev.page <= 1) {
          //setting timeout for first time for go to bottom of chat
          containerRef.current.scrollTop = containerRef.current.scrollHeight + 100;
          // setTimeout(() => {
          // scrollToBottomLast();
          // }, 1000 * 1);
        } else {
          scrollToBottom();
        }
        return {
          ...prev,
          page: prev.page + 1,
        };
      });
    }
    // scrollToBottom();
  };

  /**
   * Fetches the old chat messages from the server.
   * @param {number} receiverId - The id of the receiver (sub-admin).
   * @param {object} _ - Unused parameter.
   * @param {number} page - The page number of the getConversationList event.
   * @return {void}
   */
  const getOldChat = (receiverId, _, page) => {
    if (socket && receiverId) {
      setScrollInfo((prev) => {
        return {
          ...prev,
          loading: true,
        };
      });
      socket.emit('getConversationList', {
        sender: sender,
        receiver: receiverId,
        sender_type,
        limit: scrollInfo.limit,
        page: page,
      });
      socket.emit('readAllMessages', {
        sender: sender,
        receiver: receiverId,
        sender_type,
        isSubAdminAvailable: Boolean(isSubAdminAvailable),
      });
    }
  };

  /**
   * Scrolls the chat box to the bottom.
   * @return {void}
   */
  const scrollToBottom = () => {
    const div = lastChat.current;
    if (div) {
      div.scrollIntoView();
    }
  };

  /**
   * Scrolls the chat box to the bottom, but it is not smooth.
   * @return {void}
   */
  const scrollToBottomLast = () => {
    const div = lastChatBottom.current;
    if (div) {
      // div.scrollIntoView({ behavior: 'smooth' });
      div.scrollIntoView();
    }
  };

  /**
   * Uploads multiple files to the server, given the image data.
   * @param {object} imgData - The image data object, which contains the files and media types.
   * @return {Promise<object>} The response object returned by the server, which contains the uploaded file paths.
   */
  const uploadFiles = async (imgData) => {
    if (!imgData) return null;
    setImgUploading(true);

    const files = imgData.files; // Use existing formData
    const formData = new FormData();
    const type = imgData.media.map((i) => i.type);
    for (let i = 0; i < files.length; i++) {
      // Assuming formData is an array
      formData.append('files', files[i]);
    }
    formData.append('type', JSON.stringify(type));

    return await uploadMultipleChatFiles(formData);
  };

  /**
   * Sends a message to the server, either a text message or media message.
   * @param {object} e - The event object from the click event.
   * @return {Promise<void>} The promise that resolves when the message is sent.
   */
  const sendMessage = async (e) => {
    e.stopPropagation();
    textareaRef.current.focus();

    const result = await uploadFiles(imageInfo);

    setImgUploading(false);
    setImageInfo(null);
    const media =
      result &&
      result?.data?.data.map((ele) => {
        return {
          thumbnail: '',
          mediaUrl: ele.key,
          type: ele.type,
        };
      });

    if ((message?.trim() && socket && group_id) || media?.length > 0) {
      socket.emit('sendMessage', {
        sender,
        receiver: group_id,
        sender_type,
        message: message?.trim() || '',
        message_type: media ? 'media' : 'text',
        media: media,
        isSubAdminAvailable: Boolean(isSubAdminAvailable),
      });

      // setChats((chats) => [...chats, { sender_type, message: message?.trim() }]);
      setMessage('');
      scrollToBottomLast();
    }
  };

  /**
   * Handles the response of the unsendMessage event from the server.
   * @param {object} data - The response object from the server, which contains the result of the unsendMessage event.
   * @return {void}
   */
  const resUnsendMessage = (data) => {
    console.log(data, 'unsendMessage');
    if (data?.result) {
      setChats((chats) => {
        return chats.filter((ele) => ele?._id !== data?.result?._id);
      });
    }
  };

  /**
   * Handles the unsend message event.
   * Emits the 'unsendMessage' event to the server, passing the sender, group_id, sender_type, and the message id.
   * Then, it filters the chats array to remove the message that was just unsend.
   * @return {Promise<void>} The promise that resolves when the message is removed from the chats array.
   */
  const handleUnsendMessage = async () => {
    // for close modal
    setAnchorEl(null);
    if (socket && group_id) {
      socket.emit('unsendMessage', {
        sender,
        group_id,
        sender_type,
        messageId: selectedChat?._id,
        isSubAdminAvailable: Boolean(isSubAdminAvailable),
      });
      setChats((chats) => {
        return chats.filter((ele) => ele?._id !== selectedChat?._id);
      });
    }
  };

  function handleCloseHeader(event) {
    // const clickedElement = event.target;
    // console.log(clickedElement.id, 'getting_event');

    event.stopPropagation();
    setOpen(false);
    // setAnchorEl(null);
    // setContextMenu((pre) => {
    //   return { ...pre, visible: false };
    // });
  }

  const getAdminName = `${receiver?.first_name || ''} ${receiver?.last_name || ''}`;

  /**
   * Handle clear image function.
   *
   * @param {Event} e - The event object.
   * @return {void}
   */
  const handleClearImage = (e, media, index) => {
    e.stopPropagation();
    setImageInfo((pre) => {
      // Remove file
      let newFiles = [];
      for (let i = 0; i < pre.files.length; i++) {
        if (i !== index) {
          newFiles.push(pre.files[i]);
        }
      }
      return {
        ...pre,
        files: newFiles,
        media: pre.media.filter((item, i) => i !== index),
      };
    });
  };

  // Function to adjust the height of the textarea
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on content
    }
  };

  /**
   * Handle scroll event for chat messages.
   *
   * @param {Event} e - The event object.
   *
   * If the user has scrolled to the top of the message list and there is a receiver
   * subadmin id, then get the older chat messages from the server.
   */
  const handleScroll = (e) => {
    // setScrollTop(e.target.scrollTop);
    if (e.target.scrollTop === 0 && isSubAdminAvailable) {
      getOldChat(group_id, isSubAdminAvailable, scrollInfo.page);
    }
  };

  const handleContextMenu = (event, data) => {
    // if(event){}
    // event.preventDefault(); // Prevent default context menu from showing
    // event.stopPropagation();

    // console.log(event.currentTarget, 'data____');
    // // setAnchorEl(event.currentTarget);

    // const rect = event.target.getBoundingClientRect();
    // setContextMenu({
    //   top: rect.top,
    //   left: rect.left,
    //   visible: true,
    // });
    setSelectedChat(data);
  };

  /**
   * Handle the result of editing a message.
   *
   * @param {object} data - The result of editing a message, containing the updated message content.
   *
   * If the result is not null, then update the chat message list with the new content.
   */
  const handleEditMessageResult = (data) => {
    console.log('handleEditMessage', data);
    if (data.result) {
      setChats((prevChats) => {
        return prevChats.map((chat) =>
          chat._id === data.result._id
            ? { ...chat, ...data?.result } // Update the content of the chat message
            : chat,
        );
      });
    }
  };

  /**
   * Handles the event when the user wants to update a chat message.
   *
   * @param {Event} event - The event object.
   * @param {string} message - The updated content of the chat message.
   * @param {object} chatData - The chat data object containing the message id.
   *
   * If the message is not empty, then update the chat message list with the new content.
   * Then, it emits the 'editMessage' event to the server, passing the sender, group_id, messageId, newContent, and sender_type.
   */
  const handleUpdateMessage = (event, message, chatData) => {
    if (message?.trim() === '') {
      return;
    }
    setEditChat(null);
    if (socket && receiver) {
      // sender, group_id, messageId, newContent, sender_type
      socket.emit('editMessage', {
        sender: sender,
        receiver: receiver.subadmin_id,
        group_id,
        sender_type,
        newContent: message?.trim(),
        messageId: chatData?._id,
        isSubAdminAvailable: Boolean(isSubAdminAvailable),
      });

      setChats((prevChats) => {
        return prevChats.map((chat) =>
          chat._id === chatData._id
            ? { ...chat, message: message?.trim() } // Update the content of the chat message
            : chat,
        );
      });
    }
  };

  /**
   * Handles the event when the user marks all messages as read.
   *
   * @param {object} data - The response data from the server.
   *
   * Logs the received data to the console and dispatches an action to set the
   * chat message count to 0.
   */
  const resReadAllMessage = (data) => {
    console.log(data, 'resReadAllMessage');
    dispatchOnboardingForms({
      type: CHAT_MESSAGE_COUNT,
      payload: 0,
    });
  };

  /**
   * Handles the result of editing a message.
   *
   * @param {object} data - The result of editing a message, containing the updated message content.
   *
   * If the result is not null, then update the chat message list with the new content.
   */
  const handleEditMessage = (data) => {
    handleEditMessageResult(data);
  };

  /**
   * Handles the result of reading all messages.
   *
   * @param {object} data - The response data from the server.
   *
   * Logs the received data to the console and dispatches an action to set the
   * chat message count to 0.
   */
  const readAllMessage = (data) => {
    resReadAllMessage(data);
  };

  /**
   * Handles the result of un-sending a message.
   *
   * @param {object} data - The response data from the server.
   *
   * Logs the received data to the console and dispatches an action to set the
   * chat message count to the received value.
   */
  const unsendMessageRes = (data) => {
    resUnsendMessage(data);
  };

  /**
   * Handles new conversations from the server.
   *
   * @param {object} data - The new conversation data from the server.
   *
   * Calls the getConversationListHandler function with the received data to update the conversation list.
   */
  const handleNewConversations = (data) => {
    getConversationListHandler(data);
  };

  const connectionHandler = () => console.log('connected');

  /**
   * Removes duplicate objects in an array by their `_id` property.
   *
   * @param {object[]} array - The array of objects to remove duplicates from.
   * @returns {object[]} The filtered array of objects with no duplicates.
   */
  const removeDuplicatesById = (array) => {
    const seen = new Set();

    return array.filter((item) => {
      const duplicate = seen.has(item._id);
      seen.add(item.id);
      return !duplicate; // Keep only the first occurrence of each id
    });
  };

  /**
   * Handles new messages from the server.
   *
   * @param {object} data - The new message data from the server.
   *
   * If the message is not from the user or guest, updates the chat message list with the new message.
   * Scrolls to the bottom of the chat box after adding the new message.
   * Emits the 'readMessage' event to the server with the sender, message id, receiver, and sender type.
   */
  const receiveMessageHandler = (data) => {
    const ifUser = data?.result?.sender_type === 'user' || data?.result?.sender_type === 'guest';
    if (!ifUser) {
      setChats((chats) => {
        const newData = removeDuplicatesById([...chats, data?.result]);
        return newData.map((chat) => {
          if (chat._id === data?.result?._id) {
            return data?.result;
          }
          return chat;
        });
      });
      scrollToBottomLast();

      socket.emit('readMessage', {
        sender,
        sender_type,
        messageId: data?.result?._id,
        receiver: isSubAdminAvailable,
        isSubAdminAvailable: Boolean(isSubAdminAvailable),
      });
    }
  };

  /**
   * Handles the 'initChat' event from the server. If the data contains a valid group id, sets it as the current group id and fetches the old messages for the group.
   * @param {object} data - The data from the server containing the group id.
   * @returns {void}
   */
  const handleInitChat = (data) => {
    if (data?.result?._id) {
      setGroupId(data?.result?._id || '');
      getOldChat(data?.result?._id, isSubAdminAvailable, 0);
    }
  };

  /**
   * Handles the 'readMessage' event from the server.
   *
   * @param {object} data - The data from the server containing the read message.
   * @returns {void}
   */
  const handleReadMessage = (data) => {
    console.log('message_read', data);
  };

  /**
   * Handles the 'subadminStatusUpdated' event from the server.
   *
   * Sends the 'subadminAvailability' event to the server with the sender's id.
   *
   * @param {object} data - The data from the server containing the sub-admin's status.
   * @returns {void}
   */
  const handleSubadminStatusUpdated = (data) => {
    socket.emit('subadminAvailability', {
      sender,
    });
  };

  /**
   * Handles the 'statusChange' event from the server. If the sub-admin's status changes to offline, it clears the chat messages array.
   * Then sends the 'subadminAvailability' event to the server with the sender's id.
   *
   * @param {object} data - The data from the server containing the sub-admin's status.
   * @returns {void}
   */
  const handleStatusChange = (data) => {
    console.log(data, 'this_data_status_changed');
    if (data.chat_status === 'offline') {
      setChats([]);
    }
    socket.emit('subadminAvailability', {
      sender,
    });
    // if (data.chat_status === 'offline'){

    // }
  };

  /**
   * Handles keydown events on the chat input field. If the Enter key is pressed, sends the message.
   * If the Shift key is pressed with Enter, does nothing. If the Alt key is pressed with Enter, adds a newline to the input.
   * If the input field is empty and an image is selected, does nothing.
   * @param {KeyboardEvent} event - The keydown event.
   * @returns {void}
   */
  const handleKeyDown = (event) => {
    if (isMobile || imgUploading) return;
    // event.nativeEvent.shiftKey
    console.log('event_d', event?.target?.value);
    if (event.key === 'Enter') {
      if (!event.altKey && !event.shiftKey) {
        event.preventDefault(); // Prevent the newline from being added
      }
      if (event.altKey) {
        setMessage((pre) => {
          return pre + '\n';
        });
        return;
      }

      if (event.shiftKey) {
        console.log('Shift+Enter pressed');
        return;
      }
      if (!imageInfo && event.target?.value?.trim() === '') {
        // if you select img and want to send when press enter
        return;
      } else {
        sendMessage(event);
      }
    }
  };

  /**
   * Handles the 'sendMessage' event from the server. If the message is a new message, updates the chat message list with the new message.
   * Scrolls to the bottom of the chat box after adding the new message.
   * @param {object} data - The data from the server containing the new message.
   * @returns {void}
   */
  const handleSendMessage = (data) => {
    if (data?.result) {
      setChats((chats) => {
        const newData = removeDuplicatesById([...chats, data?.result]);
        return newData.map((chat) => {
          if (chat._id === data?.result?._id) {
            return data?.result;
          }
          return chat;
        });
      });
      scrollToBottomLast();
    }
  };

  /**
   * Handles a click outside of the Popper element. If the element that was
   * clicked is not the Popper element itself, closes the Popper.
   *
   * @param {MouseEvent} event The event that triggered this function.
   */
  const handleClickOutside = (event) => {
    console.log('clickedElement___', event);
    setAnchorEl(false);
    // if (popperRef.current && !popperRef.current.contains(event.target)) {
    //   setAnchorEl(false); // Close the Popper
    // }
  };

  useEffect(() => {
    adjustHeight();
  }, [message]);

  useEffect(() => {
    if (socket) {
      // emit the subadminAvailability event
      socket.emit('subadminAvailability', {
        sender,
      });

      // initChat();

      //TODO: connection is not working
      socket.on('connection', connectionHandler);
      socket.on('subadminAvailabilityResponse', getSubAdmin);
      socket.on('receiveMessage', receiveMessageHandler);
      socket.on('sendMessage', handleSendMessage);
      socket.on('getConversationList', handleNewConversations);
      socket.on('unsendMessage', unsendMessageRes);
      socket.on('readAllMessages', readAllMessage);
      socket.on('editMessage', handleEditMessage);
      socket.on('readMessage', handleReadMessage);
      socket.on('initChat', handleInitChat);
      socket.on('subadminStatusUpdated', handleSubadminStatusUpdated);
      socket.on('statusChange', handleStatusChange);
    }

    return () => {
      socket.off('connection', connectionHandler);
      socket.off('subadminAvailabilityResponse', getSubAdmin);
      socket.off('receiveMessage', receiveMessageHandler);
      socket.off('sendMessage', handleSendMessage);
      socket.off('getConversationList', handleNewConversations);
      socket.off('unsendMessage', unsendMessageRes);
      socket.off('readAllMessages', readAllMessage);
      socket.off('editMessage', handleEditMessage);
      socket.off('readMessage', handleReadMessage);
      socket.off('initChat', handleInitChat);
      socket.off('subadminStatusUpdated', handleSubadminStatusUpdated);
      socket.off('statusChange', handleStatusChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  useEffect(() => {
    if (_open) {
      containerRef.current.addEventListener('mousedown', handleClickOutside);
    } else {
      containerRef.current?.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      containerRef?.current?.removeEventListener('mousedown', handleClickOutside);
    };
  }, [_open]);

  useEffect(() => {
    if (!subAdminNotAvailable) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [onboardingForms.isChatOpen.open, isSubAdminAvailable, subAdminNotAvailable]);

  /**
   * Returns the color of the arrow in the chat input box.
   *
   * If the input is focused, or if there is a message or image in the input, the arrow is gray (#BFBFBF).
   * If the user is a guest user, the arrow is light gray (rgba(122, 122, 122, 0.1)).
   * Otherwise, the arrow is dark gray (#7A7A7A).
   * @returns {string} The color of the arrow as a hex string.
   */
  const arrowColor = () => {
    if (isFocused || message?.trim() !== '' || imageInfo?.media?.length) {
      return '#BFBFBF';
    }
    if (subAdminNotAvailable) {
      return 'rgba(122, 122, 122, 0.1)';
    }
    return '#7A7A7A';
  };

  /**
   * Returns true if the offline screen should be shown.
   * This is the case if the user is a guest and the sub-admin is not available,
   * or if the user is not a guest and the sub-admin is not available and there are no chats.
   * @returns {boolean} Whether the offline screen should be shown.
   */
  const showOfflineScreen = () => {
    // handle guest
    if (isGuestMode && subAdminNotAvailable) {
      return true;
    }
    // handle user
    if (!isSubAdminAvailable && !isGuestMode && chats?.length === 0) {
      return true;
    }
    return false;
  };

  return (
    <div
      className={`chat-box-resized-wrap !flex-1 ${
        !subAdminNotAvailable ? '!overflow-y-scroll' : '!overflow-y-visible'
      }`}
      ref={containerRef}
      id='chat-box-resized-wrap'
      onScroll={handleScroll}
    >
      <Header
        open={open}
        setOpen={setOpen}
        getAdminName={getAdminName}
        setImageInfo={setImageInfo}
        receiver={receiver}
        isGuestUser={subAdminNotAvailable}
      />

      <div className={`chat-area ${subAdminNotAvailable && '!block'}`} onClick={handleCloseHeader}>
        {/* Not getting subadmin */}
        {showOfflineScreen() && (
          <NoSubAdmin isSubAdminWithGuest={isSubAdminWithGuest} isGuestMode={isGuestMode} />
        )}

        {/* Chat loaded successfully */}
        {isSubAdminWithGuest
          ? ''
          : chats?.length > 0 && (
              <div className='user-chat-area-wrap'>
                {/* When the loading is true, show the skeleton */}
                {scrollInfo.loading && <Skeleton animation='wave' className='chat-skeleton' />}
                <div>
                  {chats.map((chat, index) => {
                    return (
                      <>
                        {scrollInfo.limit === index && !scrollInfo.isFullScrolled && (
                          <div className='chat-scroll-point' ref={lastChat} key={'lastChat'}></div>
                        )}
                        {chat.sender_type !== sender_type ? (
                          <AdminChat chat={chat} setChats={setChats} />
                        ) : (
                          <UserChat
                            handleContextMenu={handleContextMenu}
                            setSelectedChat={setSelectedChat}
                            chat={chat}
                            editChat={editChat}
                            selectedChat={selectedChat}
                            handleUpdateMessage={handleUpdateMessage}
                            setAnchorEl={setAnchorEl}
                          />
                        )}
                      </>
                    );
                  })}
                </div>
                <div key={'lastChatBottom'} id='lastChatBottom' ref={lastChatBottom}></div>

                {/* User Edit and Unsend Message Context Menu */}
                <Popper id={id} open={_open} anchorEl={anchorEl} placement='right-end'>
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps}>
                      <ContextMenu
                        visible={anchorEl}
                        setAnchorEl={setAnchorEl}
                        setEditChat={setEditChat}
                        selectedChat={selectedChat}
                        handleUnsendMessage={handleUnsendMessage}
                      />
                    </Fade>
                  )}
                </Popper>
              </div>
            )}
      </div>

      {/* Chat footer */}
      {/*  */}
      <div className={`w-full chat-msg-send-wrap ${subAdminNotAvailable && 'pointer-events-none'}`}>
        <div className='text-area-chat relative px-3 py-2'>
          <div className='attach-wrapper'>
            <AttachedFile data={imageInfo} handleClearFile={handleClearImage} />
          </div>
          <textarea
            ref={textareaRef}
            placeholder={!subAdminNotAvailable && 'Type your message'}
            value={message}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className='messagearea'
            disabled={subAdminNotAvailable}
            rows={1}
          />
          {/* imgUploading */}
          <div
            className='send-msg-wrap'
            style={{
              backgroundColor: imgUploading || !isMobile ? 'transparent' : arrowColor(),
            }}
          >
            {imgUploading ? (
              <CircularProgress size={16} className=' !text-[12px] chat-send-loader' />
            ) : (
              <East
                className=' !text-[12px] chat-send-button'
                style={{
                  fill: isMobile ? 'currentColor' : arrowColor(),
                }}
                onClick={sendMessage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
