import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { LAYOUT_MODE } from '../config/layoutConfig';

export default function Layout() {
  const isSidebarMode = LAYOUT_MODE === 'sidebar';

  return (
    <Box sx={{ display: 'flex' }}>
      {isSidebarMode && <Sidebar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
        }}
      >
        <Topbar />
        {/* Spacer to push content below the fixed Topbar */}
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}