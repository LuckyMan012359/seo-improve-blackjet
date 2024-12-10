import React, { useContext, useEffect, useRef, useState } from 'react';
import { ExpandMore } from '@mui/icons-material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import { capitalizeString } from 'helpers';
import { useMediaQuery } from '@mui/material';
import { documentIcon, photoAtt, takePhoto } from './icon';
import { ListWithIcon } from 'components/feeback/Menu';
import OnboardingContext from 'context/OnboardingContext';
import { IS_CHAT_OPEN } from 'constants/actions';
import CustomModal from 'components/modal/CustomModal';
import CommonButton from 'components/formcomponents/CommonButton';
import LoopIcon from '@mui/icons-material/Loop';
import Webcam from 'react-webcam';

/**
 * Header component of the chat window, which renders the name of the admin or subadmin
 * with whom the user is chatting, and provides a way to attach a file or take a photo
 * to send to the admin or subadmin, as well as a way to close the chat window.
 *
 * @prop {() => string} getAdminName - A function that returns the name of the admin or
 * subadmin with whom the user is chatting.
 * @prop {boolean} open - A boolean indicating whether the chat window is currently open.
 * @prop {(open: boolean) => void} setOpen - A function to set the open state of the chat
 * window.
 * @prop {(formData: FormData, files: FileList) => void} setImageInfo - A function to
 * set the image info state with the selected files.
 * @prop {(formData: FormData, files: FileList) => void} setFileInfo - A function to
 * set the file info state with the selected files.
 * @prop {Receiver} receiver - The admin or subadmin with whom the user is chatting.
 * @return {JSX.Element} The Header component.
 */
