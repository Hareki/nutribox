import { services } from 'backend/database/mock/services';
import { testimonials } from 'backend/database/mock/testimonials';

const getServices = async (): Promise<any[]> => {
  return services;
};

const getTestimonials = async () => {
  return testimonials;
};

export const Mock = {
  getServices,
  getTestimonials,
};
