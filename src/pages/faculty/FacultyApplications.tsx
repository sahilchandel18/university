import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { getApplicationsByDepartment, updateClearanceStatus } from '../../lib/database';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { DEPARTMENT_LABELS } from '../../types';
import type { NoDuesApplication, DepartmentType } from '../../types';
import { cn, formatDateTime } from '../../lib/utils';

export function FacultyApplications() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const department = (user?.department || 'academic') as DepartmentType;

  const [applications, setApplications] = useState<NoDuesApplication[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const [rejectModalApp, setRejectModalApp] = useState<NoDuesApplication | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState('');

  const loadApplications = () => {
    setApplications(getApplicationsByDepartment(department));
  };

  useEffect(() => {
    loadApplications();
  }, [department]);

  const handleApprove = (app: NoDuesApplication) => {
    if (!user) return;
    updateClearanceStatus(app.applicationId, department, 'approved', user.name);
    showToast('Approved', `Clearance approved for ${app.studentName} (${app.applicationId}).`, 'success');
    loadApplications();
  };

  const handleRejectConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !rejectModalApp) return;
    updateClearanceStatus(
      rejectModalApp.applicationId,
      department,
      'rejected',
      user.name,
      rejectRemarks.trim() || 'Pending dues with department'
    );
    showToast('Rejected', `Clearance rejected for ${rejectModalApp.studentName}.`, 'error');
    setRejectModalApp(null);
    setRejectRemarks('');
    loadApplications();
  };

  const filtered = applications.filter((app) => {
    const deptStatus = app.clearances.find(c => c.department === department)?.status || 'pending';
    const matchStatus = statusFilter === 'all' || deptStatus === statusFilter;
    const matchSearch =
      app.studentName.toLowerCase().includes(search.toLowerCase()) ||
      app.enrollmentNumber.toLowerCase().includes(search.toLowerCase()) ||
      app.applicationId.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {DEPARTMENT_LABELS[department]} — No Dues Requests
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Approve or reject student No Dues clearance applications.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search student, enrollment, or ID..."
          className="sm:w-80"
        />
        <div className="flex gap-1.5">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                statusFilter === st
                  ? 'bg-primary-600 text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FileText className="h-8 w-8 text-muted-foreground" />}
            title="No Applications Found"
            description="No student No Dues applications match your current filter."
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-3.5 font-semibold">Application ID</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Student</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Course / Sem</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Applied On</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Dept Status</th>
                  <th className="text-right px-6 py-3.5 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((app) => {
                  const clearance = app.clearances.find(c => c.department === department);
                  const status = clearance?.status || 'pending';
                  return (
                    <tr key={app.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 font-mono font-semibold text-primary-600">
                        {app.applicationId}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold">{app.studentName}</p>
                        <p className="text-xs font-mono text-muted-foreground">{app.enrollmentNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p>{app.course}</p>
                        <p className="text-xs text-muted-foreground">Semester {app.semester}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {formatDateTime(app.appliedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={status} />
                        {clearance?.remarks && (
                          <p className="text-xs text-red-600 mt-1">{clearance.remarks}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(app)}
                              className="bg-emerald-600 hover:bg-emerald-700"
                              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => setRejectModalApp(app)}
                              icon={<XCircle className="h-3.5 w-3.5" />}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Decision recorded
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={!!rejectModalApp}
        onClose={() => { setRejectModalApp(null); setRejectRemarks(''); }}
        title="Reject Clearance Request"
        description={rejectModalApp ? `Rejecting ${rejectModalApp.studentName} (${rejectModalApp.applicationId})` : ''}
      >
        <form onSubmit={handleRejectConfirm} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium">Reason / Remarks (Optional)</label>
            <textarea
              rows={3}
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              placeholder="e.g. Library book not returned / Pending lab fine"
              className="w-full rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setRejectModalApp(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger">
              Confirm Reject
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
