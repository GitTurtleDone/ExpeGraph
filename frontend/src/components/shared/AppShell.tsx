import { NavLink, Outlet } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  Box,
  ListSubheader,
} from "@mui/material";
import "./AppShell.css";

type NavItem = { label: string; path: string; icon: string; end?: boolean };
type NavGroup = { section: string | null; items: NavItem[] };

const DRAWER_WIDTH = 220

const NAV: NavGroup[] = [
  {
    section: null,
    items: [{ label: "Dashboard", path: "/", icon: "⊞", end: true }],
  },
  {
    section: "Experiment",
    items: [
      { label: "Acquire", path: "/acquire", icon: "▶" },
      { label: "Equipment", path: "/equipment", icon: "⚙" },
    ],
  },
  {
    section: "Data",
    items: [
      { label: "Batches", path: "/batches", icon: "▦" },
      { label: "Samples", path: "/samples", icon: "◈" },
      { label: "Files", path: "/files", icon: "◻" },
    ],
  },
  {
    section: "Analysis",
    items: [
      { label: "Graphs", path: "/graphs", icon: "∿" },
      { label: "Export", path: "/export", icon: "↗" },
    ],
  },
  {
    section: "Settings",
    items: [
      { label: "Database", path: "/settings/database", icon: "⬡" },
      { label: "Users", path: "/settings/users", icon: "◎" },
    ],
  },
];

export default function AppShell() {
  return (
    <div className="shell">
      <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
        <div className="sidebar-logo">ExpeGraph</div>
        <List>
          {NAV.map((group, i) => (
            <div key={i} className="nav-group">
              {group.section && <ListSubheader>{group.section}</ListSubheader>}
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {({ isActive }) => (
                    <ListItemButton selected={isActive}>
                      <span className="nav-icon">{item.icon}</span>
                      {item.label}
                    </ListItemButton>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </List>
        <button className="chat-button">🤖 Chat</button>
      </Drawer>

      <Box component="main" className="main">
        <header className="topbar">
          <span className="topbar-title" />
          <div className="topbar-user">User ▾</div>
        </header>
        <Box className="content">
          <Outlet />
        </Box>
        <footer className="footer">© 2026 ExpeGraph by Giang. T. Dang.</footer>
      </Box>
    </div>
  );
}
