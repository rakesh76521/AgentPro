import axios from 'axios';

axios.defaults.withCredentials = true;
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
   // Backend API base URL
  // ❌ DO NOT set 'Content-Type' here for multipart/form-data
  // Let Axios/browser handle it automatically per request
});

export default axiosInstance;
