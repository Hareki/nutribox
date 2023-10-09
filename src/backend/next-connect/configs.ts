import type { NextApiRequest, NextApiResponse } from 'next';
import type { Options } from 'next-connect';

import { defaultNcOnError } from 'backend/handlers/defaultNcOnError.handler';
import { defaultNcOnNoMatch } from 'backend/handlers/defaultNcOnNoMatch.handler';

export const DEFAULT_NC_CONFIGS: Options<NextApiRequest, NextApiResponse> = {
  onError: defaultNcOnError,
  onNoMatch: defaultNcOnNoMatch,
};
