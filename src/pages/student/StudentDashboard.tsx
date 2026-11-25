import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, CheckCircle2, Clock, Award, BookOpen, Calendar,
  DollarSign, ArrowRight, Bell, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import {
  getApplicationsByStudent, getSubjectsAndAttendance,
  getAssignments, getStudentFees, getNotices
} from '../../lib/database';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DEPARTMENT_LABELS } from '../../types';
import { formatDate } from '../../lib/utils';

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const applications = useMemo(() => (user ? getApplicationsByStudent(user.id) : []), [user]);
  const subjects = useMemo(() => getSubjectsAndAttendance(), []);
  const assignments = useMemo(() => getAssignments(), []);
  const fees = useMemo(() => (user ? getStudentFees(user.id) : []), [user]);
  const notices = useMemo(() => getNotices().slice(0, 3), []);

  const latestApp = applications[0];

  const totalAttended = subjects.reduce((acc, s) => acc + s.attended, 0);
  const totalClasses = subjects.reduce((acc, s) => acc + s.total, 0);
  const avgAttendance = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const pendingFees = fees.filter(f => f.status === 'pending').reduce((acc, f) => acc + f.amount, 0);

  const chartData = subjects.map(s => ({
    name: s.code,
    attendance: Math.round((s.attended / s.total) * 100),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-primary-800 to-primary-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/70 font-semibold">DAV University Student Portal</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">Welcome, {user?.name}</h1>
          <p className="text-sm text-white/80 mt-1">
            {user?.enrollmentNumber} &bull; {user?.course} &bull; Semester {user?.semester}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/student/apply')}
            icon={<FileText className="h-4 w-4" />}
          >
            {latestApp ? 'Track No Dues' : 'Apply No Dues'}
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => navigate('/student/timetable')}
            icon={<Calendar className="h-4 w-4" />}
          >
            Timetable
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover onClick={() => navigate('/student/academics')}>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Overall Attendance</p>
              <p className="text-2xl font-bold mt-1">{avgAttendance}%</p>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> {totalAttended}/{totalClasses} classes
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center text-primary-600">
              <BookOpen className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card hover onClick={() => navigate('/student/assignments')}>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Pending Assignments</p>
              <p className="text-2xl font-bold mt-1">{pendingAssignments}</p>
              <p className="text-xs text-muted-foreground mt-1">Out of {assignments.length} total</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card hover onClick={() => navigate('/student/fees')}>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Pending Fees</p>
              <p className="text-2xl font-bold mt-1">₹{pendingFees.toLocaleString('en-IN')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingFees === 0 ? 'All dues paid' : 'Due soon'}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card hover onClick={() => navigate('/student/applications')}>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">No Dues Status</p>
              <div className="mt-1.5">
                {latestApp ? (
                  <StatusBadge status={latestApp.status} />
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground">Not Applied</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 font-mono">
                {latestApp ? latestApp.applicationId : 'Click to apply'}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-accent-50 dark:bg-accent-950 flex items-center justify-center text-accent-600">
              {latestApp?.status === 'cleared' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Subject Attendance Overview</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Minimum 75% required for End-Term exams</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/student/academics')}>
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary-600" /> University Notices
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/student/notices')}>
              All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {notices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => navigate('/student/notices')}
                className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                    {notice.category}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{formatDate(notice.date)}</span>
                </div>
                <p className="text-sm font-medium line-clamp-2">{notice.title}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Latest No Dues Application Tracker */}
      {latestApp && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active No Dues Application: {latestApp.applicationId}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Applied on {formatDate(latestApp.appliedAt)}
              </p>
            </div>
            <StatusBadge status={latestApp.status} />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {latestApp.clearances.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border bg-muted/30 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{DEPARTMENT_LABELS[c.department]}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {c.reviewedAt ? `Reviewed ${formatDate(c.reviewedAt)}` : 'Awaiting review'}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
