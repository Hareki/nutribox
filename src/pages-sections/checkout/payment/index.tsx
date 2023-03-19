import type { ReactElement } from 'react';

import type { IAccount } from 'api/models/Account.model/types';
import PageLayout from 'components/layouts/PageLayout';

Payment.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

interface PaymentProps {
  nextStep: () => void;
  prevStep: () => void;
  account: IAccount;
}

function Payment({ account, nextStep, prevStep }: PaymentProps): ReactElement {
  return <h1>test</h1>;
}

export default Payment;
