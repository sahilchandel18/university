import React, { useState, useMemo } from 'react';
import { Eye, FileText, Award } from 'lucide-react';
import { getAllApplications } from '../../lib/database';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { NoDuesCertificate } from '../../components/NoDuesCertificate';
import { DEPARTMENT_LABELS } from '../../types';
import type { NoDuesApplication } from '../../types';
import { cn, formatDateTime } from '../../lib/utils';

export function AdminApplications() {
  const applications = useMemo(() => getAllApplications(), []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'cleared' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<NoDuesApplication | null>(null);
  const [certApp, setCertApp] = useState<NoDuesApplication | null>(null);

  const filtered = applications.filter((app) => {
    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchSearch =
      app.studentName.toLowerCase().includes(search.toLowerCase()) ||
      app.enrollmentNumber.toLowerCase().includes(search.toLowerCase()) ||
      app.applicationId.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All No Dues Applications</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Inspect student No Dues applications and department-by-department clearance status.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search student, enrollment, or application ID..."
          className="sm:w-80"
        />
        <div className="flex gap-1.5">
          {(['all', 'pending', 'cleared', 'rejected'] as const).map((st) => (
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
            description="No student No Dues applications match your search criteria."
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
                  <th className="text-left px-6 py-3.5 font-semibold">Academic</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Library</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Hostel</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Accounts</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Overall</th>
                  <th className="text-right px-6 py-3.5 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-mono font-semibold text-primary-600">
                      {app.applicationId}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">{app.studentName}</p>
                      <p className="text-xs font-mono text-muted-foreground">{app.enrollmentNumber}</p>
                    </td>
                    {(['academic', 'library', 'hostel', 'accounts'] as const).map((dept) => {
                      const c = app.clearances.find(x => x.department === dept);
                      return (
                        <td key={dept} className="px-4 py-4">
                          <StatusBadge status={c?.status || 'pending'} />
                        </td>
                      );
                    })}
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedApp(app)}
                          icon={<Eye className="h-3.5 w-3.5" />}
                        >
                          View
                        </Button>
                        {app.status === 'cleared' && (
                          <Button
                            size="sm"
                            onClick={() => setCertApp(app)}
                            icon={<Award className="h-3.5 w-3.5" />}
                          >
                            Cert
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={selectedApp ? `Application ${selectedApp.applicationId}` : ''}
        description={selectedApp ? `${selectedApp.studentName} (${selectedApp.enrollmentNumber})` : ''}
        size="lg"
      >
        {selectedApp && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm p-3 rounded-lg bg-muted/50">
              <div><span className="text-muted-foreground">Course:</span> {selectedApp.course}</div>
              <div><span className="text-muted-foreground">Semester:</span> {selectedApp.semester}</div>
              <div><span className="text-muted-foreground">Applied:</span> {formatDateTime(selectedApp.appliedAt)}</div>
              <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={selectedApp.status} /></div>
            </div>
            <div className="space-y-2">
              {selectedApp.clearances.map((c) => (
                <div key={c.id} className="p-3 rounded-lg border flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{DEPARTMENT_LABELS[c.department]}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.reviewedBy ? `Reviewed by ${c.reviewedBy}` : 'Pending review'}
                    </p>
                    {c.remarks && <p className="text-xs text-red-600 mt-1">Remarks: {c.remarks}</p>}
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!certApp}
        onClose={() => setCertApp(null)}
        title="No Dues Clearance Certificate"
        size="xl"
      >
        {certApp && <NoDuesCertificate application={certApp} />}
      </Modal>
    </div>
  );
}
