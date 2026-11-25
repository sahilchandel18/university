import React, { useMemo } from 'react';
import { BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getSubjectsAndAttendance } from '../../lib/database';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { cn } from '../../lib/utils';

export function AcademicsPage() {
  const subjects = useMemo(() => getSubjectsAndAttendance(), []);

  const totalAttended = subjects.reduce((a, b) => a + b.attended, 0);
  const totalClasses = subjects.reduce((a, b) => a + b.total, 0);
  const overallPct = Math.round((totalAttended / totalClasses) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Academics &amp; Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Semester subject breakdown, attendance percentage, and continuous assessment grades.
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-primary-600" />
          <div>
            <p className="text-xs text-muted-foreground">Overall Attendance</p>
            <p className="text-lg font-bold text-primary-700 dark:text-primary-300">{overallPct}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {subjects.map((sub) => {
          const pct = Math.round((sub.attended / sub.total) * 100);
          const isLow = pct < 75;
          return (
            <Card key={sub.id}>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted">
                        {sub.code}
                      </span>
                      <span className="text-xs text-muted-foreground">{sub.credits} Credits</span>
                      {sub.grade && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Grade: {sub.grade}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{sub.name}</h3>
                    <p className="text-xs text-muted-foreground">Faculty: {sub.faculty}</p>
                  </div>

                  <div className="w-full md:w-72 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {sub.attended} / {sub.total} Classes
                      </span>
                      <span className={cn('font-bold flex items-center gap-1', isLow ? 'text-red-600' : 'text-emerald-600')}>
                        {isLow ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          isLow ? 'bg-red-500' : 'bg-emerald-500'
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
