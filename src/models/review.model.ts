import { z } from 'zod';

import type { CustomerOrderItemModel } from './customerOrderItem.model';
import { zodDate, zodNumber, zodString, zodUuid } from './helper';

const ReviewSchema = z.object({
  id: zodUuid('Review.Id'),

  customerOrderItem: zodUuid('Review.CustomerOrderItemId'),

  createdAt: zodDate('Review.CreatedAt'),

  updatedAt: zodDate('Review.UpdatedAt'),

  comment: zodString('Review.Comment', 1, 500).optional(),

  star: zodNumber('Review.Star', 'float', 1, 5).refine(
    (star) => star - Math.floor(star) === 0 || star - Math.floor(star) === 0.5,
    {
      message: 'Review.Star.InvalidFormat',
    },
  ),
});

type ReviewModel = z.infer<typeof ReviewSchema>;

type ReviewReferenceKeys = keyof Pick<ReviewModel, 'customerOrderItem'>;

type PopulateField<K extends keyof ReviewModel> = K extends 'customerOrderItem'
  ? CustomerOrderItemModel
  : never;

type PopulateReviewFields<K extends ReviewReferenceKeys> = Omit<
  ReviewModel,
  K
> & {
  [P in K]: PopulateField<P>;
};

type FullyPopulatedReviewModel = PopulateReviewFields<ReviewReferenceKeys>;

export { ReviewSchema };
export type { ReviewModel, FullyPopulatedReviewModel, PopulateReviewFields };
