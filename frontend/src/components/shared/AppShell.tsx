import { NavLink, Outlet } from 'react-router-dom'
import './AppShell.css'

type NavItem = { label: string; path: string; icon: string; end?: boolean }
type NavGroup = { section: string | null; items: NavItem[] }

const NAV: NavGroup[] = [
  {
    section: null,
    items: [{ label: 'Dashboard', path: '/', icon: '⊞', end: true }],
  },
  {
    section: 'Experiment',
    items: [
      { label: 'Acquire', path: '/acquire', icon: '▶' },
      { label: 'Equipment', path: '/equipment', icon: '⚙' },
    ],
  },
  {
    section: 'Data',
    items: [
      { label: 'Batches', path: '/batches', icon: '▦' },
      { label: 'Samples', path: '/samples', icon: '◈' },
      { label: 'Files', path: '/files', icon: '◻' },
    ],
  },
  {
    section: 'Analysis',
    items: [
      { label: 'Graphs', path: '/graphs', icon: '∿' },
      { label: 'Export', path: '/export', icon: '↗' },
    ],
  },
  {
    section: 'Settings',
    items: [
      { label: 'Database', path: '/settings/database', icon: '⬡' },
      { label: 'Users', path: '/settings/users', icon: '◎' },
    ],
  },
]

export default function AppShell() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-logo">ExpeGraph</div>
        <nav className="sidebar-nav">
          {NAV.map((group, i) => (
            <div key={i} className="nav-group">
              {group.section && (
                <span className="nav-section">{group.section}</span>
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    'nav-item' + (isActive ? ' nav-item--active' : '')
                  }
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <button className="chat-button">🤖 Chat</button>
      </aside>

      <div className="main">
        <header className="topbar">
          <span className="topbar-title" />
          <div className="topbar-user">User ▾</div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}