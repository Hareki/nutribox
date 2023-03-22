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
  onValueChange?: (value: number) => void;
}
const NumberSpinner = forwardRef<HTMLInputElement, NumberSpinnerProps>(
  ({ steps = 1, min = 1, max = 100, onValueChange }, ref) => {
    const [internalValue, setInternalValue] = useState(min);
    const [mouseDirection, setMouseDirection] = useState<MouseDirection>(null);

    useInterval(
      () => handleButtonChange(mouseDirection),
      mouseDirection ? 100 : null,
    );

    useEffect(() => {
      onValueChange(internalValue);
    }, [internalValue, onValueChange]);

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

    const handleButtonChange = (direction: MouseDirection) => {
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
          onClick={() => handleButtonChange('down')}
          onMouseDown={() => setMouseDirection('down')}
          onMouseOut={() => setMouseDirection(null)}
          onMouseUp={() => setMouseDirection(null)}
        >
          <RemoveRoundedIcon />
        </IconButton>
        <input
          ref={ref}
          type='number'
          step={steps}
          value={internalValue}
          onChange={handleChange}
          min={min}
          max={max}
        />
        <IconButton
          onClick={() => handleButtonChange('up')}
          onMouseDown={() => setMouseDirection('up')}
          onMouseUp={() => setMouseDirection(null)}
          onMouseOut={() => setMouseDirection(null)}
        >
          <AddRoundedIcon />
        </IconButton>
      </StyledNumberSpinner>
    );
  },
);

NumberSpinner.displayName = 'NumberSpinner';
export default NumberSpinner;
