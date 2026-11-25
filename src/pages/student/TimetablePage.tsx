import React, { useState, useMemo } from 'react';
import { Clock, MapPin, User } from 'lucide-react';
import { getTimetable } from '../../lib/database';
import { Card, CardContent } from '../../components/ui/Card';
import { cn } from '../../lib/utils';
import type { TimetableSlot } from '../../types';

const DAYS: TimetableSlot['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export function TimetablePage() {
  const slots = useMemo(() => getTimetable(), []);
  const [selectedDay, setSelectedDay] = useState<TimetableSlot['day'] | 'All'>('All');

  const filtered = selectedDay === 'All' ? slots : slots.filter(s => s.day === selectedDay);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Class Timetable</h1>
          <p className="text-sm text-muted-foreground mt-1">Weekly lecture, tutorial, and lab schedule.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['All', ...DAYS] as const).map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                selectedDay === day
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((slot, idx) => (
          <Card key={idx}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
                  {slot.day}
                </span>
                <span className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  slot.type === 'Lab'
                    ? 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
                    : 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                )}>
                  {slot.type}
                </span>
              </div>
              <div>
                <p className="text-xs font-mono text-muted-foreground">{slot.subjectCode}</p>
                <h3 className="font-semibold text-base mt-0.5">{slot.subjectName}</h3>
              </div>
              <div className="pt-2 border-t space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" /> {slot.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" /> {slot.room}
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5" /> {slot.faculty}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
