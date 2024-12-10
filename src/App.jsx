import React, { useEffect, useReducer } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import { Toaster } from 'react-hot-toast';

import OnboardingContext, {
  OnboardingReducer,
  initialOnboardingState,
} from 'context/OnboardingContext';

import { getMembershipDetails } from 'api/onboarding';
import { MEMBERSHIP_DATA, SAVED_LOCATION } from 'constants/actions';
import Routes from './Routes';
import { BrowserRouter } from 'react-router-dom';
import { apiViewAllSavedLocation } from 'services/api';

/**
 * The root component of the application.
 *
 * @returns {ReactElement} The root component element.
 */
function App() {
  /**
   * The state and dispatch function for the onboarding form reducer.
   */
  const [onboardingForms, dispatchOnboardingForms] = useReducer(
    OnboardingReducer,
    initialOnboardingState,
  );

 

  /**
   * Fetches the membership details from the server and dispatches the membership data action to the onboarding form reducer.
   * It's for the onboarding flow.
   * @returns {Promise<void>}
   */
  const getDetails = async () => {
    let response = await getMembershipDetails({ type: 'Unlimited' });
    if (response?.data?.status_code === 200) {
      dispatchOnboardingForms({ type: MEMBERSHIP_DATA, payload: response?.data?.data || {} });
    }
  };

  const getSavedLocation = async () => {
    let response = await apiViewAllSavedLocation();
    if (response?.data?.status_code === 200) {
      dispatchOnboardingForms({ type: SAVED_LOCATION, payload: response?.data?.data || {} });
    }
  };

  useEffect(() => {
    // Get membership details on app load
    getDetails();
    getSavedLocation();
  }, []);

  useEffect(() => {
    // Disable scroll on number input
    document.addEventListener('wheel', function (event) {
      if (document.activeElement.type === 'number') {
        document.activeElement.blur();
      }
    });
    return () => {
      document.removeEventListener('wheel', null);
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    /**
     * Checks if the key pressed is the specified key code and that the control and shift keys are also pressed.
     * @param {KeyboardEvent} e - The key event.
     * @param {string} keyCode - The key code to check.
     * @returns {boolean} True if the key is pressed with the control and shift keys.
     */
    function ctrlShiftKey(e, keyCode) {
      return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
    }

    // Prevents the user from accessing the browser's developer tools.
    // This is useful in production to prevent users from debugging the application and potentially
    // finding security vulnerabilities.
    // The keys that are disabled are:
    // - F12
    // - Ctrl + Shift + I
    // - Ctrl + Shift + J
    // - Ctrl + U
    document.onkeydown = (e) => {
      // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
      if (
        e.keyCode === 123 ||
        ctrlShiftKey(e, 'I') ||
        ctrlShiftKey(e, 'J') ||
        ctrlShiftKey(e, 'C') ||
        (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0))
      )
        return false;
    };
  }

  return (
    <OnboardingContext.Provider value={{ onboardingForms, dispatchOnboardingForms }}>
      <React.Suspense fallback={<>Loading...</>}>
        <ParallaxProvider>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </ParallaxProvider>
      </React.Suspense>
      <Toaster
        position='bottom-center'
        reverseOrder={false}
        toastOptions={{
          // Override the default error icon
          style: {
            borderRadius: '0.75rem',
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(7.5px)',
            color: '#FFF',
            width: '100%',
          },
        }}
      />
    </OnboardingContext.Provider>
  );
}

export default App;
