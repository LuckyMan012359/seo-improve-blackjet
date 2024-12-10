import { PlayArrow } from '@mui/icons-material';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import FullScreen from './FullScreen';
import { useMediaQuery } from '@mui/material';
import { checkMobile, detectIOSDevice } from 'helpers';
import NativePlayer from './NativePlayer';
import thumbnail from './thumbnail.png';
import useIntersectionObserver from 'Hook/useIntersectionObserver';
import { aDayWithBlackJetVideo } from 'assets';
let lastScrollTop = 0;

/**
 * A Day with Black Jet - Video Animation
 *
 * A React component for playing a video animation of a day with Black Jet.
 *
 * @return {JSX.Element} The JSX element representing the video animation.
 */
const VideoAnimation = () => {
  const topVideo = useRef(null);
  const dividerRef = useRef(null);
  const endRef = useRef(null);
  const headingRef = useRef(null);
  const [inViewPort, setInViewPort] = useState(false);
  const refWrapper = useRef(null);
  const playerRef = useRef(null);
  // const largePlayerRef = useRef(null);
  const [mute, setmute] = useState(true);
  const [play, setPlay] = useState(true);
  const [played, setPlayed] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fullVideoVisible, setFullVideoVisible] = useState(false);
  const isTabMobile = useMediaQuery('(max-width : 1049px)');
  const isMobileV2 = useMediaQuery('(max-width : 699px)');

  const maxScale = isTabMobile ? 4 : 1.75;
  const [zoom, setZoom] = useState(maxScale);

  const [isFull, setIsFull] = useState(false);
  const [isFullVideoVisible, setIsFullVideoVisible] = useState(false);
  const afterHeading = useRef(null);

  const [hoverMute, setHoverMute] = useState(false);
  const [hoverPlay, setHoverPlay] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isIntersecting, subHeadingRef] = useIntersectionObserver();

  // console.log(inViewPort, 'intersecting___');
  // console.count('intersecting___');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // setInViewPort(entry.isIntersecting);
        setInViewPort(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // Change this threshold as per your requirement
      },
    );

    if (refWrapper.current) {
      observer.observe(refWrapper.current);
    }

    return () => {
      if (refWrapper.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(refWrapper.current);
      }
    };
  }, []);


  useEffect(() => {
    const handleScroll = (event) => {
      // const deltaY = event.deltaY;
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      let deltaY = scrollTop - lastScrollTop;
      lastScrollTop = scrollTop;
      // console.log(lastScrollTop, inViewPort, 'scroll_top');
      const videoWrapper = refWrapper.current;

      const heading = headingRef.current;
      // const videoContainer = videoContainerRef.current;
      if (videoWrapper && heading) {
        const dim = videoWrapper.getBoundingClientRect();
        const headingDim = heading.getBoundingClientRect();
        const divider = dividerRef.current.getBoundingClientRect();
        const end = endRef.current.getBoundingClientRect();
        const video = topVideo.current.getBoundingClientRect();

        const distanceBottomHeading = video.bottom - headingDim.bottom - window.innerHeight;

        // console.log(
        //   +distanceBottomHeading.toFixed(0),
        //   headingDim,
        //   window.innerHeight,
        //   'heading_dim',
        // );
        const isTab = !isMobileV2 && isTabMobile;

        // Heading and Sub Heading Animation

        if (isTab) {
          if (+distanceBottomHeading.toFixed(0) > 500) {
            subHeadingRef.current.style.opacity = '100%';
          } else if (+distanceBottomHeading.toFixed(0) > 450) {
            subHeadingRef.current.style.opacity = '75%';
          } else if (+distanceBottomHeading.toFixed(0) > 400) {
            subHeadingRef.current.style.opacity = '50%';
          } else if (+distanceBottomHeading.toFixed(0) > 350) {
            subHeadingRef.current.style.opacity = '25%';
          } else {
            subHeadingRef.current.style.opacity = '0%';
          }
        } else {
          if (+distanceBottomHeading.toFixed(0) > 300) {
            subHeadingRef.current.style.opacity = '100%';
          } else if (+distanceBottomHeading.toFixed(0) > 250) {
            subHeadingRef.current.style.opacity = '75%';
          } else if (+distanceBottomHeading.toFixed(0) > 200) {
            subHeadingRef.current.style.opacity = '50%';
          } else if (+distanceBottomHeading.toFixed(0) > 150) {
            subHeadingRef.current.style.opacity = '25%';
          } else {
            subHeadingRef.current.style.opacity = '0%';
          }
        }

        // if (+distanceBottomHeading.toFixed(0) > 250) {
        //   subHeadingRef.current.classList.add('show-sub-heading');
        //   subHeadingRef.current.classList.remove('hide-sub-heading');
        //   subHeadingRef.current.classList.remove('opacity-100');
        // } else {
        //   subHeadingRef.current.classList.remove('show-sub-heading');
        //   subHeadingRef.current.classList.add('opacity-0');
        //   subHeadingRef.current.classList.add('hide-sub-heading');
        // }
        if (dim.top < 0) {
          if (end.y > window.innerHeight) {
            topVideo.current.classList.add('position-fixed');
            topVideo.current.style.bottom = 'auto';
            topVideo.current.style.top = '0%';
          } else if (end.y < window.innerHeight) {
            // if (end.bottom - player.bottom < 100) {
            topVideo.current.classList.remove('position-fixed');
            topVideo.current.style.bottom = '0%';
            topVideo.current.style.top = 'auto';
            // }
          } else {
            topVideo.current.classList.add('position-fixed');
            topVideo.current.style.bottom = 'auto';
            topVideo.current.style.top = '0%';
          }
          if (divider.bottom < 0) {
            if (end.bottom > window.innerHeight) {
              const divisor = dim.height / 3;
              const diff = divisor - (-1 * dim.top - divisor);
              const dev = (diff / divisor) * (maxScale - 1);
              if (deltaY > 0) {
                // Scrolling up, zoom in
                const newZoom = 1 + dev < 1 ? 1 : 1 + dev;
                setZoom(newZoom);
                if (afterHeading.current) {
                  afterHeading.current.style.setProperty('--zoom', newZoom);
                  afterHeading.current.style.display = 'block';
                }
                // console.log(newZoom, 'this_is_zoom');

                // setZoom((zoom) =>Number(zoom) - Number(deviation) < 1 ? 1 : Number(zoom) - deviation); // Adjust the zoom level as needed
              } else if (deltaY < 0) {
                const _newZoom = 1 + dev > maxScale ? maxScale : 1 + dev;
                const newZoom = _newZoom < 1 ? 1 : _newZoom;
                setZoom(newZoom);
                if (afterHeading.current) {
                  afterHeading.current.style.setProperty('--zoom', newZoom);
                  // afterHeading.current.style.setProperty('--hide', 1);
                }
                // Scrolling down, zoom out
                // setZoom((zoom) =>Number(zoom) + Number(deviation) > maxScale? maxScale: Number(zoom) + deviation); // Adjust the zoom level as needed
              }
            } else {
              setZoom(1);
            }
          } else {
            setZoom(maxScale);
          }
        } else {
          topVideo.current.classList.remove('position-fixed');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  useEffect(() => {
    if (zoom <= 1) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [zoom]);



  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.muted = mute;
    }
  }, [mute]);

  const handlePlay = (signal) => {
    // console.log(playerRef.current.play, 'playrefCurrent');
    if (signal) {
      setShowFallback(false);
    }

    const videoElement = playerRef.current;

    if (videoElement) {
      const playPromise = videoElement.play();
      setPlay(true);

      if (playPromise !== undefined) {
        playPromise
          .catch((error) => {
            // Auto-play was prevented
            if (error.name === 'NotAllowedError') {
              console.log('Low Power Mode Active');
              setShowFallback(true);
              setPlay(false);
            }
          })
          .then(() => {
            // if there is no error, play the video
            videoElement.play();
          });
      }
    }
  };

  const handlePause = () => {
    if (playerRef.current && play) {
      playerRef.current.pause();
      setPlay(false);
    }
  };

  const handleTimeUpdate = () => {
    if (playerRef.current) {
      setPlayed(playerRef.current.currentTime);
    }
  };

  const handleWatchFilm = () => {
    if (checkMobile() || detectIOSDevice()) {
      setIsFullVideoVisible(true);
    } else {
      setFullVideoVisible(true);
    }
  };


  useMemo(() => {
    if (inViewPort) {
      handlePlay();
    } else {
      handlePause();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViewPort]);



  return (
    <>
      <div
        ref={refWrapper}
        className={`adaywithblackjet ${fullVideoVisible ? 'dynamic-z-index' : ''}`}
      >
        <div ref={topVideo} className='top-video'>
          <div
            style={{
              transform: `scale(${zoom})`,
            }}
            className={`video-wrapper ${visible ? 'videoborder' : ''}`}
          >
            <div ref={afterHeading} className='afterheading'>
              <h1 className='headingshow'>A Day with Black Jet</h1>
              <p className='subheadingshow'>
                An animated journey exploring the transformative power of personal aviation
              </p>
            </div>
            <div className='video-overlay'></div>
            <img
              // ref={playerRef}
              className='object-cover h-full w-full custom-video'
              alt='Thumbnail'
              src={thumbnail}
              style={{
                display: showFallback ? 'block' : 'none',
              }}
            />
            <video
              ref={playerRef}
              className='object-cover h-full w-full custom-video'
              width='100%'
              height='100%'
              muted
              // autoPlay
              loop
              onTimeUpdate={handleTimeUpdate}
              controlsList='nofullscreen'
              webkit-playsinline
              playsInline
              poster={thumbnail}
              style={{
                display: showFallback ? 'none' : ' block',
              }}
            >
              <source src={aDayWithBlackJetVideo} type='video/mp4' />
              Your browser does not support the video tag.
            </video>

            {visible && (
              <>
                <svg
                  onMouseEnter={() => setHoverPlay(true)}
                  onMouseLeave={() => setHoverPlay(false)}
                  onClick={() => (play ? handlePause() : handlePlay('signalClick'))}
                  className='playing play-desktop absolute top-[10px] right-[10px] transition-all cursor-pointer z-[99999]'
                  width='41'
                  height='40'
                  viewBox='0 0 41 40'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <circle
                    cx='20.6016'
                    cy='20'
                    r='19'
                    stroke='white'
                    stroke-opacity='0.25'
                    stroke-width='2'
                  />
                  <circle
                    className='rotated'
                    strokeDasharray={121}
                    strokeDashoffset={121 - (played / 109) * 121}
                    cx='20.6016'
                    cy='20'
                    r='19'
                    stroke={hoverPlay ? 'white' : '#E6E6E6'}
                    stroke-opacity='1'
                    stroke-width='2'
                  />

                  {!play ? (
                    <path
                      // {/* Pause icon */}
                      d='M15.3473 28.5445C15.7714 28.5445 16.145 28.3931 16.6095 28.1204L28.535 21.2236C29.4034 20.7187 29.7669 20.3249 29.7669 19.6888C29.7669 19.0526 29.4034 18.6689 28.535 18.1539L16.6095 11.2571C16.145 10.9845 15.7714 10.833 15.3473 10.833C14.5193 10.833 13.9336 11.4692 13.9336 12.4688V26.9087C13.9336 27.9185 14.5193 28.5445 15.3473 28.5445Z'
                      fill={hoverPlay ? 'white' : '#E6E6E6'}
                    />
                  ) : (
                    <path
                      // Play icon
                      d='M15.4314 28.9731H17.8755C18.8635 28.9731 19.3731 28.4635 19.3731 27.4754V13.1646C19.3731 12.1558 18.8635 11.6774 17.8755 11.667H15.4314C14.4434 11.667 13.9337 12.1766 13.9337 13.1646V27.4754C13.9233 28.4635 14.433 28.9731 15.4314 28.9731ZM23.3356 28.9731H25.7693C26.7573 28.9731 27.2669 28.4635 27.2669 27.4754V13.1646C27.2669 12.1558 26.7573 11.667 25.7693 11.667H23.3356C22.3372 11.667 21.838 12.1766 21.838 13.1646V27.4754C21.838 28.4635 22.3372 28.9731 23.3356 28.9731Z'
                      fill={hoverPlay ? 'white' : '#E6E6E6'}
                    />
                  )}
                </svg>
                <svg
                  onMouseEnter={() => setHoverPlay(true)}
                  onMouseLeave={() => setHoverPlay(false)}
                  onClick={() => (play ? handlePause() : handlePlay('signalClick'))}
                  className='playing play-mobile absolute top-[10px] right-[10px] transition-all cursor-pointer z-[99999]'
                  width='29'
                  height='28'
                  viewBox='0 0 29 28'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <circle
                    cx='14.6016'
                    cy='14'
                    r='13.25'
                    stroke='white'
                    stroke-opacity='0.25'
                    stroke-width='2'
                  />
                  <circle
                    className='rotated'
                    strokeDasharray={83}
                    stroke-dashoffset={83 - (played / 109) * 83}
                    cx='14.6016'
                    cy='14'
                    r='13.25'
                    stroke={hoverPlay ? 'white' : '#E6E6E6'}
                    stroke-opacity='1'
                    stroke-width='2'
                  />
                  {!play ? (
                    <path
                      d='M11.1345 20.125C11.4069 20.125 11.6468 20.0277 11.9451 19.8526L19.6041 15.4232C20.1619 15.099 20.3953 14.8461 20.3953 14.4375C20.3953 14.0289 20.1619 13.7825 19.6041 13.4518L11.9451 9.02238C11.6468 8.84728 11.4069 8.75 11.1345 8.75C10.6027 8.75 10.2266 9.15857 10.2266 9.8006V19.0744C10.2266 19.7229 10.6027 20.125 11.1345 20.125Z'
                      fill={hoverPlay ? 'white' : '#E6E6E6'}
                    />
                  ) : (
                    <path
                      d='M11.211 20.125H12.8175C13.4669 20.125 13.8019 19.79 13.8019 19.1406V9.73438C13.8019 9.07129 13.4669 8.75684 12.8175 8.75H11.211C10.5616 8.75 10.2267 9.08496 10.2267 9.73438V19.1406C10.2198 19.79 10.5548 20.125 11.211 20.125ZM16.4064 20.125H18.006C18.6554 20.125 18.9903 19.79 18.9903 19.1406V9.73438C18.9903 9.07129 18.6554 8.75 18.006 8.75H16.4064C15.7501 8.75 15.422 9.08496 15.422 9.73438V19.1406C15.422 19.79 15.7501 20.125 16.4064 20.125Z'
                      fill={hoverPlay ? 'white' : '#E6E6E6'}
                    />
                  )}
                </svg>
                <img
                  id='unmute'
                  onClick={() => setmute(!mute)}
                  alt='small pause'
                  onMouseOver={() => setHoverMute(true)}
                  onMouseLeave={() => setHoverMute(false)}
                  src={
                    mute
                      ? !hoverMute
                        ? '/images/mobile_mute_faded.svg'
                        : '/images/mobile_mute_unfaded.svg'
                      : !hoverMute
                      ? '/images/mobile_unmute_faded.svg'
                      : '/images/mobile_unmute_unfaded.svg'
                  }
                  className='absolute bottom-[10px] right-[10px] transition-all cursor-pointer z-[99999]'
                />
                <img
                  id='unmute-desktop'
                  onClick={() => setmute(!mute)}
                  alt='small pause'
                  onMouseOver={() => setHoverMute(true)}
                  onMouseLeave={() => setHoverMute(false)}
                  src={
                    mute
                      ? !hoverMute
                        ? '/images/desktop_mute_faded.svg'
                        : '/images/desktop_mute_unfaded.svg'
                      : !hoverMute
                      ? '/images/desktop_unmute_faded.svg'
                      : '/images/desktop_unmute_unfaded.svg'
                  }
                  className='absolute bottom-[10px] right-[10px] transition-all cursor-pointer z-[99999]'
                />
              </>
            )}
            <div className='watch-the-film absolute flex justify-center w-full z-10'>
              {visible && (
                <div
                  onClick={handleWatchFilm}
                  id='watch'
                  className='flex group cursor-pointer items-center justify-center gap-4 text-[24px] text-white-A700 font-semibold text-center hover:underline'
                >
                  Watch the film{' '}
                  <div className=' border-[3px]  border-solid rounded-full w-[25px] h-[25px] flex items-center justify-center group-hover:bg-[#ffffff20] border-[white]'>
                    {' '}
                    <PlayArrow className='!text-[18px] play-arrow ' />{' '}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <h1 ref={headingRef} className='heading'>
          A Day with Black Jet
        </h1>

        <p ref={subHeadingRef} className={'day-subheading z-10'}>
          An animated journey exploring the transformative power of personal aviation
        </p>

        <div ref={dividerRef} className='divider'></div>
        {/* <div ref={endRef}  className='absolute bottom-[2%] flex justify-center w-full z-10'> */}

        <div ref={endRef} className='absolute bottom-0'></div>
        {fullVideoVisible && (
          <FullScreen
            fullVideoVisible={fullVideoVisible}
            setFullVideoVisible={setFullVideoVisible}
            isFull={isFull}
            setIsFull={setIsFull}
          />
        )}
      </div>
      {isFullVideoVisible && (
        <NativePlayer
          isFullVideoVisible={isFullVideoVisible}
          setIsFullVideoVisible={setIsFullVideoVisible}
        />
      )}
    </>
  );
};

export default VideoAnimation;
export const MemoVideoAnimation = memo(VideoAnimation);
