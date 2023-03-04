import { Box, Chip } from '@mui/material';
import { FC, Fragment, useEffect, useState } from 'react';

import { FlexRowCenter } from 'components/flex-box';

// ========================================================
type Step = { title: string; disabled: boolean };
type StepperProps = {
  stepperList: Step[];
  selectedStep: number;
  onChange: (step: number) => void;
};
// ========================================================

const Stepper: FC<StepperProps> = ({
  selectedStep = 1,
  stepperList,
  onChange,
}) => {
  const [selected, setSelected] = useState(selectedStep - 1);

  const handleStepClick = (step: Step, index: number) => () => {
    if (!step.disabled) {
      setSelected(index);
      if (onChange) onChange(index);
    }
  };

  useEffect(() => {
    setSelected(selectedStep - 1);
  }, [selectedStep]);

  return (
    <FlexRowCenter flexWrap='wrap' my='-4px'>
      {stepperList.map((step, index) => (
        <Fragment key={step.title}>
          <Chip
            disabled={step.disabled}
            label={`${index + 1}. ${step.title}`}
            onClick={handleStepClick(step, index)}
            sx={{
              backgroundColor:
                index <= selected ? 'primary.main' : 'primary.light',
              color:
                index <= selected ? 'primary.contrastText' : 'primary.main',
              p: '0.5rem 1rem',
              fontSize: '14px',
              fontWeight: '600',
              my: '4px',
              '&:hover:not(:disabled)': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
              },
            }}
          />
          {index < stepperList.length - 1 && (
            <Box
              width='50px'
              height='4px'
              bgcolor={index < selected ? 'primary.main' : 'primary.light'}
            />
          )}
        </Fragment>
      ))}
    </FlexRowCenter>
  );
};

export default Stepper;
