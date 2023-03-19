import { Box, Chip } from '@mui/material';
import type { FC } from 'react';
import { Fragment } from 'react';

import { FlexRowCenter } from 'components/flex-box';

// ========================================================
type Step = { title: string; disabled: boolean };
type StepperProps = {
  stepperList: Step[];
  selectedStep: number;
};
// ========================================================

const Stepper: FC<StepperProps> = ({ selectedStep, stepperList }) => {
  return (
    <FlexRowCenter flexWrap='wrap' my='-4px'>
      {stepperList.map((step, index) => (
        <Fragment key={step.title}>
          <Chip
            disabled={step.disabled}
            label={`${index + 1}. ${step.title}`}
            sx={{
              backgroundColor:
                index <= selectedStep ? 'primary.main' : 'primary.light',
              color: index <= selectedStep ? 'white' : 'primary.main',
              p: '0.5rem 1rem',
              fontSize: '14px',
              fontWeight: '600',
              my: '4px',
              '&:hover:not(:disabled)': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          />
          {index < stepperList.length - 1 && (
            <Box
              width='50px'
              height='4px'
              bgcolor={index < selectedStep ? 'primary.main' : 'primary.light'}
            />
          )}
        </Fragment>
      ))}
    </FlexRowCenter>
  );
};

export default Stepper;
