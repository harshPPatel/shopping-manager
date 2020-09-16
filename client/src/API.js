import { BASE_API_URL } from './config';

const API = async (method, path, data) => {
  const API_URL = `${BASE_API_URL}${path}`;
  const response = await fetch(API_URL, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.token,
    },
    method: method || 'GET',
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.errorCode) {
        const error = new Error(res.message);
        error.errorCode = res.errorCode;
        throw error;
      }
      return res;
    });

  return response;
};

export default API;
