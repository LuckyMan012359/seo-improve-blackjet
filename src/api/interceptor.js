import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL  /* || 'https://api.blackjet.au/api/v2'; */

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    // "Content-Type": "application/json",
  },
});
export const publicApi = axios.create({
  baseURL: baseURL,
  headers: {
    // "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('blackjet-website');
    if (token) {
      config.headers.Authorization = `Bearer ${token} `;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.error(error);

    return error?.response || { message: 'Something went wrong' };
  },
);

export default instance;
