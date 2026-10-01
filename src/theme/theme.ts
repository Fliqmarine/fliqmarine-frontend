import { createTheme } from '@mui/material/styles';
import type { PaletteMode, Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      tableWidth: number | string;
    };
  }
  interface ThemeOptions {
    custom?: {
      tableWidth?: number | string;
    };
  }
}

// Brand palette — single source of truth for all theme colors
const COLORS = {
  primaryLightMain: '#97AB3E',
  // primaryLightMain: '#dd9000',
  primaryDarkMain: '#fbfbfb',
  primaryLight: '#5E92F3',
  primaryHoverLight: '#00283e',
  primaryHoverDark: '#97AB3E',
  // primaryHoverDark: '#dd9000',
  primaryContrastLight: '#fcfdff',
  primaryContrastDark: '#00283e',

  secondaryLight: '#0a1929',
  secondaryDark: '#1b2a41',

  backgroundDefaultLight: '#fafff8',
  backgroundDefaultDark: '#0a1929',

  backgroundPaperLight: '#ffffff',
  backgroundPaperDark: '#0f1b2a',
} as const;

/**
 * Returns a fully configured theme for the given mode ('light' | 'dark').
 * Primary color stays the same dark-blue brand color in both modes;
 * everything else (background, text, paper) adapts automatically.
 */
export const getTheme = (mode: PaletteMode): Theme =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? COLORS.primaryDarkMain : COLORS.primaryLightMain,
        light: COLORS.primaryLight,
        dark: mode === 'dark' ? COLORS.primaryHoverDark : COLORS.primaryHoverLight, // hover color for contained buttons
        contrastText: mode === 'dark' ? COLORS.primaryContrastDark : COLORS.primaryContrastLight,
      },
      secondary: {
        main: mode === 'dark' ? COLORS.secondaryDark : COLORS.secondaryLight,
      },
      background: {
        default: mode === 'dark' ? COLORS.backgroundDefaultDark : COLORS.backgroundDefaultLight,
        paper: mode === 'dark' ? COLORS.backgroundPaperDark : COLORS.backgroundPaperLight,
      },
    },
  });

export default getTheme;