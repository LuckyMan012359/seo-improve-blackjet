import API from './interceptor';

export const addPayment = async (payload) => API.post('/user/addPayment', payload);
export const getCardType = async (payload) => API.get('/user/getPaymentMethod');
export const getUserData = async () => API.get(`/user/getUserProfile`);
export const onboard = async () => API.get(`/user/freePreviewRegister`);
export const sendApp = async (payload) =>
  API.get(`/user/send_app_link`, {
    params: payload,
  });

export const uploadFile = async (payload) => API.post(`/user/uploadAnyFiles`, payload);
export const uploadFilePublic = async (payload) => API.post(`/uploadAnyFiles`, payload);

export const getMembershipDetails = async (payload) =>
  API.get(`/viewMembership?type=${payload?.type}`);
export const getHandAnimationImages = async () => API.get(`/images`);
export const apiAddMembership = async (payload) => API.post(`/user/AddMembership`, payload);

export const apiGetPeymentCountry = async () => API.get(`/user/getPeymentCountry`);
