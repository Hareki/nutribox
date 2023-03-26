import { TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import React from 'react';

import type { WeekDays } from '.';

import { H5, Paragraph } from 'components/abstract/Typography';
import { FlexBox } from 'components/flex-box';
import { getDayOfWeekLabel } from 'helpers/storeHours.helper';

interface StoreHoursInputProps {
  dayOfWeek: WeekDays;
  fromValue: Date | null;
  toValue: Date | null;
  onFromChange: (value: any) => void;
  onToChange: (value: any) => void;
  fromError?: boolean;
  fromHelperText?: string;
  toError?: boolean;
  toHelperText?: string;
}

const StoreHoursInput = ({
  dayOfWeek,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  fromError,
  fromHelperText,
  toError,
  toHelperText,
}: StoreHoursInputProps) => {
  return (
    <FlexBox alignItems='center' flexWrap='wrap' justifyContent='space-between'>
      <H5>{getDayOfWeekLabel(dayOfWeek)}</H5>
      <FlexBox alignItems='flex-start' gap={1} my={1}>
        <TimePicker
          value={fromValue}
          onChange={onFromChange}
          renderInput={(params) => (
            <TextField
              {...params}
              error={fromError}
              helperText={(fromError && fromHelperText) as string}
            />
          )}
        />
        <Paragraph mt={1}>đến</Paragraph>
        <TimePicker
          value={toValue}
          onChange={onToChange}
          renderInput={(params) => (
            <TextField
              {...params}
              error={toError}
              helperText={(toError && toHelperText) as string}
            />
          )}
        />
      </FlexBox>
    </FlexBox>
  );
};

export default StoreHoursInput;
