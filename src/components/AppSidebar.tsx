import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  Sparkles,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/jobs", icon: Briefcase, label: "Job Tracker" },
  { to: "/interview-prep", icon: BookOpen, label: "Interview Prep" },
  { to: "/ai-generator", icon: Sparkles, label: "AI Questions" },
  { to: "/resume", icon: FileText, label: "Resume Tips" },
  { to: "/profile", icon: User, label: "Profile" },
];

interface AppSidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppSidebar = ({ darkMode, toggleDarkMode }: AppSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-sidebar-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary">
          <Sparkles className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">
            InterviewAI
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-sidebar-primary" : ""}`} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 space-y-1">
        <button
          onClick={toggleDarkMode}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          {darkMode ? <Sun className="h-[18px] w-[18px] shrink-0" /> : <Moon className="h-[18px] w-[18px] shrink-0" />}
          {!collapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-[18px] w-[18px] shrink-0" />
          ) : (
            <ChevronLeft className="h-[18px] w-[18px] shrink-0" />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
