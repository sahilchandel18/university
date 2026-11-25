import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { cn, getStatusColor } from '../../lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusIcons: Record<string, React.ReactNode> = {
  approved: <CheckCircle2 className="h-3.5 w-3.5" />,
  cleared: <CheckCircle2 className="h-3.5 w-3.5" />,
  rejected: <XCircle className="h-3.5 w-3.5" />,
  pending: <Clock className="h-3.5 w-3.5" />,
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize',
        getStatusColor(status),
        className
      )}
    >
      {statusIcons[status]}
      {status}
    </span>
  );
}
