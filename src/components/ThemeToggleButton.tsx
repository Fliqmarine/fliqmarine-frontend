import { IconButton, Tooltip } from '@mui/material';
import { useColorMode } from '../theme/ColorModeContext';   // 👈 fixed path
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const ThemeToggleButton = () => {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton onClick={toggleColorMode} sx={{ color: '#fff' }}>
        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;