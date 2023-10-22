import { forwardRef } from 'react';
import type { NumberFormatBaseProps } from 'react-number-format';
import { NumberFormatBase, useNumericFormat } from 'react-number-format';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  prefix: string;
  allowEmptyFormatting?: boolean;
}

const CurrencyInput = forwardRef<NumberFormatBaseProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const {
      onChange,
      prefix = '',
      allowEmptyFormatting = true,
      ...other
    } = props;
    const { format } = useNumericFormat(props);

    const _format = (numStr: string) => {
      const numberFormatter = Intl.NumberFormat('en-US');
      // const formattedValue = format?.(numStr).for() || '';
      let formattedValue = numberFormatter.format(Number(numStr));
      if (formattedValue === '0') formattedValue = '';
      return allowEmptyFormatting && formattedValue === ''
        ? prefix
        : formattedValue;
    };

    return (
      <NumberFormatBase
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
        format={_format}
      />
    );
  },
);

export default CurrencyInput;
