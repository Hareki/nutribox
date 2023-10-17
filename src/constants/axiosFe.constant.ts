import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: ``,
  // baseURL: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api`,
  // timeout: 5000,
});

export default axiosInstance;
