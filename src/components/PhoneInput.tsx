import React from 'react';
import { IMaskInput } from 'react-imask';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, CustomProps>(
  (props, ref) => {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask='000-000-0000'
        inputRef={ref}
        overwrite
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  },
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
