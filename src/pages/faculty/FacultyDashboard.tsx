import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getApplicationsByDepartment, getDepartmentStats } from '../../lib/database';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DEPARTMENT_LABELS } from '../../types';
import type { DepartmentType } from '../../types';
import { formatDate } from '../../lib/utils';

export function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const department = (user?.department || 'academic') as DepartmentType;

  const stats = useMemo(() => getDepartmentStats(department), [department]);
  const applications = useMemo(() => getApplicationsByDepartment(department), [department]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-navy-900 to-primary-800 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/70 font-semibold">
            {DEPARTMENT_LABELS[department]}
          </p>
          <h1 className="text-2xl font-bold mt-1">Welcome, {user?.name}</h1>
          <p className="text-sm text-white/80 mt-1">
            Review and approve or reject student No Dues clearance requests for your department.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/faculty/applications')}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          Review Requests ({stats.pending})
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-primary-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Clearance Requests</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/faculty/applications')}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No students have applied for No Dues clearance yet.
            </p>
          ) : (
            <div className="divide-y">
              {applications.slice(0, 5).map((app) => {
                const deptClearance = app.clearances.find(c => c.department === department);
                return (
                  <div key={app.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-sm">{app.studentName} ({app.enrollmentNumber})</p>
                      <p className="text-xs text-muted-foreground">
                        {app.applicationId} &bull; {app.course} &bull; Applied {formatDate(app.appliedAt)}
                      </p>
                    </div>
                    <StatusBadge status={deptClearance?.status || 'pending'} />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
