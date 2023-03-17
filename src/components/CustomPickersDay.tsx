import { styled } from '@mui/material/styles';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

interface CustomPickersDayProps extends PickersDayProps<any> {
  selectedColor: string;
}

const CustomPickersDay = styled(PickersDay)<CustomPickersDayProps>(
  ({ theme, selectedColor }) => ({
    '&.Mui-selected': {
      color: selectedColor,
    },
  }),
);

export default CustomPickersDay;
