import { generateUniqueRandomString } from 'helpers';
import api, { publicApi } from '../api/interceptor';

export const getEnquiryList = async () => await api.get(`/getEnquiryList`);

export const addEnquiry = async (payload) => await api.post(`/addEnQuiry`, payload);

export const getCategoryList = async () => await api.get(`/categoryList`);

export const getFaqQuestions = async (id, limit) =>
  await api.get(`/getFaqQuestions?id=${id}&limit=${limit}`);

export const getviewAllLegal = async (limit) =>
  await api.get(`/viewAllLegal?skip=${1}&limit=${limit}`);

export const getviewLegal = async (id) => await api.get(`/viewLegal?id=${id}`);

export const getCareers = async (payload) =>
  await api.get(`/careers`, {
    params: {
      ...payload,
    },
  });

export const getJobDetails = async (id) => await api.get(`/getJobDetails`);

export const submitJobApplication = async (payload) =>
  await publicApi.post(`/submitJobApplication`, payload);

export const getAllLocation = async () => await api.get(`/get_all_location`);

export const getAllCategory = async () => await api.get(`/get_all_category`);

export const getCareerDetail = async (id) => await api.get(`/get_career`, { params: { id } });

// login & signup, user

export const loginuser = async (payload) => await api.post(`/user/login`, payload);

export const loginuserotp = async (payload) =>
  await api.post(`/user/verifyOtp`, {
    ...payload,
    firebase_device_token: generateUniqueRandomString(),
  });

export const apiSendCodeToEmail = async (payload) =>
  await publicApi.get(`/user/sendCodeToEmail`, { params: payload });

export const apiSendOtpEmailRegister = async (payload) =>
  await publicApi.post(`/user/sendOtpEmailRegister`, payload);

export const loginResendotp = async (payload) =>
  await api.get(`/user/resendOtp`, {
    params: payload,
  });

export const loginWithToken = async (payload) => await api.post(`/user/loginWithToken`, payload);

export const apiAddEmail = async (payload) => await api.post(`/user/addEmail`, payload);

export const userAddInformation = async (payload) =>
  await api.post(`/user/addInformation`, payload);

export const getPlanPrice = async () => await api.get(`/user/getPlansAndPricing`);

export const loginRegistration = async (payload) =>
  await api.post(`/user/completionOfRegistration`, payload);

export const searchIndustries = async (payload) =>
  await api.get(`/user/searchIndustries?search=${payload.search}`);

export const signupComplete = async (payload) =>
  await api.post(`/user/completionOfRegistration`, payload);

export const apiCheckReferralLink = async (uniqueCode) =>
  await api.get(`/user/getReferStatus`, {
    params: { uniqueCode },
  });

/**
 * Checks if a given invite link is valid or not
 * @param {string} uniqueCode link code
 * @returns {object} response object containing the invite link status
 */
export const apiCheckInviteLink = async (uniqueCode) =>
  await publicApi.get(`/checkInviteLink`, {
    params: { link_code: uniqueCode },
  });

export const uploadMultipleChatFiles = async (payload) => {
  return await api.post(`/user/uploadMultipleChatFiles`, payload);
};

export const apiResendEmailVerification = async (payload) =>
  await publicApi.get(`user/resendEmailVerificationLink`, {
    params: payload,
  });

export const apiGetChatTime = async () => await api.get(`/getChatTime`);

export const apiViewAllSavedLocation = async () => await api.get(`/viewAllSavedLocation`);
