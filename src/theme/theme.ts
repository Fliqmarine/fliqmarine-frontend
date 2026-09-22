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
        main: mode === 'dark' ? '#fbfbfb' : '#163058',
        light: '#5E92F3',
        dark: mode === 'dark' ? '#90dcff' : '#050c18', // hover color for contained buttons
        contrastText: mode === 'dark' ? '#00283e' : '#fcfdff',
      },
      secondary: {
        main: mode === 'dark' ? '#1b2a41' : '#0a1929',
      },
      background: {
        default: mode === 'dark' ? '#0a1929' : '#f5f6fa',
        paper: mode === 'dark' ? '#0f1b2a' : '#ffffff',
      },
    },
  });

export default getTheme;