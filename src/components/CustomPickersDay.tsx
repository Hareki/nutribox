import { styled } from '@mui/material/styles';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

interface CustomPickersDayProps extends PickersDayProps<any> {
  selected_color: string;
}

const CustomPickersDay = styled(PickersDay)<CustomPickersDayProps>(
  ({ theme, selected_color }) => ({
    '&.Mui-selected': {
      color: selected_color,
    },
  }),
);

export default CustomPickersDay;
