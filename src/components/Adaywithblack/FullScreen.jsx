// import { styled } from '@mui/material/styles';
// import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
// import ReactPlayer from 'react-player';
import { memo, useEffect, useRef, useState } from 'react';
import { secondsToMMSS } from 'utils/moment';
import Slider from 'rc-slider';
// import { useNavigate } from 'react-router-dom';
import { Img } from 'components';
import { aDayWithBlackJetVideo } from 'assets';

/**
 * FullScreen component
 *
 * @param {boolean} fullVideoVisible - whether the video is visible in full screen
 * @param {function} setFullVideoVisible - function to set fullVideoVisible state
 * @param {function} setIsFull - function to set full screen state
 * @param {boolean} isFull - whether the video is in full screen
 *
 * @returns {JSX.Element} - the FullScreen component
 */
const FullScreen = ({
  fullVideoVisible = false,
  setFullVideoVisible = () => {},
  setIsFull,
  isFull,
}) => {
  const [played, setPlayed] = useState(0);
  const [totalDuration] = useState(96);

  const [mute, setMute] = useState(false);
  const [playing, setPlaying] = useState(true);
  const playerRef = useRef();
  // const [visible, setVisible] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  // const navigate = useNavigate();

  useEffect(() => {
    if (playerRef.current && fullVideoVisible) {
      handlePlay();
    }
  }, [fullVideoVisible]);

  useEffect(() => {
    if (playing) {
      handlePlay();
    } else {
      handlePause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  useEffect(() => {
    if (played === 0) {
      handlePlay();
    }
  }, [played]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.muted = mute;
    }
  }, [mute]);

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  const handlePause = () => {
    if (playerRef.current && !playing.pause) {
      playerRef.current.pause();
    }
  };

  useEffect(() => {
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (isFull) {
      toggleFullscreen();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skipAhead = () => {
    if (playerRef.current) {
      const time =
        playerRef.current.currentTime + 15 > 96 ? 96 : playerRef.current.currentTime + 15;
      playerRef.current.currentTime = time;
      setPlayed(time);
    }
  };
  const skipBack = () => {
    if (playerRef.current) {
      const time = playerRef.current.currentTime - 15 < 0 ? 0 : playerRef.current.currentTime - 15;
      playerRef.current.currentTime = time;
      setPlayed(time);
    }
  };

  /* View in fullscreen */
  // const openFullscreen = () => {
  //   const elem = document.documentElement;
  //   if (elem.requestFullscreen) {
  //     elem.requestFullscreen();
  //   } else if (elem.webkitRequestFullscreen) {
  //     /* Safari */
  //     elem.webkitRequestFullscreen();
  //   } else if (elem.msRequestFullscreen) {
  //     /* IE11 */
  //     elem.msRequestFullscreen();
  //   }
  //   setIsFull(true);
  // };

  const showControls = () => {
    const closeBtn = document.getElementById('close-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const controlsBtn = document.getElementById('controls-btn');

    if (closeBtn) {
      closeBtn.style.opacity = '1';
    }
    if (playPauseBtn) {
      playPauseBtn.style.opacity = '1';
    }
    if (controlsBtn) {
      controlsBtn.style.opacity = '1';
    }
    let timeout = setTimeout(() => {
      if (closeBtn) {
        closeBtn.style.opacity = '0';
      }
      if (playPauseBtn) {
        playPauseBtn.style.opacity = '0';
      }
      if (controlsBtn) {
        controlsBtn.style.opacity = '0';
      }
    }, 5000);
    return () => clearTimeout(timeout);
  };

  /* Close fullscreen */
  // const closeFullscreen = () => {
  //   if (document.exitFullscreen) {
  //     document.exitFullscreen();
  //   } else if (document.webkitExitFullscreen) {
  //     /* Safari */
  //     document.webkitExitFullscreen();
  //   } else if (document.msExitFullscreen) {
  //     /* IE11 */
  //     document.msExitFullscreen();
  //   }
  //   setIsFull(false);
  // };

  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else if (playerRef.current.webkitRequestFullscreen) {
        playerRef.current.webkitRequestFullscreen();
      } else if (playerRef.current.mozRequestFullScreen) {
        playerRef.current.mozRequestFullScreen();
      } else if (playerRef.current.msRequestFullscreen) {
        playerRef.current.msRequestFullscreen();
      }
    }
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
    handleSeek(value);
  };

  const handleTimeUpdate = () => {
    if (playerRef.current) {
      setPlayed(playerRef.current.currentTime);
      setSliderValue(Number(playerRef.current.currentTime));
    }
  };

  const handleSeek = (time) => {
    if (playerRef.current) {
      playerRef.current.currentTime = time;
      setPlayed(time);
      setSliderValue(Number(time));
    }
  };

  // https://blackjetstoragebuck.s3.ap-southeast-2.amazonaws.com/1709038447026Draft+Film+1920+x+1080.mp4
  // https://d2829a15fmlx7s.cloudfront.net/1709038447026Draft+Film+1920+x+1080.mp4
  return (
    <>
      <div
        className='full-screen-video w-full h-full fixed top-0 left-0 bg-white !z-[9999999999]'
        onMouseMove={showControls}
      >
        <video
          className='object-cover h-full w-full'
          ref={playerRef}
          onTimeUpdate={handleTimeUpdate}
        >
          <source src={aDayWithBlackJetVideo} type='video/mp4' />
        </video>

        {
          <>
            <Img
              src={'/images/Close.svg'}
              alt='Close'
              onClick={() => setFullVideoVisible(false)}
              className={'absolute rounded-full top-[25px] cursor-pointer left-[25px] z-[100]'}
              srcSet={[
                {
                  media: '(max-width: 699px)',
                  srcSet: `images/tour-mobile-cross.svg 699w`,
                  sizes: '699px',
                },
                {
                  media: '(max-width: 1049px)',
                  srcSet: `images/tour-tab-cross.svg 1049w`,
                  sizes: '1049px',
                },
                {
                  media: '(max-width: 1799px)',
                  srcSet: `images/tour-desktop-cross.svg 1799w`,
                  sizes: '1799px',
                },
                {
                  srcSet: `images/tour-large-cross.svg 2560w`,
                  sizes: '2560px',
                },
              ]}
            />
            {/* <img id="close-btn" src="/images/CloseVideo.svg" alt="close video" className='cursor-pointer absolute left-[5%] top-[5%] transition-all hover:!opacity-100' onClick={() => navigate("/")} /> */}
            <img
              id='play-pause-btn'
              src={playing ? '/images/center_pause.svg' : '/images/center_play_pause.svg'}
              onClick={() => setPlaying(!playing)}
              alt='play-image'
              className={
                'absolute top-[40%] left-[45%] cursor-pointer transition-all hover:!opacity-100'
              }
            />
            <div
              id='controls-btn'
              className='w-[60%] absolute bottom-[2%] left-[20%] m-auto flex flex-col justify-center px-9 py-6 max-md:px-5 transition-all hover:!opacity-100'
            >
              <div className='flex gap-5 justify-between max-md:flex-wrap max-md:max-w-full'>
                <div className='flex gap-5 justify-between'>
                  <img
                    onClick={skipBack}
                    loading='lazy'
                    src='/images/skip-left.svg'
                    className='aspect-[0.93] w-[30px] cursor-pointer'
                    alt='skip back'
                  />
                  <img
                    onClick={skipAhead}
                    loading='lazy'
                    src='/images/skip-right.svg'
                    className='aspect-[0.93] w-[30px] cursor-pointer'
                    alt='skip ahead'
                  />
                </div>
                <div className='flex gap-2 flex-[0.8] items-center justify-between px-2 my-auto max-md:flex-wrap max-md:max-w-full'>
                  <div className='text-xl text-white w-[50px] mr-2'>
                    {secondsToMMSS(played?.toFixed(0))}
                  </div>
                  <div className='flex flex-1 justify-center items-start my-auto max-md:max-w-full'>
                    {/* <BorderLinearProgress variant="determinate" value={50} /> */}
                    {/* <LinearProgress variant="determinate" value={(played/totalDuration)?.toFixed(0)*100} /> */}
                    <Slider
                      min={0}
                      max={96}
                      step={1}
                      onChange={handleSliderChange}
                      value={sliderValue}
                    />
                    {/* <svg className='transition-all overflow-visible' width="100%" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0.235352" y="7.36914" width="100%" height="9.81294" rx="4.90647" fill="white" fill-opacity="0.25" />
                                        <rect x="0.235352" y="7.36914" width={(played/(totalDuration||32))*100} height="9.81294" rx="4.90647" fill="white" />
                                        <ellipse  cx={((played / (totalDuration || 32))) * 100} cy="12.5" rx="10" ry="10" fill="white" />
                                    </svg> */}
                  </div>
                  <div className='text-xl text-white'>
                    {secondsToMMSS(totalDuration?.toFixed(0))}
                  </div>
                </div>
                <div className='flex gap-5 justify-between'>
                  <img
                    onClick={() => setMute(!mute)}
                    loading='lazy'
                    src={mute ? '/images/videoMute.svg' : '/images/Mute.svg'}
                    className='my-auto w-8 aspect-[1.33] cursor-pointer'
                    alt=''
                  />
                  {!isFull ? (
                    <img
                      onClick={toggleFullscreen}
                      loading='lazy'
                      src='/images/fullScreenOpen.svg'
                      className='w-8 aspect-square cursor-pointer'
                      alt=''
                    />
                  ) : (
                    <img
                      onClick={toggleFullscreen}
                      loading='lazy'
                      src='/images/fullScreenClose.svg'
                      className='w-8 aspect-square cursor-pointer'
                      alt=''
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        }
      </div>
    </>
  );
};

export default memo(FullScreen);
