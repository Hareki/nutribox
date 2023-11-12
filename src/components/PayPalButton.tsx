import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

import type { GeneralFunction } from 'types/common';

type Props = {
  orderId: string;
  usdPrice: number;
  updateOnlinePayment: GeneralFunction;
};

const PayPalButton: React.FC<Props> = ({
  orderId,
  updateOnlinePayment,
  usdPrice,
}) => {
  return (
    <div>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        }}
      >
        <PayPalButtons
          style={{
            layout: 'horizontal',
            color: 'silver',
            height: 44,
          }}
          createOrder={(data, actions) => {
            console.log('file: PayPalButton.tsx:28 - data:', data);
            return actions.order.create({
              purchase_units: [
                {
                  amount: { value: usdPrice.toString() },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            console.log(
              'file: PayPalButton.tsx:34 - onApprove={ - data:',
              data,
            );

            actions.order?.capture().then(function (details) {
              console.log('file: PayPalButton.tsx:43 - details:', details);

              updateOnlinePayment({
                id: orderId,
                onlineTransactionId: details.id,
              });
            });
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalButton;
