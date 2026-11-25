import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Clock, Printer } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { getStudentFees, payStudentFee } from '../../lib/database';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDate } from '../../lib/utils';
import type { FeeRecord } from '../../types';

export function FeesPage() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [fees, setFees] = useState<FeeRecord[]>([]);

  useEffect(() => {
    if (user) setFees(getStudentFees(user.id));
  }, [user]);

  const handlePay = (feeId: string) => {
    if (!user) return;
    const updated = payStudentFee(feeId, user.id);
    setFees(updated);
    showToast('Payment Successful', 'Fee paid and receipt generated.', 'success');
  };

  const totalPaid = fees.filter(f => f.status === 'paid').reduce((a, b) => a + b.amount, 0);
  const totalPending = fees.filter(f => f.status === 'pending').reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fees &amp; Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage university tuition, hostel, and examination fee payments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Paid</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">₹{totalPaid.toLocaleString('en-IN')}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Pending Balance</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">₹{totalPending.toLocaleString('en-IN')}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-6 py-3.5 font-semibold">Fee Description</th>
                <th className="text-left px-6 py-3.5 font-semibold">Amount</th>
                <th className="text-left px-6 py-3.5 font-semibold">Due Date</th>
                <th className="text-left px-6 py-3.5 font-semibold">Status</th>
                <th className="text-left px-6 py-3.5 font-semibold">Receipt / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {fees.map((fee) => (
                <tr key={fee.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium">{fee.title}</td>
                  <td className="px-6 py-4 font-semibold">₹{fee.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-muted-foreground">{formatDate(fee.dueDate)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={fee.status === 'paid' ? 'approved' : 'pending'} />
                  </td>
                  <td className="px-6 py-4">
                    {fee.status === 'paid' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{fee.receiptNo}</span>
                        <Button variant="ghost" size="sm" onClick={() => window.print()} icon={<Printer className="h-3.5 w-3.5" />}>
                          Print
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => handlePay(fee.id)} icon={<CreditCard className="h-3.5 w-3.5" />}>
                        Pay Now
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
