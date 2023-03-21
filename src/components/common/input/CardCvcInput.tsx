import React from 'react';
import { IMaskInput } from 'react-imask';
interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}
const CardCvcInput = React.forwardRef<HTMLInputElement, CustomProps>(
  (props, ref) => {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask='000'
        inputRef={ref}
        overwrite
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  },
);
CardCvcInput.displayName = 'CardCvcInput';

export default CardCvcInput;