const Header = ({
  getAdminName,
  open,
  setOpen,
  setImageInfo,

  receiver,
  isGuestUser,
}) => {
  const isMobile = useMediaQuery('(max-width : 699px)');
  const containerRef = useRef(null);
  const { onboardingForms, dispatchOnboardingForms } = useContext(OnboardingContext);

  const [showModal, setShowModal] = useState(false);

  const handleOpen = (event) => {
    event.stopPropagation();
    setOpen((prevState) => !prevState);
  };
  /**
   * Closes the chat window if it is currently open. If the chat is not open, this does nothing.
   */
  function closeChat() {
    if (onboardingForms.isChatOpen.open) {
      dispatchOnboardingForms({ type: IS_CHAT_OPEN, payload: { open: false, isResize: false } });
    }
  }

  const handleClose = () => {
    closeChat();
  };

  /**
   * Sets the show modal state to true, which will open the modal dialog for taking a photo or choosing a file.
   */
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = (e) => {
    // get video by id
    const video = document.getElementById('desktop-camera-video');

    if (video && video.srcObject) {
      // close camera
      video.srcObject.getTracks().forEach((track) => track.stop());
      video.srcObject = null; // Clear the video stream
    }
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowModal(false);
  };

  const fileChange = (e, typeDef, setState) => {
    const files = e.target.files; // Get all selected files

    if (files.length > 0) {
      // Create an array to store image information
      const imageInfoArray = [];

      const formData = new FormData();

      // Loop through the selected files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Create a URL for each file
        const url = URL.createObjectURL(file);
        // type
        const type = file?.type?.split('/')[0] || 'image';

        // Append each file to FormData
        formData.append(`${type}[]`, file); // 'images[]' allows server-side processing of multiple files

        // Add each file's info to the array
        imageInfoArray.push({
          name: file.name,
          url: url,
          type: typeDef,
        });
      }

      // Update the state with image info
      setState(
        { media: imageInfoArray, formData, files }, // Store multiple images
      );
    }
  };

  /**
   * Handles photo change event.
   * @param {Event} e - The event that triggered the function.
   * @param {string} type - The type of the media (image, video, etc.).
   */
  const onPhotoChange = (e, type) => {
    fileChange(e, type, setImageInfo);
  };

  const photoChoose = {
    icon: photoAtt,
    title: 'Choose a photo',
    accept: 'image/*',
    multiple: true, // Assuming single photo selection
    onChange: (e) => onPhotoChange(e, 'image'),
  };

  const fileChoose = {
    icon: documentIcon,
    title: 'Choose a file',
    accept: '.pdf',
    multiple: true,
    onChange: (e) => onPhotoChange(e, 'file'),
  };
  const camChoose = {
    icon: takePhoto,
    title: 'Take a photo',
    accept: '.pdf',
    multiple: true,
    onChange: (e) => handleOpenModal(),
    onClick: handleOpenModal,
  };


  return (
    <>
      {!isMobile && (
        <CustomModal
          openDialog={showModal}
          handleCloseDialog={handleCloseModal}
          isTitleRequired={true}
          isActionButtonRequired={true}
          className='dialog-modal-container'
          title={''}
          disableClose={false}
          onClick={(e) => e.stopPropagation()}
          maxWidth='xs'
        >
          <CameraComponent setImageInfo={setImageInfo} handleCloseModal={handleCloseModal} />
        </CustomModal>
      )}
      {isMobile && showModal && (
        <MobileCamera handleCloseModal={handleCloseModal} setImageInfo={setImageInfo} />
      )}
      <div className='chat-header-wrap'>
        <div
          className={`${
            open ? 'attach-file-container-open' : 'attach-file-container-close'
          } attach-file-container`}
          ref={containerRef}
          style={{ maxHeight: open ? containerRef?.current?.scrollHeight : 0 }}
        >
          <ul className='attach-file-list' onClick={() => setOpen(false)}>
            <ListWithIcon data={fileChoose} />
            <ListWithIcon data={photoChoose} />
            <ListWithIcon data={camChoose} isInput={false} />
          </ul>
        </div>
        <div className='chat-header-container'>
          <div className=' flex h-[35px] items-center justify-between relative w-full px-2'>
            {isMobile ? (
              <CloseIcon onClick={handleClose} className='cursor-pointer' />
            ) : (
              <ExpandMore onClick={handleClose} className='' />
            )}

            {(!receiver?.subadmin_id) && (
              <div className='chat-offline-container'>
                <div className='chat-circle'></div>
                <p className='chat-offline-text'>Offline</p>
              </div>
            )}

            {/* {!receiver?.subadmin_id && !isGuestUser && (
              <p className='text-[#DEDEDE]'>
                Chat {getAdminName && ' With '}
                <span className='font-black'>
                  BLACK JET
                  <sup className='ml-1'>GPT</sup>
                </span>
              </p>
            )} */}
            {receiver?.subadmin_id && (
              <p className='text-[#DEDEDE]'>
                Chat {getAdminName && ' With '}
                <span className='font-black'> {capitalizeString(getAdminName)}</span>
              </p>
            )}

            {
              <div className='rotate-45' onClick={handleOpen}>
                {!isGuestUser && <AttachFileIcon />}
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * CameraComponent renders a camera view and a capture button. It also handles
 * the camera permission and capture logic. It takes two props: setImageInfo and
 * handleCloseModal. The setImageInfo prop is a function that will be called with
 * the captured image as an argument. The handleCloseModal prop is a function that
 * will be called when the capture button is clicked.
 */
export function CameraComponent({ setImageInfo, handleCloseModal }) {
  const [capturedImage, setCapturedImage] = useState(null);
  const [camLoading, setCamLoading] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const _canvas = canvasRef.current;

  console.log(capturedImage, 'capturedImage__');

  const handleCameraPermission = async () => {
    try {
      setCamLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCamLoading(false);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCamLoading('error');
    }
  };

  /**
   * handleSend stops the video stream and sends the captured image to the
   * setImageInfo function as a blob. It also resets the capturedImage state.
   */
  const handleSend = () => {
    // Stop the video stream
    try {
      videoRef.current.srcObject?.getTracks().forEach((track) => track.stop());
      if (capturedImage) {
        _canvas.toBlob(function (blob) {
          setImageInfo({
            media: [{ url: capturedImage, name: 'capturedImage', type: 'image' }],
            files: [blob],
          });
        }, 'image/jpeg');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
    // Reset captured image state
    setCapturedImage(null);
  };

  /**
   * Captures an image from the video stream and sets the capturedImage state to
   * the base64 representation of the image.
   */
  const handleCapture = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg');
    // const formData = new FormData();

    // console.log({ formData, imageData }, 'image_data__');
    // const blob = canvas.toBlob(function(blob) {
    //   setCapturedImage(blob);
    // }, 'image/jpeg');
    // console.log(blob, 'blob__')
    setCapturedImage(imageData);
  };

  useEffect(() => {
    handleCameraPermission();
  }, []);

  return (
    <div className='camera-container'>
      {camLoading && <div>Loading...</div>}
      {capturedImage && <img src={capturedImage} alt='CapturedImage' />}
      <video
        ref={videoRef}
        id={'desktop-camera-video'}
        autoPlay
        style={{
          display: capturedImage ? 'none' : 'block',
          transform: 'scaleX(-1)',
        }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className='camera-buttons'>
        {/* <CommonButton onClick={handleCameraPermission} text={'Open Camera'} /> */}
        <CommonButton
          onClick={handleCapture}
          text={'Capture Photo'}
          // error={videoRef.current?.srcObject ? false : true}
          // disabled={videoRef.current?.srcObject ? false : true}
        />
        <CommonButton
          onClick={handleSend}
          text={'Send Photo'}
          pressedClass='pressed-arrow'
          className='dark-btn'
          error={capturedImage ? false : true}
          disabled={capturedImage ? false : true}
        />
      </div>
    </div>
  );
}

/**
 * MobileCamera component
 *
 * This component renders a mobile camera interface with a 'Take Photo' button and
 * a 'Use Photo' button. When the 'Take Photo' button is clicked, the component takes
 * a photo using the device's camera and displays it in the interface. When the
 * 'Use Photo' button is clicked, the component sends the captured photo to the
 * server.
 *
 * @param {function} handleCloseModal - A function to close the modal
 * @param {function} setImageInfo - A function to set the image info on the server
 */
const MobileCamera = ({ handleCloseModal, setImageInfo }) => {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' for front camera, 'environment' for back camera
  const [capturedImage, setCapturedImage] = useState(null);

  /**
   * Switches the camera to the opposite one (front or back). If the camera is
   * currently using the front camera, it switches to the back camera, and vice versa.
   */
  const handleSwitchCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };

  const handleCapture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  // const handleCapture = () => {
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   setCapturedImage(imageSrc);
  // };

  /**
   * Resets the capturedImage state to null, effectively
   * "recapturing" the image from the camera.
   */
  const handleRecapture = () => {
    setCapturedImage(null);
  };

  /**
   * Converts a data URL to a Blob
   * @param {string} dataURL - The data URL to convert
   * @returns {Blob} The Blob representation of the data URL
   */
  const dataURLtoBlob = (dataURL) => {
    const binaryString = window.atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const arr = new Uint8Array(binaryString.length);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = binaryString.charCodeAt(i);
    }
    return new Blob([arr], { type: mimeString });
  };

  /**
   * Stops the video stream and sends the captured image to the
   * setImageInfo function as a blob. It also resets the capturedImage state.
   * @param {Event} e - The event that triggered this function
   */
  const handleSend = (e) => {
    // Stop the video stream
    try {
      if (capturedImage) {
        // Convert the image data URL to a Blob
        const imageBlob = dataURLtoBlob(capturedImage);

        setImageInfo({
          media: [{ url: capturedImage, name: 'capturedImage', type: 'image' }],
          files: [imageBlob],
        });
      }
      setCapturedImage(null);
      handleCloseModal(e);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  return (
    <div className='mobile-camera-container'>
      <div className='camera-area'>
        {capturedImage && <img src={capturedImage} alt='CapturedImage' />}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat='image/jpeg'
          videoConstraints={{ facingMode }}
          mirrored={true}
          style={{
            display: capturedImage ? 'none' : 'block',
          }}
        />
      </div>
      <div className='camera-buttons'>
        {capturedImage ? (
          <div className='camera-cancel' onClick={handleRecapture}>
            Retake
          </div>
        ) : (
          <div className='camera-cancel' onClick={handleCloseModal}>
            Cancel
          </div>
        )}

        {capturedImage ? (
          <div></div>
        ) : (
          <div className='camera-capture' onClick={handleCapture} role='button'>
            <div className='camera-capture-circle'></div>
          </div>
        )}

        {capturedImage ? (
          <div className='camera-cancel' onClick={handleSend}>
            Use Photo
          </div>
        ) : (
          <div
            className='camera-rotation'
            style={{
              transform: `rotate(${facingMode === 'user' ? 0 : 180}deg)`,
            }}
            onClick={handleSwitchCamera}
          >
            <LoopIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
