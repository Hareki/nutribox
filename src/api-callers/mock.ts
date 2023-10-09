import axios from 'axios';

const getServices = async (): Promise<any[]> => {
  const response = await axios.get('/api/mock/services');
  return response.data;
};

const getTestimonials = async () => {
  const response = await axios.get('/api/mock/testimonials');
  return response.data;
};

export const Mock = {
  getServices,
  getTestimonials,
};
