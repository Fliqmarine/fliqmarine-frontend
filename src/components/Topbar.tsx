import { useState, useRef, MouseEvent } from 'react';
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
  Popper,
  Paper,
  MenuList,
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
import ThemeToggleButton from './ThemeToggleButton';

// Keep in sync with Sidebar.tsx — same brand colors as before, just used
// with more restraint: olive now marks state (active/selected) rather
// than filling backgrounds, so it reads as an accent, not a block of color.
const ACCENT = '#97AB3E';
const SURFACE = '#0b1c39';
const SURFACE_RAISED = '#0e2143'; // one step lighter, for hover/pressed states
const INK = '#f6f7f5';
const INK_DIM = 'rgba(246, 247, 245, 0.56)';
const HAIRLINE = 'rgba(151, 171, 62, 0.22)'; // olive hairline instead of white-on-white

// A distinct modern grotesk — more character than a generic system stack,
// while staying clean enough for dense UI text.
const FONT_STACK =
  '"Plus Jakarta Sans", "General Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

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

  // Short delay before closing so the cursor can travel from the nav
  // button to the dropdown without the dropdown disappearing.
  const closeTimer = useRef<number | null>(null);

  const isSidebarMode = LAYOUT_MODE === 'sidebar';
  const showTopNav = !isSidebarMode && !isMobile;

  function cancelClose() {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function handleMenuClose() {
    cancelClose();
    setMenuAnchor(null);
    setOpenMenuLabel(null);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = window.setTimeout(handleMenuClose, 120);
  }

  function handleMenuOpen(el: HTMLElement, item: MenuItem) {
    cancelClose();
    if (item.children) {
      setMenuAnchor(el);
      setOpenMenuLabel(item.label);
    } else {
      handleMenuClose();
    }
  }

  function isItemActive(item: MenuItem): boolean {
    if (
      location.pathname === item.path ||
      location.pathname.startsWith(`${item.path}/`)
    ) {
      return true;
    }

    return !!item.children?.some(
      (child) =>
        location.pathname === child.path ||
        location.pathname.startsWith(`${child.path}/`)
    );
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

  // Shared popover styling — deep navy panel, olive hairline, soft
  // diffused shadow instead of MUI's default grey card shadow.
  const menuSlotProps = {
    paper: {
      sx: {
        mt: 1,
        borderRadius: 2,
        bgcolor: SURFACE_RAISED,
        border: `1px solid ${HAIRLINE}`,
        boxShadow: '0 20px 48px rgba(3, 9, 22, 0.55)',
        color: INK,
        overflow: 'hidden',
      },
    },
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: SURFACE,
          borderBottom: `1px solid ${HAIRLINE}`,
          boxShadow: '0 1px 0 rgba(0,0,0,0.2), 0 12px 32px rgba(3, 9, 22, 0.28)',
          fontFamily: FONT_STACK,
          ...(isSidebarMode &&
            !isMobile && {
              width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
              ml: `${SIDEBAR_WIDTH}px`,
            }),
        }}
      >
        <Toolbar sx={{ gap: { xs: 1, sm: 1.5 }, px: { xs: 1.5, sm: 3 }, minHeight: { xs: 52, sm: 58 } }}>
          {/* Hamburger — top-nav layout on mobile, or sidebar layout on mobile */}
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setMobileNavOpen(true)}
              sx={{
                color: INK_DIM,
                mr: 0.5,
                borderRadius: 1.5,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: INK },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {!isSidebarMode && (
            <Typography
              variant="h6"
              sx={{
                fontFamily: FONT_STACK,
                fontWeight: 600,
                letterSpacing: '0.06em',
                fontSize: { xs: 12.5, sm: 13.5 },
                color: INK,
                mr: { xs: 1.5, md: 5 },
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
              }}
            >
              Fliq{' '}
              <Box component="span" sx={{ color: ACCENT }}>
                Marine
              </Box>
            </Typography>
          )}

          {showTopNav && (
            <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
              {menuConfig.map((item) => {
                const active = isItemActive(item);
                return (
                  <Box
                    key={item.label}
                    onMouseEnter={(e: MouseEvent<HTMLElement>) =>
                      handleMenuOpen(e.currentTarget, item)
                    }
                    onMouseLeave={scheduleClose}
                  >
                    <Button
                      onClick={() => {
                        if (item.path && !item.children) navigate(item.path);
                      }}
                      disableRipple
                      startIcon={item.icon ? <item.icon sx={{ fontSize: 17 }} /> : undefined}
                      endIcon={item.children ? <ExpandMoreIcon sx={{ fontSize: 15 }} /> : undefined}
                      sx={{
                        fontFamily: FONT_STACK,
                        color: active ? SURFACE : INK_DIM,
                        bgcolor: active ? ACCENT : 'transparent',
                        textTransform: 'none',
                        fontWeight: active ? 700 : 500,
                        fontSize: 13,
                        letterSpacing: '-0.005em',
                        px: 1.5,
                        py: 0.5,
                        minHeight: 32,
                        borderRadius: 999,
                        transition: 'background-color 160ms ease, color 160ms ease',
                        '&:hover': {
                          bgcolor: active ? ACCENT : 'rgba(255,255,255,0.06)',
                          color: active ? SURFACE : INK,
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  </Box>
                );
              })}
            </Box>
          )}

          {(isSidebarMode || isMobile) && (
            <Typography
              variant="h6"
              sx={{
                fontFamily: FONT_STACK,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                fontSize: { xs: 15.5, sm: 17.5 },
                color: INK,
                flexGrow: 1,
              }}
              noWrap
            >
              {currentPageLabel}
            </Typography>
          )}

          {/* Desktop submenu — opens on hover (non-modal Popper, no backdrop) */}
          <Popper
            open={!!menuAnchor && !!activeChildren}
            anchorEl={menuAnchor}
            placement="bottom-start"
            sx={{ zIndex: theme.zIndex.appBar + 1 }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {/* pt (not mt) so there's no dead gap between button and dropdown */}
            <Box sx={{ pt: 1 }}>
              <Paper
                elevation={0}
                sx={{ ...menuSlotProps.paper.sx, mt: 0, minWidth: 190, py: 0.5 }}
              >
                <MenuList autoFocusItem={false} sx={{ py: 0 }}>
                {activeChildren?.map((child) => (
                  <MuiMenuItem
                    key={child.label}
                    selected={child.path === location.pathname}
                    onClick={() => {
                      goTo(child.path);
                      handleMenuClose();
                    }}
                    sx={{
                      fontFamily: FONT_STACK,
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: INK_DIM,
                      mx: 0.75,
                      my: 0.25,
                      borderRadius: 1.5,
                      '&.Mui-selected': { bgcolor: 'rgba(151, 171, 62, 0.14)', color: ACCENT },
                      '&.Mui-selected:hover': { bgcolor: 'rgba(151, 171, 62, 0.2)' },
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: INK },
                    }}
                  >
                    {child.icon && (
                      <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>
                        <child.icon fontSize="small" />
                      </ListItemIcon>
                    )}
                    {child.label}
                  </MuiMenuItem>
                ))}
                </MenuList>
              </Paper>
            </Box>
          </Popper>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <ThemeToggleButton />
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 1, my: 1.5, display: { xs: 'none', sm: 'block' }, borderColor: HAIRLINE }}
            />

            <Box
              onClick={(e) => setProfileAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.1,
                cursor: 'pointer',
                px: 0.75,
                py: 0.4,
                borderRadius: 2,
                transition: 'background-color 160ms ease',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'rgba(151, 171, 62, 0.16)',
                  color: ACCENT,
                  width: 30,
                  height: 30,
                  fontSize: 11.5,
                  fontWeight: 700,
                  fontFamily: FONT_STACK,
                  border: `1px solid ${HAIRLINE}`,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: FONT_STACK,
                    fontWeight: 600,
                    letterSpacing: '-0.005em',
                    color: INK,
                    lineHeight: 1.25,
                    fontSize: 13.5,
                  }}
                >
                  {STATIC_USER.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontFamily: FONT_STACK, color: INK_DIM, fontSize: 11.5 }}
                >
                  {STATIC_USER.email}
                </Typography>
              </Box>
              <ExpandMoreIcon
                fontSize="small"
                sx={{ color: INK_DIM, display: { xs: 'none', sm: 'block' }, fontSize: 18 }}
              />
            </Box>

            <Menu
              anchorEl={profileAnchor}
              open={!!profileAnchor}
              onClose={() => setProfileAnchor(null)}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              slotProps={{ paper: { sx: { ...menuSlotProps.paper.sx, minWidth: 210 } } }}
            >
              <Box sx={{ px: 2, py: 1.25, display: { xs: 'block', sm: 'none' } }}>
                <Typography sx={{ fontFamily: FONT_STACK, fontWeight: 600, fontSize: 13.5, color: INK }}>
                  {STATIC_USER.name}
                </Typography>
                <Typography sx={{ fontFamily: FONT_STACK, fontSize: 11.5, color: INK_DIM }}>
                  {STATIC_USER.email}
                </Typography>
              </Box>
              <Divider sx={{ display: { xs: 'block', sm: 'none' }, borderColor: HAIRLINE }} />

              <MuiMenuItem
                onClick={handleLogout}
                sx={{
                  fontFamily: FONT_STACK,
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: INK_DIM,
                  mx: 0.75,
                  my: 0.25,
                  borderRadius: 1.5,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: INK },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>
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
        slotProps={{
          paper: {
            sx: {
              width: 268,
              bgcolor: SURFACE,
              color: INK,
              fontFamily: FONT_STACK,
              borderRight: `1px solid ${HAIRLINE}`,
            },
          },
        }}
      >
        <Box sx={{ px: 2.75, py: 2.75 }}>
          <Typography
            sx={{
              fontFamily: FONT_STACK,
              fontWeight: 600,
              letterSpacing: '0.06em',
              fontSize: 13.5,
              color: INK,
              textTransform: 'uppercase',
            }}
          >
            Fliq <Box component="span" sx={{ color: ACCENT }}>Marine</Box>
          </Typography>
        </Box>
        <Divider sx={{ borderColor: HAIRLINE }} />

        <List sx={{ py: 1.25, px: 1 }}>
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
                    px: 1.75,
                    py: 1.1,
                    borderRadius: 1.5,
                    mb: 0.25,
                    color: active ? ACCENT : INK_DIM,
                    bgcolor: active ? 'rgba(151, 171, 62, 0.12)' : 'transparent',
                    gap: 1.25,
                    transition: 'background-color 160ms ease, color 160ms ease',
                    '&:hover': { bgcolor: active ? 'rgba(151, 171, 62, 0.16)' : 'rgba(255,255,255,0.05)' },
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
                      primary: {
                        sx: {
                          fontFamily: FONT_STACK,
                          fontWeight: active ? 600 : 500,
                          fontSize: 14,
                          letterSpacing: '-0.005em',
                        },
                      },
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
                          sx={{
                            pl: 4.75,
                            py: 0.9,
                            borderRadius: 1.5,
                            mb: 0.25,
                            color: INK_DIM,
                            gap: 1.25,
                            '&.Mui-selected': { bgcolor: 'rgba(151, 171, 62, 0.1)', color: ACCENT },
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
                          }}
                        >
                          {child.icon && (
                            <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>
                              <child.icon sx={{ fontSize: 16 }} />
                            </ListItemIcon>
                          )}
                          <ListItemText
                            primary={child.label}
                            slotProps={{ primary: { sx: { fontFamily: FONT_STACK, fontSize: 13 } } }}
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