
import axios from 'axios';


const apiClient = axios.create({
  baseURL: 'https://metashotbackend.azurewebsites.net', // base URL for api
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {
    // Add token to headers if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {

      router.push('/Login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
