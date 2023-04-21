import { forwardRef } from 'react';
import type { NumericFormatProps } from 'react-number-format';
import { NumericFormat } from 'react-number-format';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  prefix: string;
}

const CurrencyInput = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, prefix, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix={prefix}
      />
    );
  },
);

export default CurrencyInput;