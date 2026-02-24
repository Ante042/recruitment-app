import axios from 'axios';
import { getErrorMessage } from '../utils/errors';

/**
 * Pre-configured Axios instance for API requests with credentials and error logging.
 * @type {import('axios').AxiosInstance}
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    error.userMessage = getErrorMessage(error);
    console.error('API error:', error.userMessage);
    return Promise.reject(error);
  }
);

export default client;
