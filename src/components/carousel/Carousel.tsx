import { ArrowBack, ArrowForward } from '@mui/icons-material';
import type { SxProps } from '@mui/material';
import clsx from 'clsx';
import { Slide } from 'pure-react-carousel';
import type { CSSProperties, FC, ReactNode } from 'react';
import { Fragment, Children } from 'react';

import 'pure-react-carousel/dist/react-carousel.es.css';
import {
  StyledDot,
  StyledSlider,
  StyledDotGroup,
  StyledArrowBackButton,
  StyledArrowNextButton,
  StyledCarouselProvider,
} from './styles';

import useSettings from 'hooks/useSettings';

// ===================================================================
export interface CarouselProps {
  children?: ReactNode;
  sx?: SxProps;
  step?: number;
  interval?: number;
  infinite?: boolean;
  autoPlay?: boolean;
  totalSlides: number;
  currentSlide?: number;
  visibleSlides?: number;
  naturalSlideWidth?: number;
  naturalSlideHeight?: number;
  isIntrinsicHeight?: boolean;
  hasMasterSpinner?: boolean;
  dotClass?: string;
  dotColor?: string;
  showDots?: boolean;
  dotGroupMarginTop?: string;
  spacing?: string;
  showArrow?: boolean;
  showArrowOnHover?: boolean;
  arrowButtonClass?: string;
  leftButtonClass?: string;
  rightButtonClass?: string;
  leftButtonStyle?: CSSProperties;
  rightButtonStyle?: CSSProperties;
  arrowButtonColor?: 'primary' | 'secondary' | 'inherit';
  dragEnabled?: boolean;
}
// ===================================================================

const Carousel: FC<CarouselProps> = ({
  sx,
  step,
  spacing,
  infinite,
  children,
  autoPlay,
  interval,
  showDots,
  dotClass,
  dotColor,
  showArrow,
  totalSlides,
  currentSlide,
  visibleSlides,
  leftButtonClass,
  leftButtonStyle,
  arrowButtonClass,
  rightButtonClass,
  rightButtonStyle,
  hasMasterSpinner,
  isIntrinsicHeight,
  naturalSlideWidth,
  dotGroupMarginTop,
  naturalSlideHeight,
  dragEnabled,
}) => {
  // site settings
  const { settings } = useSettings();

  return (
    <StyledCarouselProvider
      dragEnabled={dragEnabled}
      sx={sx}
      step={step}
      spacing={spacing}
      interval={interval}
      infinite={infinite}
      isPlaying={autoPlay}
      totalSlides={totalSlides}
      currentSlide={currentSlide}
      visibleSlides={visibleSlides}
      hasMasterSpinner={hasMasterSpinner}
      isIntrinsicHeight={isIntrinsicHeight}
      naturalSlideWidth={naturalSlideWidth || 100}
      naturalSlideHeight={naturalSlideHeight || 125}
    >
      <StyledSlider spacing={spacing}>
        {Children.map(children, (child, index) => (
          <Slide index={index}>{child}</Slide>
        ))}
      </StyledSlider>

      {showDots && (
        <StyledDotGroup
          className={clsx(dotClass)}
          dot_margin_top={dotGroupMarginTop}
          renderDots={(props: any) => renderDots({ ...props, step, dotColor })}
        />
      )}

      {showArrow && (
        <Fragment>
          <StyledArrowBackButton
            id='backArrowButton'
            sx={{ left: '-20px' }}
            style={leftButtonStyle || {}}
            show_dots='true'
            dot_margin_top='20px'
            className={clsx(arrowButtonClass, leftButtonClass)}
          >
            {settings.direction === 'ltr' ? (
              <ArrowBack fontSize='small' color='inherit' />
            ) : (
              <ArrowForward fontSize='small' color='inherit' />
            )}
          </StyledArrowBackButton>

          <StyledArrowNextButton
            id='backForwardButton'
            sx={{ right: '-20px' }}
            style={rightButtonStyle || {}}
            show_dots='true'
            dot_margin_top='20px'
            className={clsx(arrowButtonClass, rightButtonClass)}
          >
            {settings.direction === 'ltr' ? (
              <ArrowForward fontSize='small' color='inherit' />
            ) : (
              <ArrowBack fontSize='small' color='inherit' />
            )}
          </StyledArrowNextButton>
        </Fragment>
      )}
    </StyledCarouselProvider>
  );
};

const renderDots = ({
  step,
  dotColor,
  totalSlides,
  currentSlide,
  visibleSlides,
  carouselStore,
}: any) => {
  const dots = [] as any[];
  const total = totalSlides - visibleSlides + 1;
  // handle dot button
  const handleClick = (currentSlide: any, autoplay: boolean) => {
    carouselStore.setStoreState({
      autoPlay: autoplay,
      currentSlide,
    });
  };

  for (let i = 0; i < total; i += step) {
    dots.push(
      <StyledDot
        dot_color={dotColor}
        onClick={() => handleClick(i, false)}
        dot_active={currentSlide === i ? i + 1 : 0}
        key={(Math.random() * i + Date.now()).toString()}
      />,
    );

    if (total - (i + 1) < step && total - (i + 1) !== 0) {
      dots.push(
        <StyledDot
          dot_color={dotColor}
          dot_active={totalSlides - visibleSlides}
          key={(Math.random() * i + Date.now()).toString()}
          onClick={() => handleClick(totalSlides - visibleSlides, false)}
        />,
      );
    }
  }
  return dots;
};

Carousel.defaultProps = {
  sx: {},
  step: 1,
  interval: 2000,
  showDots: false,
  showArrow: true,
  autoPlay: false,
  infinite: false,
  totalSlides: 10,
  visibleSlides: 5,
  spacing: '1.5rem',
  naturalSlideWidth: 100,
  naturalSlideHeight: 125,
  hasMasterSpinner: false,
  isIntrinsicHeight: true,
  dotGroupMarginTop: '2rem',
  arrowButtonColor: 'secondary',
  dragEnabled: true,
};

export default Carousel;
