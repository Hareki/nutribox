import axios from 'axios';

import Service from 'models/Service.model';

const getServices = async (): Promise<Service[]> => {
  const response = await axios.get('/api/grocery-1/services');
  return response.data;
};

const getTestimonials = async () => {
  const response = await axios.get('/api/grocery-1/testimonial-list');
  return response.data;
};

export default {
  getServices,
  getTestimonials,
};
