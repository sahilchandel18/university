import React from 'react';
import { RefreshCw, ShieldCheck, Database } from 'lucide-react';
import { resetDatabase } from '../../lib/database';
import { useNotification } from '../../contexts/NotificationContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function AdminSettings() {
  const { showToast } = useNotification();

  const handleReset = () => {
    if (window.confirm('Reset all portal data (students, applications, fees) to initial DAV University defaults? You will be signed out.')) {
      resetDatabase();
      showToast('Database Reset', 'All data restored to defaults.', 'info');
      window.location.href = '/login';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Portal Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">System configuration and database management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary-600" />
              Role &amp; Department Credentials
            </CardTitle>
            <CardDescription>Configured system accounts for DAV University Portal</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between py-1.5 border-b">
              <span className="text-muted-foreground">Administrator</span>
              <code className="font-mono">12344 / 12344</code>
            </div>
            <div className="flex justify-between py-1.5 border-b">
              <span className="text-muted-foreground">Academic Department</span>
              <code className="font-mono">1122 / 1122</code>
            </div>
            <div className="flex justify-between py-1.5 border-b">
              <span className="text-muted-foreground">Library Department</span>
              <code className="font-mono">1212 / 1212</code>
            </div>
            <div className="flex justify-between py-1.5 border-b">
              <span className="text-muted-foreground">Hostel Department</span>
              <code className="font-mono">2231 / 2231</code>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Accounts Department</span>
              <code className="font-mono">2431 / 2431</code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-amber-600" />
              Database Maintenance
            </CardTitle>
            <CardDescription>Restore initial seed data if needed for testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Resetting the database will clear all submitted No Dues applications and custom student records, restoring the default DAV University demo accounts.
            </p>
            <Button variant="danger" onClick={handleReset} icon={<RefreshCw className="h-4 w-4" />}>
              Reset Portal Database
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
