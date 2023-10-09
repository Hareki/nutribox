import { z } from 'zod';

import { zodString, zodUuid } from './helper';

const ReviewResponseSchema = z.object({
  id: zodUuid('ReviewResponse.Id'),

  review: zodUuid('ReviewResponse.ReviewId'),

  comment: zodString('ReviewResponse.Comment', 1, 500),

  employee: zodUuid('ReviewResponse.EmployeeId'),
});

type ReviewResponseModel = z.infer<typeof ReviewResponseSchema>;

export { ReviewResponseSchema };
export type { ReviewResponseModel };
