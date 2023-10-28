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
  isEditing: boolean;
  handleTouchedBlur: (fieldName: string) => () => void;
  name: string;
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
  isEditing,
  handleTouchedBlur,
  name,
}: StoreHoursInputProps) => {
  return (
    <FlexBox
      alignItems='flex-start'
      flexWrap='wrap'
      justifyContent='space-between'
    >
      <H5 mt={2} width={80}>
        {getDayOfWeekLabel(dayOfWeek)}
      </H5>
      <FlexBox alignItems='flex-start' gap={1} my={1} flexGrow={1}>
        <TimePicker
          ampm={false}
          value={fromValue}
          onChange={onFromChange}
          readOnly={!isEditing}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              error={fromError}
              helperText={(fromError && fromHelperText) as string}
              onBlur={handleTouchedBlur(name)}
              sx={{
                flexGrow: 1,
              }}
            />
          )}
        />
        <Paragraph mt={1}>-</Paragraph>
        <TimePicker
          ampm={false}
          value={toValue}
          onChange={onToChange}
          readOnly={!isEditing}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              error={toError}
              helperText={(toError && toHelperText) as string}
              onBlur={handleTouchedBlur(name)}
              sx={{
                flexGrow: 1,
              }}
            />
          )}
        />
      </FlexBox>
    </FlexBox>
  );
};

export default StoreHoursInput;
