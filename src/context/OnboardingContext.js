import {
  CHANGE_PREORDER_STATUS,
  CHAT_MESSAGE_COUNT,
  CLEAR_ONBOARDING,
  CURRENT_INDEX,
  INITIAL_LOGIN_INFO,
  IS_CHAT_OPEN,
  LAST_INDEX,
  MEMBERSHIP_DATA,
  RESET_ONBOARDING,
  SAVED_LOCATION,
  UPDATE_EMAIL,
  UPDATE_INFO,
  UPDATE_PAYMENT,
  UPDATE_PHONE,
} from 'constants/actions';
import { generateUniqueRandomString, isValidMongoId, stickyBody } from 'helpers';
import { createContext, useContext } from 'react';
// import { jwtDecode } from 'jwt-decode';

const OnboardingContext = createContext(null);

/**
 * A convenience hook to access the black jet context without having to
 * import the context and use the useContext hook.
 * @returns {object} The black jet context
 */
export const useBlackJetContext = () => {
  return useContext(OnboardingContext);
};

/**
 * Returns the user's membership data from the onboarding context.
 * @returns {object} membershipData
 */
export const useMembershipData = () => {
  const { onboardingForms } = useContext(OnboardingContext);
  return onboardingForms.membershipData;
};
/**
 * Returns the user id from the onboarding context.
 * If the user is not logged in, it will return the
 * unique id generated for the user.
 * @returns {string} user id
 */
export const useGetUserId = () => {
  const { onboardingForms } = useContext(OnboardingContext);
  return onboardingForms.userId;
};

/**
 * Returns the user type from the onboarding context.
 * The user type is either 'user' if the user is logged in, or 'guest' if the user is not logged in.
 * @returns {string} user type
 */
export const useGetUserType = () => {
  const { onboardingForms } = useContext(OnboardingContext);
  return onboardingForms.userType;
};

let sender = localStorage.getItem('unique_id');
if (!sender || !isValidMongoId(sender)) {
  let newId = generateUniqueRandomString(16);
  localStorage.setItem('unique_id', newId);
  sender = newId;
}

/**
 * Decodes the JWT token stored in local storage and returns its contents.
 * Returns null if the token is invalid or if there is no token.
 * @returns {object|null}
 */
// const decode = () => {
//   try {
//     return jwtDecode(localStorage.getItem('blackjet-website')) || null;
//   } catch (error) {
//     return null;
//   }
// };

/**
 * check type is user or guest
 * !Not only site is guest
 * to enable @example decode()?._id ? 'user' : 'guest';
 * to enable userId = decode()?._id || sender;
 * @default user
 * */
const userId = sender;
const userType = 'guest';

// chat

export const initialOnboardingState = {
  email: '',
  phone: {},
  info: {},
  payment: {},
  isPreOrder: false,
  sessionToken: null,
  loginData: {},
  membershipData: null,
  currentIndex: 0,
  lastInd: [],

  // isResized no longer used
  isChatOpen: { open: false, isResize: false },
  userId: userId,
  userType: userType,
  messageCount: 0,
  savedLocation: null,
};

/**
 * Generates a random string of a given length.
 *
 * @param {number} length - Length of the string to generate.
 * @returns {string} A random string of the given length.
 */
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    const randomIndex = randomValues[i] % characters.length;
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

/**
 * Reducer for onboarding state.
 *
 * Handles the following actions:
 *
 * - `UPDATE_EMAIL`: Updates the email address in the state.
 * - `UPDATE_PHONE`: Updates the phone number in the state.
 * - `UPDATE_INFO`: Updates the user's information in the state.
 * - `UPDATE_PAYMENT`: Updates the user's payment information in the state.
 * - `CLEAR_ONBOARDING`: Clears the onboarding state.
 * - `CHANGE_PREORDER_STATUS`: Updates the preorder status in the state and generates a new session token.
 * - `INITIAL_LOGIN_INFO`: Updates the initial login information in the state.
 * - `MEMBERSHIP_DATA`: Updates the membership data in the state.
 * - `CURRENT_INDEX`: Updates the current index in the state.
 * - `LAST_INDEX`: Updates the last index in the state.
 * - `IS_CHAT_OPEN`: Updates the chat open status in the state.
 * - `CHAT_MESSAGE_COUNT`: Updates the chat message count in the state.
 *
 * @param {Object} state The current state of the onboarding process.
 * @param {Object} action The action to be handled.
 * @returns {Object} The new state of the onboarding process.
 */
export const OnboardingReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_EMAIL:
      return { ...state, email: action.payload };
    case UPDATE_PHONE:
      return { ...state, phone: action.payload };
    case UPDATE_INFO:
      return { ...state, info: action.payload };
    case UPDATE_PAYMENT:
      return { ...state, payment: action.payload };
    case CLEAR_ONBOARDING:
      return { ...state, email: '', phone: {}, info: {}, payment: {} };
    case CHANGE_PREORDER_STATUS:
      return { ...state, isPreOrder: action.payload, sessionToken: generateRandomString(12) };
    case INITIAL_LOGIN_INFO:
      return { ...state, loginData: action.payload };
    case MEMBERSHIP_DATA:
      return { ...state, membershipData: action.payload };
    case CURRENT_INDEX: {
      return { ...state, currentIndex: action.payload };
    }
    case LAST_INDEX: {
      return { ...state, lastInd: action.payload };
    }

    case IS_CHAT_OPEN: {
      return { ...state, isChatOpen: chatFn(action) };
    }

    case CHAT_MESSAGE_COUNT: {
      return { ...state, messageCount: action.payload };
    }

    case SAVED_LOCATION: {
      return { ...state, savedLocation: action.payload };
    }
    case RESET_ONBOARDING: {
      return {
        ...state,
        email: '',
        phone: {},
        info: {},
        payment: {},
        isPreOrder: false,
        sessionToken: null,
        loginData: {},
      };
    }

    default:
      return state;
  }
};

/**
 * Handles the chat open/closed state and
 * sticks the body if chat is open and user is on mobile.
 *
 * @param {Object} action The action object from the OnboardingReducer.
 * @param {boolean} action.payload.open Flag to indicate if the chat is open or not.
 * @param {boolean} [action.payload.isMobile] Flag to indicate if user is on mobile.
 * @returns {Object} The payload of the action.
 */
const chatFn = (action) => {
  stickyBody(action.payload.open, action.payload?.isMobile);
  return action.payload;
};

export default OnboardingContext;
