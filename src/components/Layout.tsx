import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import {
  LayoutDashboard, Users, Brain, BatteryCharging, PlayCircle,
  Settings, Euro, Network, Bell, Sun, Moon, ChevronLeft, LogOut, Home
} from 'lucide-react';
import Logo from './Logo';

const navItems = [
  { path: '/', label: 'Overzicht', icon: LayoutDashboard },
  { path: '/verbruikers', label: 'Verbruikers', icon: Users },
  { path: '/voorspelling', label: 'Voorspelling', icon: Brain },
  { path: '/batterij', label: 'Batterij', icon: BatteryCharging },
  { path: '/simulatie', label: 'Simulatie', icon: PlayCircle },
  { path: '/beheer', label: 'Beheer', icon: Settings },
  { path: '/business', label: 'Business Model', icon: Euro },
  { path: '/architectuur', label: 'Architectuur', icon: Network },
];

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !document.documentElement.classList.contains('light');
  });

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
      }
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return { isDark, toggle };
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark, toggle } = useTheme();
  const location = useLocation();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className="flex-shrink-0 flex flex-col border-r border-border bg-sidebar transition-all duration-200"
        style={{ width: collapsed ? 72 : 240 }}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <Logo collapsed={collapsed} />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft
              size={16}
              className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 h-10 rounded-lg transition-all duration-150 relative ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  } ${collapsed ? 'justify-center px-0' : 'px-3'}`
                }
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                )}
                <Icon size={20} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="p-3 border-t border-sidebar-border">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold flex-shrink-0">
              OP
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">Operator</div>
                <div className="text-xs text-muted-foreground">Beheerder</div>
              </div>
            )}
            {!collapsed && (
              <button className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-muted-foreground">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 h-16 flex items-center justify-between px-6 border-b border-border bg-card/50">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Dashboard</span>
            {location.pathname !== '/' && (
              <>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium">
                  {navItems.find(n => n.path === location.pathname)?.label}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Hub selector */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors text-sm">
              <Home size={14} className="text-primary" />
              <span className="font-medium">Energiehuisje De Bilt</span>
              <span className="text-xs text-muted-foreground ml-1">Groep A</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notifications */}
            <button className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-muted transition-colors">
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-error-foreground text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
              OP
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
