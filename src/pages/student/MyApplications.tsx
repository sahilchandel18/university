import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, FileText, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getApplicationsByStudent } from '../../lib/database';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { NoDuesCertificate } from '../../components/NoDuesCertificate';
import { DEPARTMENT_LABELS } from '../../types';
import type { NoDuesApplication } from '../../types';
import { formatDateTime } from '../../lib/utils';

export function MyApplications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<NoDuesApplication[]>([]);
  const [selectedCertApp, setSelectedCertApp] = useState<NoDuesApplication | null>(null);

  useEffect(() => {
    if (user) {
      setApplications(getApplicationsByStudent(user.id));
    }
  }, [user]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My No Dues Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track status across all 4 departments and download cleared certificates.
          </p>
        </div>
        <Button onClick={() => navigate('/student/apply')} icon={<FileText className="h-4 w-4" />}>
          Apply / View Current
        </Button>
      </div>

      {applications.length === 0 ? (
        <Card>
          <EmptyState
            title="No Applications Yet"
            description="You haven't submitted any No Dues clearance application yet."
            action={
              <Button onClick={() => navigate('/student/apply')}>
                Apply for No Dues
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="font-mono text-primary-600">{app.applicationId}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submitted: {formatDateTime(app.appliedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={app.status} />
                  {app.status === 'cleared' && (
                    <Button
                      size="sm"
                      onClick={() => setSelectedCertApp(app)}
                      icon={<Award className="h-4 w-4" />}
                    >
                      View Certificate
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {app.clearances.map((c) => (
                    <div key={c.id} className="p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold">{DEPARTMENT_LABELS[c.department]}</span>
                        <StatusBadge status={c.status} />
                      </div>
                      {c.remarks && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">
                          {c.remarks}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedCertApp}
        onClose={() => setSelectedCertApp(null)}
        title="No Dues Clearance Certificate"
        size="xl"
      >
        {selectedCertApp && <NoDuesCertificate application={selectedCertApp} />}
      </Modal>
    </div>
  );
}
