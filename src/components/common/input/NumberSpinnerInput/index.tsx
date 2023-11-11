import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { IconButton } from '@mui/material';
import type { ChangeEvent } from 'react';
import { useEffect } from 'react';
import { useState, forwardRef } from 'react';
import { useInterval } from 'usehooks-ts';

import StyledNumberSpinner from './styles';

type MouseDirection = 'up' | 'down';

interface NumberSpinnerProps {
  steps?: number;
  min?: number;
  max?: number;
  initialValue: number;
  value: number;
  setValue: (value: number) => void;
}
const NumberSpinner = forwardRef<HTMLInputElement, NumberSpinnerProps>(
  ({ steps = 1, min = 0, max = 100, value, setValue, initialValue }, ref) => {
    const [internalValue, setInternalValue] = useState(initialValue);
    const [mouseDirection, setMouseDirection] = useState<MouseDirection>();

    useInterval(
      () => handleButtonChange(mouseDirection),
      mouseDirection ? 200 : null,
    );

    useEffect(() => {
      setInternalValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
      setValue(internalValue);
    }, [internalValue, setValue]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setInternalValue(() => {
        const nextNumeric = +event.target.value;
        if (nextNumeric < min) {
          return min;
        }
        if (nextNumeric > max) {
          return max;
        }
        return nextNumeric;
      });
    };

    const handleButtonChange = (direction: MouseDirection | undefined) => {
      setInternalValue((current) => {
        let next: number;

        switch (direction) {
          case 'up':
            next = current + steps;
            break;
          case 'down':
            next = current - steps;
            break;
          default:
            next = current;
            break;
        }

        if (next < min || next > max) {
          return current;
        }

        return next;
      });
    };

    return (
      <StyledNumberSpinner>
        <IconButton
          color='primary'
          onClick={() => handleButtonChange('down')}
          onMouseDown={() => setMouseDirection('down')}
          onMouseOut={() => setMouseDirection(undefined)}
          onMouseUp={() => setMouseDirection(undefined)}
        >
          <RemoveRoundedIcon />
        </IconButton>
        <input
          ref={ref}
          type='number'
          step={steps}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
        />
        <IconButton
          color='primary'
          onClick={() => handleButtonChange('up')}
          onMouseDown={() => setMouseDirection('up')}
          onMouseUp={() => setMouseDirection(undefined)}
          onMouseOut={() => setMouseDirection(undefined)}
        >
          <AddRoundedIcon />
        </IconButton>
      </StyledNumberSpinner>
    );
  },
);

NumberSpinner.displayName = 'NumberSpinner';
export default NumberSpinner;
