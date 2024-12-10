import { useState, useEffect } from 'react';

// Mock function to simulate checking low power mode status
const checkLowPowerMode = () => {
  // Simulate an API call or native integration
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowPowerModeEnabled = Math.random() > 0.5; // Randomly return true or false
      resolve(lowPowerModeEnabled);
    }, 1000);
  });
};

/**
 * Hook to check if low power mode is enabled on the user's device
 * Returns a boolean value indicating whether low power mode is enabled or not
 * If the status can't be determined, returns null
 * @returns {boolean | null} isLowPowerModeEnabled
 */
const useLowPowerMode = () => {
  const [lowPowerModeEnabled, setLowPowerModeEnabled] = useState(null);

  useEffect(() => {
    const fetchLowPowerModeStatus = async () => {
      const status = await checkLowPowerMode();
      setLowPowerModeEnabled(status);
    };

    fetchLowPowerModeStatus();
  }, []);

  return lowPowerModeEnabled;
};

export default useLowPowerMode;
