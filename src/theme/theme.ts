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
        main: '#1565C0',   // dark blue — your brand color
        light: '#5E92F3',
        dark: '#003C8F',
        contrastText: '#ffffff',
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