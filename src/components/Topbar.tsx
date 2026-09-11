import { useState, MouseEvent } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem as MuiMenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Drawer,
  List,
  ListItemButton,
  Collapse,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';

import { menuConfig } from '../config/menuConfig';
import type { MenuItem } from '../config/menuConfig';
import { LAYOUT_MODE } from '../config/layoutConfig';
import { SIDEBAR_WIDTH } from './Sidebar';

// Keep in sync with Sidebar.tsx
const ACCENT = '#5B7CFA';
const SURFACE = '#0b1c39';

// Static placeholder user — no auth/session, just for display
const STATIC_USER = {
  name: 'Administrator',
  email: 'admin@fliqmarine.com',
};

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [openMenuLabel, setOpenMenuLabel] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>(null);

  const isSidebarMode = LAYOUT_MODE === 'sidebar';
  const showTopNav = !isSidebarMode && !isMobile;

  function handleMenuOpen(event: MouseEvent<HTMLElement>, item: MenuItem) {
    if (item.children) {
      setMenuAnchor(event.currentTarget);
      setOpenMenuLabel(item.label);
    } else if (item.path) {
      navigate(item.path);
    }
  }

  function handleMenuClose() {
    setMenuAnchor(null);
    setOpenMenuLabel(null);
  }

  function isItemActive(item: MenuItem): boolean {
    if (item.path === location.pathname) return true;
    return !!item.children?.some((child) => child.path === location.pathname);
  }

  function handleLogout() {
    setProfileAnchor(null);
    navigate('/login');
  }

  function goTo(path?: string) {
    if (path) navigate(path);
    setMobileNavOpen(false);
    setExpandedMobileGroup(null);
  }

  const initials = STATIC_USER.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const activeChildren = menuConfig.find((m) => m.label === openMenuLabel)?.children;

  const currentPageLabel = (() => {
    for (const item of menuConfig) {
      if (item.path === location.pathname) return item.label;
      const child = item.children?.find((c) => c.path === location.pathname);
      if (child) return child.label;
    }
    return 'Dashboard';
  })();

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: SURFACE,
          // zoom: 0.85,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          ...(isSidebarMode &&
            !isMobile && {
              width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
              ml: `${SIDEBAR_WIDTH}px`,
            }),
        }}
      >
        <Toolbar sx={{ gap: { xs: 1, sm: 1.5 }, px: { xs: 1.5, sm: 3 } }}>
          {/* Hamburger — top-nav layout on mobile, or sidebar layout on mobile */}
          {(!isSidebarMode || isSidebarMode) && isMobile && (
            <IconButton
              edge="start"
              onClick={() => setMobileNavOpen(true)}
              sx={{ color: '#fff', mr: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {!isSidebarMode && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.01em',
                fontSize: { xs: 15, sm: 18 },
                color: '#fcfcff',
                mr: { xs: 1, md: 4 },
                whiteSpace: 'nowrap',
              }}
            >
              FLIQ MARINE
            </Typography>
          )}

          {showTopNav && (
            <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
              {menuConfig.map((item) => {
                const active = isItemActive(item);
                return (
                  <Button
                    key={item.label}
                    onClick={(e) => handleMenuOpen(e, item)}
                    startIcon={item.icon ? <item.icon sx={{ fontSize: 18 }} /> : undefined}
                    endIcon={item.children ? <ExpandMoreIcon fontSize="small" /> : undefined}
                    sx={{
                      color: active ? ACCENT : 'rgba(255, 255, 255, 0.65)',
                      bgcolor: active ? 'rgba(250, 250, 252, 0.1)' : 'transparent',
                      textTransform: 'none',
                      fontWeight: active ? 600 : 500,
                      fontSize: 14,
                      letterSpacing: '-0.005em',
                      px: 1.75,
                      borderRadius: 2,
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {(isSidebarMode || isMobile) && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                letterSpacing: '-0.01em',
                fontSize: { xs: 15, sm: 18 },
                color: '#fcfcfc',
                flexGrow: 1,
              }}
              noWrap
            >
              {currentPageLabel}
            </Typography>
          )}

          {/* Desktop submenu popover */}
          <Menu
            anchorEl={menuAnchor}
            open={!!menuAnchor}
            onClose={handleMenuClose}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            slotProps={{ paper: { sx: { mt: 1, borderRadius: 2 } } }}
          >
            {activeChildren?.map((child) => (
              <MuiMenuItem
                key={child.label}
                selected={child.path === location.pathname}
                onClick={() => goTo(child.path)}
                sx={{ fontSize: 14 }}
              >
                {child.icon && (
                  <ListItemIcon>
                    <child.icon fontSize="small" />
                  </ListItemIcon>
                )}
                {child.label}
              </MuiMenuItem>
            ))}
          </Menu>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 1, my: 1.5, display: { xs: 'none', sm: 'block' } }}
            />

            <Box
              onClick={(e) => setProfileAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                px: 1,
                py: 0.5,
                borderRadius: 2,
                '&:hover': { bgcolor: 'rgba(246, 247, 250, 0.06)' },
              }}
            >
              <Avatar sx={{ bgcolor: ACCENT, width: 34, height: 34, fontSize: 13, fontWeight: 600 }}>
                {initials}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, letterSpacing: '-0.005em', color: '#f9f9f9', lineHeight: 1.2 }}
                >
                  {STATIC_USER.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(254, 254, 255, 0.5)', fontSize: 11.5 }}>
                  {STATIC_USER.email}
                </Typography>
              </Box>
              <ExpandMoreIcon
                fontSize="small"
                sx={{ color: 'rgba(255, 255, 255, 0.4)', display: { xs: 'none', sm: 'block' } }}
              />
            </Box>

            <Menu
              anchorEl={profileAnchor}
              open={!!profileAnchor}
              onClose={() => setProfileAnchor(null)}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              slotProps={{ paper: { sx: { mt: 1, minWidth: 200, borderRadius: 2 } } }}
            >
              <Box sx={{ px: 2, py: 1.25, display: { xs: 'block', sm: 'none' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {STATIC_USER.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {STATIC_USER.email}
                </Typography>
              </Box>
              <Divider sx={{ display: { xs: 'block', sm: 'none' } }} />

              <MuiMenuItem onClick={handleLogout} sx={{ fontSize: 14 }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MuiMenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile navigation drawer — covers both top-nav and sidebar layouts on small screens */}
      <Drawer
        anchor="left"
        open={isMobile && mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        slotProps={{ paper: { sx: { width: 260, bgcolor: SURFACE, color: '#fff' } } }}
      >
        <Box sx={{ px: 2.5, py: 2.5 }}>
          <Typography sx={{ fontWeight: 700, letterSpacing: '-0.01em', fontSize: 16, color: '#fcfcff' }}>
            FLIQ MARINE
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

        <List sx={{ py: 1 }}>
          {menuConfig.map((item) => {
            const active = isItemActive(item);
            const isExpanded = expandedMobileGroup === item.label;

            return (
              <Box key={item.label}>
                <ListItemButton
                  onClick={() =>
                    item.children
                      ? setExpandedMobileGroup(isExpanded ? null : item.label)
                      : goTo(item.path)
                  }
                  sx={{
                    px: 2.5,
                    py: 1.1,
                    color: active ? ACCENT : 'rgba(255,255,255,0.8)',
                    gap: 1.25,
                  }}
                >
                  {item.icon && (
                    <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: { sx: { fontWeight: active ? 600 : 500, fontSize: 14.5, letterSpacing: '-0.005em' } },
                    }}
                  />
                  {item.children && (isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
                </ListItemButton>

                {item.children && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItemButton
                          key={child.label}
                          onClick={() => goTo(child.path)}
                          selected={child.path === location.pathname}
                          sx={{ pl: 5, py: 0.9, color: 'rgba(255,255,255,0.7)', gap: 1.25 }}
                        >
                          {child.icon && (
                            <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>
                              <child.icon sx={{ fontSize: 17 }} />
                            </ListItemIcon>
                          )}
                          <ListItemText
                            primary={child.label}
                            slotProps={{ primary: { sx: { fontSize: 13.5 } } }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}