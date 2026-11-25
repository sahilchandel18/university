import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Eye, EyeOff, Lock, User, ShieldCheck, BookOpen,
  Building2, Wallet, Sun, Moon, ArrowRight, KeyRound
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import { resetUserPassword } from '../lib/database';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { cn } from '../lib/utils';
import type { UserRole, DepartmentType } from '../types';

export function LoginPage() {
  const { user, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState<DepartmentType>('academic');
  const [username, setUsername] = useState(() => localStorage.getItem('dav_remember_username') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem('dav_remember_username'));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Forgot password modal
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, navigate]);

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    setError('');
    setPassword('');
    if (newRole !== 'student') {
      setUsername('');
    } else {
      setUsername(localStorage.getItem('dav_remember_username') || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setSubmitting(true);
    const result = await login(
      username.trim(),
      password.trim(),
      role,
      role === 'faculty' ? department : undefined
    );
    setSubmitting(false);

    if (result.success) {
      if (rememberMe && role === 'student') {
        localStorage.setItem('dav_remember_username', username.trim());
      } else if (!rememberMe) {
        localStorage.removeItem('dav_remember_username');
      }
      showToast('Welcome back!', 'Signed in to DAV University Portal successfully.', 'success');
    } else {
      setError(result.error || 'Authentication failed');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier.trim() || !newPassword.trim()) {
      showToast('Missing fields', 'Please enter your Student ID/Email and new password.', 'error');
      return;
    }
    if (newPassword.length < 4) {
      showToast('Weak password', 'Password must be at least 4 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Mismatch', 'Passwords do not match.', 'error');
      return;
    }
    const ok = resetUserPassword(resetIdentifier.trim(), newPassword.trim());
    if (ok) {
      showToast('Password Updated', 'Your password has been reset. You can now sign in.', 'success');
      setForgotOpen(false);
      setResetIdentifier('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showToast('Account Not Found', 'No account found with that username, email, or enrollment number.', 'error');
    }
  };

  const facultyDepts: { key: DepartmentType; label: string; icon: React.ReactNode }[] = [
    { key: 'academic', label: 'Academic', icon: <GraduationCap className="h-4 w-4" /> },
    { key: 'library', label: 'Library', icon: <BookOpen className="h-4 w-4" /> },
    { key: 'hostel', label: 'Hostel', icon: <Building2 className="h-4 w-4" /> },
    { key: 'accounts', label: 'Accounts', icon: <Wallet className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Brand Panel */}
      <div className="lg:w-5/12 bg-gradient-to-br from-navy-950 via-navy-900 to-primary-900 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-accent-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">DAV University</h1>
              <p className="text-xs text-white/70">Jalandhar, Punjab</p>
            </div>
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
            Smart Student Portal &amp; No Dues System
          </h2>
          <p className="text-white/75 text-sm lg:text-base max-w-md leading-relaxed">
            Centralized academic management, attendance tracking, fee payments, and online 4-department No Dues clearance with instant digital certificates.
          </p>
        </div>

        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Portal Highlights</p>
          <div className="grid grid-cols-2 gap-3 text-xs text-white/80">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="font-semibold text-white">4-Dept Clearance</p>
              <p className="text-white/60 mt-0.5">Academic, Library, Hostel, Accounts</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="font-semibold text-white">Instant Certificate</p>
              <p className="text-white/60 mt-0.5">Verified printable No Dues PDF</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2.5 rounded-lg border bg-card hover:bg-muted transition-colors"
          title="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        <div className="w-full max-w-md space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sign in to your account</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select your portal role and enter your credentials
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-xl">
            {([
              { key: 'student', label: 'Student' },
              { key: 'faculty', label: 'Faculty' },
              { key: 'admin', label: 'Admin' },
            ] as { key: UserRole; label: string }[]).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleRoleSwitch(tab.key)}
                className={cn(
                  'py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200',
                  role === tab.key
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Faculty Department Selector */}
          {role === 'faculty' && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Select Department
              </label>
              <div className="grid grid-cols-2 gap-2">
                {facultyDepts.map((dept) => (
                  <button
                    key={dept.key}
                    type="button"
                    onClick={() => {
                      setDepartment(dept.key);
                      setError('');
                    }}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                      department === dept.key
                        ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300'
                        : 'border-input hover:bg-muted'
                    )}
                  >
                    {dept.icon}
                    {dept.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={
                role === 'student'
                  ? 'Student ID / Email / Enrollment No.'
                  : role === 'faculty'
                    ? 'Professor Username'
                    : 'Admin Username'
              }
              placeholder={
                role === 'student'
                  ? 'e.g. rahul2024 or DAV2024001'
                  : role === 'faculty'
                    ? 'Enter faculty username'
                    : 'Enter admin username'
              }
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={<User className="h-4 w-4" />}
              autoComplete="username"
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-input text-primary-600 focus:ring-primary-500"
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={submitting}
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In as {role === 'student' ? 'Student' : role === 'faculty' ? `${department.charAt(0).toUpperCase() + department.slice(1)} Faculty` : 'Admin'}
            </Button>
          </form>

          {/* Demo Credentials Reference */}
          <div className="p-4 rounded-xl bg-muted/60 border text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary-600" />
              Portal Access Credentials
            </div>
            {role === 'student' && (
              <p className="text-muted-foreground">
                Demo Student: <code className="px-1 py-0.5 bg-background rounded border">rahul2024</code> / <code className="px-1 py-0.5 bg-background rounded border">password123</code> (or Enrollment: <code className="px-1 py-0.5 bg-background rounded border">DAV2024001</code>)
              </p>
            )}
            {role === 'faculty' && (
              <div className="text-muted-foreground space-y-0.5">
                <p>Academic: <code className="px-1 bg-background rounded border">1122</code> / <code className="px-1 bg-background rounded border">1122</code> &nbsp;|&nbsp; Library: <code className="px-1 bg-background rounded border">1212</code> / <code className="px-1 bg-background rounded border">1212</code></p>
                <p>Hostel: <code className="px-1 bg-background rounded border">2231</code> / <code className="px-1 bg-background rounded border">2231</code> &nbsp;|&nbsp; Accounts: <code className="px-1 bg-background rounded border">2431</code> / <code className="px-1 bg-background rounded border">2431</code></p>
              </div>
            )}
            {role === 'admin' && (
              <p className="text-muted-foreground">
                Admin Credentials: Username <code className="px-1 py-0.5 bg-background rounded border">12344</code> / Password <code className="px-1 py-0.5 bg-background rounded border">12344</code>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title="Reset Password"
        description="Enter your Username, Email, or Enrollment Number to set a new password."
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <Input
            label="Username / Email / Enrollment No."
            placeholder="e.g. rahul2024 or DAV2024001"
            value={resetIdentifier}
            onChange={(e) => setResetIdentifier(e.target.value)}
            icon={<User className="h-4 w-4" />}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={<KeyRound className="h-4 w-4" />}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="h-4 w-4" />}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setForgotOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Reset Password</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
