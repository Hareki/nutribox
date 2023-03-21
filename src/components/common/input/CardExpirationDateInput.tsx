import IMask from 'imask';
import React from 'react';
import { IMaskInput } from 'react-imask';
interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const CardExpDateInput = React.forwardRef<HTMLInputElement, CustomProps>(
  (props, ref) => {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask='MM{/}YY'
        placeholderChar=''
        blocks={{
          MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
            maxLength: 2,
          },
          YY: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 99,
            maxLength: 2,
          },
        }}
        inputRef={ref}
        overwrite
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  },
);
CardExpDateInput.displayName = 'CardExpDateInput';

export default CardExpDateInput;
