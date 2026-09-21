import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // moon (switch to dark)
import Brightness7Icon from '@mui/icons-material/Brightness7'; // sun (switch to light)
import { useColorMode } from '../theme/ColorModeContext';   // 👈 fixed path

const ThemeToggleButton = () => {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton onClick={toggleColorMode} sx={{ color: '#fff' }}>
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;