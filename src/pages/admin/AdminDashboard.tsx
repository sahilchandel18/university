import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { getDashboardStats, getAllApplications, getDepartmentStats } from '../../lib/database';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DEPARTMENTS } from '../../types';
import { formatDate } from '../../lib/utils';

export function AdminDashboard() {
  const navigate = useNavigate();
  const stats = useMemo(() => getDashboardStats(), []);
  const applications = useMemo(() => getAllApplications(), []);

  const deptChartData = useMemo(() => {
    return DEPARTMENTS.map((d) => {
      const s = getDepartmentStats(d.key);
      return {
        name: d.key.charAt(0).toUpperCase() + d.key.slice(1),
        Approved: s.approved,
        Pending: s.pending,
        Rejected: s.rejected,
      };
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-primary-800 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/70 font-semibold">DAV University Administration</p>
          <h1 className="text-2xl font-bold mt-1">Admin Control Center</h1>
          <p className="text-sm text-white/80 mt-1">
            Monitor student No Dues applications, department clearances, and manage student accounts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => navigate('/admin/applications')}>
            View Applications
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => navigate('/admin/students')}
          >
            Manage Students
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card hover onClick={() => navigate('/admin/students')}>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold mt-1">{stats.totalStudents}</p>
            </div>
            <Users className="h-7 w-7 text-primary-500" />
          </CardContent>
        </Card>
        <Card hover onClick={() => navigate('/admin/applications')}>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Applications</p>
              <p className="text-2xl font-bold mt-1">{stats.totalApplications}</p>
            </div>
            <FileText className="h-7 w-7 text-accent-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pendingApplications}</p>
            </div>
            <Clock className="h-7 w-7 text-amber-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Cleared</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.clearedApplications}</p>
            </div>
            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejectedApplications}</p>
            </div>
            <XCircle className="h-7 w-7 text-red-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Clearance Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis allowDecimals={false} className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent No Dues Applications</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/applications')}>
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No No Dues applications submitted yet.
              </p>
            ) : (
              <div className="divide-y">
                {applications.slice(0, 6).map((app) => (
                  <div key={app.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm">{app.studentName}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {app.applicationId} &bull; {app.enrollmentNumber} &bull; {formatDate(app.appliedAt)}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
