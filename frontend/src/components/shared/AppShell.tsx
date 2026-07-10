import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  Box,
  ListSubheader,
} from "@mui/material";

import type { SvgIconComponent } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import TroubleshootOutlinedIcon from '@mui/icons-material/TroubleshootOutlined';
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import SsidChartOutlinedIcon from "@mui/icons-material/SsidChartOutlined";
import OutputOutlinedIcon from "@mui/icons-material/OutputOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';


import "./AppShell.css";

type NavItem = { label: string; path: string; icon: SvgIconComponent; end?: boolean };
type NavGroup = { section: string | null; items: NavItem[] };

const DRAWER_WIDTH = 220

const NAV: NavGroup[] = [
  {
    section: null,
    items: [{ label: "Dashboard", path: "/", icon: SpaceDashboardOutlinedIcon, end: true }],
  },
  {
    section: "Experiment",
    items: [
      { label: "Acquire", path: "/acquire", icon: PlayArrowOutlinedIcon },
      { label: "Equipment", path: "/equipment", icon: TroubleshootOutlinedIcon},
    ],
  },
  {
    section: "Data",
    items: [
      { label: "Batches", path: "/batches", icon: LayersOutlinedIcon },
      { label: "Samples", path: "/samples", icon: ScienceOutlinedIcon },
      { label: "Files", path: "/files", icon: TextSnippetOutlinedIcon },
    ],
  },
  {
    section: "Analysis",
    items: [
      { label: "Graphs", path: "/graphs", icon: SsidChartOutlinedIcon },
      { label: "Export", path: "/export", icon: OutputOutlinedIcon },
    ],
  },
  {
    section: "Settings",
    items: [
      { label: "Database", path: "/settings/database", icon: StorageOutlinedIcon },
      { label: "Users", path: "/settings/users", icon: PeopleOutlinedIcon },
    ],
  },
];

export default function AppShell() {
  const [showSideBar, setShowSideBar] = useState(false);
  return (
    <div className="shell">
      <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
        <div className="sidebar-logo">ExpeGraph</div>
        <List>
          {NAV.map((group, i) => (
            
            <div key={i} className="nav-group">
              
              {group.section && <ListSubheader>{group.section}</ListSubheader>}
              {group.items.map((item) => {
                const Icon = item.icon;
                return  (<NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {({ isActive }) => (
                    <ListItemButton selected={isActive}>
                      {/* <span className="nav-icon">{item.icon}</span> */}
                      <ListItemIcon><Icon /></ListItemIcon>
                      {item.label}
                    </ListItemButton>
                  )}
                </NavLink>
                )
              })}
            </div>
          ))}
        </List>
        <ListItemButton>
          <ListItemIcon>
            <ChatBubbleOutlinedIcon></ChatBubbleOutlinedIcon>
          </ListItemIcon>
          Chat
        </ListItemButton>
      </Drawer>

      <Box component="main" className="main">
        <header className="topbar">
          <span className="topbar-title" />
          <div className="topbar-user">User ▾</div>
        </header>
        <Box className="content">
          <Outlet />
        </Box>
        <footer className="footer" style={{textAlign: "center"}} >© 2026 ExpeGraph by Giang T. Dang.</footer>
      </Box>
    </div>
  );
}
