import { z } from 'zod';

import type { EmployeeModel } from './employee.model';
import { zodDate, zodString, zodUuid } from './helper';
import type { ReviewModel } from './review.model';

const ReviewResponseSchema = z.object({
  id: zodUuid('ReviewResponse.Id'),

  createdAt: zodDate('ReviewResponse.CreatedAt'),

  review: zodUuid('ReviewResponse.ReviewId'),

  employee: zodUuid('ReviewResponse.EmployeeId'),

  updatedAt: zodDate('ReviewResponse.UpdatedAt'),

  comment: zodString('ReviewResponse.Comment', 1, 500),
});

type ReviewResponseModel = z.infer<typeof ReviewResponseSchema>;

type ReviewResponseReferenceKeys = keyof Pick<
  ReviewResponseModel,
  'review' | 'employee'
>;

type PopulateField<K extends keyof ReviewResponseModel> = K extends 'review'
  ? ReviewModel
  : K extends 'employee'
  ? EmployeeModel
  : never;

type PopulateReviewResponseFields<K extends ReviewResponseReferenceKeys> = Omit<
  ReviewResponseModel,
  K
> & {
  [P in K]: PopulateField<P>;
};

type FullyPopulatedReviewResponseModel =
  PopulateReviewResponseFields<ReviewResponseReferenceKeys>;

export { ReviewResponseSchema };
export type {
  ReviewResponseModel,
  FullyPopulatedReviewResponseModel,
  PopulateReviewResponseFields,
};
