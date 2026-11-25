import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, UserCircle, LogOut, ChevronLeft, ChevronRight,
  GraduationCap, BookOpen, Building2, Wallet, Users, ClipboardCheck, Settings,
  Calendar, Award, DollarSign, Bell, BookMarked, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import type { UserRole, DepartmentType } from '../../types';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

function getNavItems(role: UserRole, department?: DepartmentType): NavItem[] {
  if (role === 'admin') {
    return [
      { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/admin' },
      { label: 'No Dues Applications', icon: <ClipboardCheck className="h-5 w-5" />, path: '/admin/applications' },
      { label: 'Manage Students', icon: <Users className="h-5 w-5" />, path: '/admin/students' },
      { label: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/admin/settings' },
    ];
  }

  if (role === 'faculty') {
    const deptIcons: Record<DepartmentType, React.ReactNode> = {
      academic: <GraduationCap className="h-5 w-5" />,
      library: <BookOpen className="h-5 w-5" />,
      hostel: <Building2 className="h-5 w-5" />,
      accounts: <Wallet className="h-5 w-5" />,
    };

    return [
      { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/faculty' },
      { label: 'No Dues Requests', icon: deptIcons[department || 'academic'], path: '/faculty/applications' },
    ];
  }

  // Student
  return [
    { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/student' },
    { label: 'Academics & Attendance', icon: <BookMarked className="h-5 w-5" />, path: '/student/academics' },
    { label: 'Assignments & Exams', icon: <Award className="h-5 w-5" />, path: '/student/assignments' },
    { label: 'Timetable', icon: <Calendar className="h-5 w-5" />, path: '/student/timetable' },
    { label: 'Fees & Payments', icon: <DollarSign className="h-5 w-5" />, path: '/student/fees' },
    { label: 'Notices', icon: <Bell className="h-5 w-5" />, path: '/student/notices' },
    { label: 'Apply No Dues', icon: <FileText className="h-5 w-5" />, path: '/student/apply' },
    { label: 'My Applications', icon: <ClipboardCheck className="h-5 w-5" />, path: '/student/applications' },
    { label: 'Profile', icon: <UserCircle className="h-5 w-5" />, path: '/student/profile' },
  ];
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const navItems = getNavItems(user.role, user.department);

  const handleNav = (path: string) => {
    navigate(path);
    onMobileClose();
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-navy-950 text-white z-40 flex flex-col transition-all duration-300 shadow-xl no-print',
        collapsed ? 'w-[72px]' : 'w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex-shrink-0">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-sm leading-tight">DAV University</h1>
              <p className="text-xs text-white/60">Smart Student Portal</p>
            </div>
          )}
        </div>
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/70"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/student' && item.path !== '/faculty' && item.path !== '/admin' && location.pathname.startsWith(item.path));

          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="animate-fade-in truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-navy-950 border border-white/20 rounded-full items-center justify-center text-white/70 hover:text-white transition-colors shadow-lg"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
