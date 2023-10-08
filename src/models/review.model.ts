import { z } from 'zod';

import { zodDate, zodNumber, zodString, zodUuid } from './helper';

const ReviewSchema = z.object({
  id: zodUuid('Review.Id'),
  createdAt: zodDate('Review.CreatedAt'),
  customerOrderItemId: zodUuid('Review.CustomerOrderItemId'),
  comment: zodString('Review.Comment', 1, 500).optional(),
  star: zodNumber('Review.Star', 'float', 1, 5).refine(
    (star) => star - Math.floor(star) === 0 || star - Math.floor(star) === 0.5,
    {
      message: 'Review.Star.InvalidFormat',
    },
  ),
});

type ReviewModel = z.infer<typeof ReviewSchema>;

export { ReviewSchema };
export type { ReviewModel };
