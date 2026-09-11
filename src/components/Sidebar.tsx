import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Box,
  Typography,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { menuConfig, type MenuItem } from "../config/menuConfig";

export const SIDEBAR_WIDTH = 300; // was 260

// Shared dark-theme tokens — keep in sync with Topbar / Users table / Login
const ACCENT = "#5B7CFA";
const SURFACE = "#14171F";
const TEXT_PRIMARY = "rgba(255,255,255,0.92)";
const TEXT_SECONDARY = "rgba(255,255,255,0.6)";
const BORDER = "rgba(255,255,255,0.08)";

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isChildActive = (item: MenuItem) => {
    if (!item.children) return false;
    return item.children.some((child) => child.path === location.pathname);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          bgcolor: SURFACE,
          color: TEXT_PRIMARY,
          borderRight: "1px solid",
          borderColor: BORDER,
        },
      }}
    >
      <Toolbar sx={{ px: 3.5, py: 3, minHeight: "80px !important" }}>
        <Typography
          variant="h6"
          fontWeight={800}
          letterSpacing="-0.03em"
          sx={{ color: TEXT_PRIMARY, fontSize: 24 }}
        >
          FLIQMARINE
        </Typography>
      </Toolbar>

      <Box sx={{ overflowY: "auto", px: 2, mt: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            px: 1.75,
            mb: 1.5,
            color: TEXT_SECONDARY,
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontSize: 12,
            textTransform: "uppercase",
          }}
        >
          Menu
        </Typography>

        <List disablePadding>
          {menuConfig.map((item) => {
            const Icon = item.icon;
            const hasChildren = Boolean(item.children?.length);
            const isOpen = openMenus[item.label] || isChildActive(item);
            const isSelected = item.path === location.pathname;

            return (
              <Box key={item.label}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => {
                    if (hasChildren) {
                      toggleMenu(item.label);
                    } else if (item.path) {
                      navigate(item.path);
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    mb: 0.75,
                    py: 1.5,
                    px: 2,
                    color: TEXT_SECONDARY,
                    transition: "background-color 0.15s ease, color 0.15s ease",

                    "&.Mui-selected": {
                      bgcolor: ACCENT,
                      color: "#ffffff",
                      boxShadow: `0 4px 14px ${ACCENT}55`,
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: ACCENT,
                    },
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.06)",
                      color: TEXT_PRIMARY,
                    },
                  }}
                >
                  {Icon && (
                    <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                      <Icon fontSize="medium" />
                    </ListItemIcon>
                  )}

                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: 15.5,
                          fontWeight: isSelected ? 600 : 500,
                          fontFamily: "'Inter', 'Roboto', sans-serif",
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                  />

                  {hasChildren &&
                    (isOpen ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    ))}
                </ListItemButton>

                {hasChildren && (
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List disablePadding sx={{ position: "relative" }}>
                      <Box
                        sx={{
                          position: "absolute",
                          left: 33,
                          top: 4,
                          bottom: 4,
                          width: "1px",
                          bgcolor: BORDER,
                        }}
                      />
                      {item.children!.map((child) => {
                        const childSelected = child.path === location.pathname;

                        return (
                          <ListItemButton
                            key={child.label}
                            selected={childSelected}
                            onClick={() => {
                              if (child.path) navigate(child.path);
                            }}
                            sx={{
                              pl: 6.5,
                              py: 1.1,
                              borderRadius: 2,
                              mb: 0.5,
                              color: "rgba(255,255,255,0.55)",

                              "&.Mui-selected": {
                                bgcolor: "rgba(91,124,250,0.16)",
                                color: ACCENT,
                              },
                              "&:hover": {
                                bgcolor: "rgba(255,255,255,0.05)",
                                color: TEXT_PRIMARY,
                              },
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  sx={{
                                    fontSize: 14,
                                    fontWeight: childSelected ? 600 : 500,
                                  }}
                                >
                                  {child.label}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}