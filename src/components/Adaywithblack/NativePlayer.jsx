import { aDayWithBlackJetVideo } from 'assets';
import { memo, useEffect, useRef } from 'react';

const NativePlayer = ({ isFullVideoVisible, setIsFullVideoVisible }) => {
  const largePlayerRef = useRef(null);
  // const [state, setState] = useState("");

  useEffect(() => {
    toggleFullscreen();
  }, []);

  // const fullscreenChangeHandler = () => {
  //     let isFullScreen = document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreenElement || document.msFullscreenElement
  //     console.log(isFullScreen)
  //     if (!isFullScreen && isFullVideoVisible) {
  //         setIsFullVideoVisible(false)
  //     }
  // };

  const fullscreenChangeHandler = () => {
    // setState(state => state + 1)
    setIsFullVideoVisible(
      document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
        ? true
        : false,
    );
  };

  const handleResize = () => {
    const isFullScreen =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
        ? true
        : false;
    if (!isFullScreen) {
      setIsFullVideoVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
    document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);
    document.addEventListener('mozfullscreenchange', fullscreenChangeHandler);
    document.addEventListener('MSFullscreenChange', fullscreenChangeHandler);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('mozfullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('MSFullscreenChange', fullscreenChangeHandler);
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFullscreen = () => {
    if (largePlayerRef.current) {
      try {
        if (largePlayerRef.current.requestFullscreen) {
          largePlayerRef.current.requestFullscreen();
        } else if (largePlayerRef.current.webkitEnterFullscreen) {
          largePlayerRef.current.webkitEnterFullscreen();
        } else if (largePlayerRef.current.mozRequestFullScreen) {
          largePlayerRef.current.mozRequestFullScreen();
        } else if (largePlayerRef.current.msRequestFullscreen) {
          largePlayerRef.current.msRequestFullscreen();
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div onClick={() => console.log('ashish')}>
      {isFullVideoVisible && (
        <video
          className={`object-cover h-full w-full ${
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
              ? 'block'
              : 'hidden'
          }`}
          ref={largePlayerRef}
          controls
          autoPlay
          onClick={() => console.log('video')}
        >
          <source src={aDayWithBlackJetVideo} type='video/mp4' />
        </video>
      )}
    </div>
  );
};

export default memo(NativePlayer);
