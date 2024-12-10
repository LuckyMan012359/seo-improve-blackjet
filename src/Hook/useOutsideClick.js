import { useEffect } from 'react';

const useOutsideClick = (elementId, callback) => {
  const handleClick = (e) => {
    const outsideElement = document.getElementById(elementId);
    if (outsideElement && !outsideElement.contains(e.target)) {
      callback(e);
    }
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      handleClick(e);
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementId, callback]);
};

export default useOutsideClick;
