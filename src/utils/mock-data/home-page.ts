import axios from 'axios';

import type Service from 'models/Service.model';

const getServices = async (): Promise<Service[]> => {
  const response = await axios.get('/api/mock/services');
  return response.data;
};

const getTestimonials = async () => {
  const response = await axios.get('/api/mock/testimonial-list');
  return response.data;
};

export default {
  getServices,
  getTestimonials,
};
