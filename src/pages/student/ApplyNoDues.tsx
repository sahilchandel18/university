import React, { useState, useEffect } from 'react';
import {
  FileText, CheckCircle2, XCircle, Clock, GraduationCap,
  BookOpen, Building2, Wallet, AlertTriangle, Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { createNoDuesApplication, getApplicationsByStudent } from '../../lib/database';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { NoDuesCertificate } from '../../components/NoDuesCertificate';
import { DEPARTMENT_LABELS } from '../../types';
import type { NoDuesApplication, DepartmentType } from '../../types';
import { formatDateTime } from '../../lib/utils';

const deptIcons: Record<DepartmentType, React.ReactNode> = {
  academic: <GraduationCap className="h-5 w-5" />,
  library: <BookOpen className="h-5 w-5" />,
  hostel: <Building2 className="h-5 w-5" />,
  accounts: <Wallet className="h-5 w-5" />,
};

export function ApplyNoDues() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [applications, setApplications] = useState<NoDuesApplication[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const loadApps = () => {
    if (user) {
      setApplications(getApplicationsByStudent(user.id));
    }
  };

  useEffect(() => {
    loadApps();
  }, [user]);

  const latestApp = applications[0];
  const hasActiveOrCleared = latestApp && (latestApp.status === 'pending' || latestApp.status === 'cleared');

  const handleApply = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const newApp = createNoDuesApplication(user.id);
      showToast(
        'Application Submitted',
        `Your unique Application ID is ${newApp.applicationId}.`,
        'success'
      );
      loadApps();
    } catch (err: any) {
      showToast('Unable to Apply', err.message || 'Error submitting application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">No Dues Clearance</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Apply for university-wide No Dues clearance across Academic, Library, Hostel, and Accounts departments.
        </p>
      </div>

      {/* Apply Card */}
      {!hasActiveOrCleared && (
        <Card className="border-primary-200 dark:border-primary-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" />
              Submit New No Dues Application
            </CardTitle>
            <CardDescription>
              Once submitted, your application will receive a unique Application ID and be routed to all 4 departments simultaneously.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/50 border text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Student Name</p>
                <p className="font-semibold mt-0.5">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Enrollment Number</p>
                <p className="font-semibold font-mono mt-0.5">{user?.enrollmentNumber}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Course &amp; Semester</p>
                <p className="font-semibold mt-0.5">{user?.course} (Sem {user?.semester})</p>
              </div>
            </div>

            {latestApp?.status === 'rejected' && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-sm text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Previous application ({latestApp.applicationId}) was rejected</p>
                  <p className="text-xs mt-0.5 opacity-90">
                    After resolving the pending dues with the rejecting department, you can submit a fresh No Dues application below.
                  </p>
                </div>
              </div>
            )}

            <Button onClick={handleApply} isLoading={submitting} size="lg" icon={<FileText className="h-4 w-4" />}>
              Apply for No Dues Clearance
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active / Latest Application Tracker */}
      {latestApp && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                Application ID: <span className="font-mono text-primary-600">{latestApp.applicationId}</span>
              </CardTitle>
              <CardDescription>
                Submitted on {formatDateTime(latestApp.appliedAt)}
              </CardDescription>
            </div>
            <StatusBadge status={latestApp.status} className="text-sm px-3 py-1.5" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestApp.clearances.map((clearance) => (
                <div
                  key={clearance.id}
                  className="p-4 rounded-xl border bg-card flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950 text-primary-600 flex items-center justify-center flex-shrink-0">
                      {deptIcons[clearance.department]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{DEPARTMENT_LABELS[clearance.department]}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {clearance.reviewedBy
                          ? `Reviewed by ${clearance.reviewedBy}`
                          : 'Pending department verification'}
                      </p>
                      {clearance.remarks && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Remarks: {clearance.remarks}
                        </p>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={clearance.status} />
                </div>
              ))}
            </div>

            {latestApp.status === 'rejected' && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-red-800 dark:text-red-200">
                    No Dues Certificate Cannot Be Issued
                  </p>
                  <p className="text-red-700 dark:text-red-300 text-xs mt-1">
                    One or more departments have rejected your clearance request. All 4 departments must approve for the certificate to be generated.
                  </p>
                </div>
              </div>
            )}

            {latestApp.status === 'pending' && (
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-800 dark:text-blue-200">
                    Clearance In Progress
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                    Your No Dues Cleared Certificate will appear automatically here once all 4 departments approve.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Certificate Section - ONLY shown if ALL 4 departments approved (status === 'cleared') */}
      {latestApp?.status === 'cleared' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 no-print">
            <Award className="h-6 w-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-800 dark:text-emerald-200 text-sm">
                All 4 Departments Approved!
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Your official DAV University No Dues Cleared Certificate is ready below.
              </p>
            </div>
          </div>
          <NoDuesCertificate application={latestApp} />
        </div>
      )}
    </div>
  );
}
