import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Sun, Moon, Menu, User, LogOut, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../lib/database';
import { SearchBar } from '../ui/SearchBar';
import { cn, formatDateTime } from '../../lib/utils';
import type { Notification } from '../../types';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export function Header({ onMenuClick, sidebarCollapsed }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setNotifications(getNotifications(user.id));
    }
    const interval = setInterval(() => {
      if (user) setNotifications(getNotifications(user.id));
    }, 3000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    if (user) {
      markAllNotificationsRead(user.id);
      setNotifications(getNotifications(user.id));
    }
  };

  const handleNotificationClick = (notif: Notification) => {
    markNotificationRead(notif.id);
    if (user) setNotifications(getNotifications(user.id));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim() && user) {
      const q = searchQuery.toLowerCase();
      if (user.role === 'student') {
        if (q.includes('dues') || q.includes('apply')) navigate('/student/apply');
        else if (q.includes('app')) navigate('/student/applications');
        else if (q.includes('fee')) navigate('/student/fees');
        else if (q.includes('time')) navigate('/student/timetable');
        else if (q.includes('assign') || q.includes('exam')) navigate('/student/assignments');
        else if (q.includes('notice')) navigate('/student/notices');
        else if (q.includes('academ') || q.includes('attend')) navigate('/student/academics');
        else if (q.includes('prof')) navigate('/student/profile');
      } else if (user.role === 'faculty') {
        navigate('/faculty/applications');
      } else if (user.role === 'admin') {
        if (q.includes('student')) navigate('/admin/students');
        else navigate('/admin/applications');
      }
      setSearchQuery('');
    }
  };

  if (!user) return null;

  const roleLabel = user.role === 'admin' ? 'Administrator' :
    user.role === 'faculty' ? `Faculty - ${(user.department || '').charAt(0).toUpperCase() + (user.department || '').slice(1)}` :
    'Student';

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-16 bg-card/80 backdrop-blur-md border-b z-30 flex items-center justify-between px-4 md:px-6 transition-all duration-300 no-print',
        'left-0',
        sidebarCollapsed ? 'lg:left-[72px]' : 'lg:left-64',
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden md:block" onKeyDown={handleSearchKeyDown}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Quick jump (e.g. fees, no dues, notices)..."
            className="w-72"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title={theme === 'light' ? 'Dark mode' : 'Light mode'}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-muted transition-colors relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-xl border shadow-xl animate-scale-in max-h-96 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="overflow-y-auto max-h-72 scrollbar-thin">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No notifications yet
                  </div>
                ) : (
                  notifications.slice(0, 20).map(notif => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={cn(
                        'w-full text-left p-4 border-b last:border-0 hover:bg-muted/50 transition-colors',
                        !notif.read && 'bg-primary-50/50 dark:bg-primary-950/20'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div className={cn(
                          'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                          notif.type === 'success' && 'bg-emerald-500',
                          notif.type === 'error' && 'bg-red-500',
                          notif.type === 'warning' && 'bg-amber-500',
                          notif.type === 'info' && 'bg-blue-500',
                        )} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatDateTime(notif.createdAt)}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium leading-tight">{user.name}</p>
              <p className="text-xs text-muted-foreground">{roleLabel}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-xl border shadow-xl animate-scale-in">
              <div className="p-4 border-b">
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="p-2">
                {user.role === 'student' && (
                  <button
                    onClick={() => { navigate('/student/profile'); setShowProfileMenu(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                  >
                    <User className="h-4 w-4" /> Profile
                  </button>
                )}
                <button
                  onClick={() => { logout(); setShowProfileMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
