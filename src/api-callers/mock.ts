import type { Service } from 'backend/database/mock/services';
import { services } from 'backend/database/mock/services';
import type { Testimonial } from 'backend/database/mock/testimonials';
import { testimonials } from 'backend/database/mock/testimonials';

const getServices = async (): Promise<Service[]> => {
  return services;
};

const getTestimonials = async (): Promise<Testimonial[]> => {
  return testimonials;
};

export const Mock = {
  getServices,
  getTestimonials,
};
