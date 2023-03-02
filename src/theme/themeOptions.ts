import { ThemeOptions } from '@mui/material/styles';

import { components } from './components';
import { primary, themeColors } from './themeColors';
import { typography } from './typography';

const THEMES = {
  DEFAULT: 'DEFAULT',
  HEALTH: 'HEALTH',
};

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

const themesOptions: ThemeOptions = {
  [THEMES.DEFAULT]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: { primary: { ...primary, light: primary[100] }, ...themeColors },
  },
};

const themeOptions = (publicRuntimeConfig?: any, pathname?: string) => {
  // publicRuntimeConfig.theme = themesOptions[THEMES.DEFAULT];
  const themeOptions: ThemeOptions = themesOptions[THEMES.DEFAULT];

  return themeOptions;
};

export default themeOptions;
