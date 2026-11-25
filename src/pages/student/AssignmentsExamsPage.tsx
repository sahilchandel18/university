import React, { useState, useMemo } from 'react';
import { Upload, CheckCircle2, Clock, Award, Calendar, MapPin } from 'lucide-react';
import { getAssignments, submitAssignment, getExamSchedule } from '../../lib/database';
import { useNotification } from '../../contexts/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { cn, formatDate } from '../../lib/utils';
import type { Assignment } from '../../types';

export function AssignmentsExamsPage() {
  const { showToast } = useNotification();
  const [tab, setTab] = useState<'assignments' | 'exams'>('assignments');
  const [assignments, setAssignments] = useState<Assignment[]>(() => getAssignments());
  const exams = useMemo(() => getExamSchedule(), []);

  const [uploadTarget, setUploadTarget] = useState<Assignment | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTarget || !selectedFile) {
      showToast('Select a File', 'Please choose a file to upload.', 'warning');
      return;
    }
    const updated = submitAssignment(uploadTarget.id, selectedFile.name);
    setAssignments(updated);
    showToast('Assignment Submitted', `${selectedFile.name} uploaded successfully.`, 'success');
    setUploadTarget(null);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assignments &amp; Examinations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submit coursework and view your upcoming DAV University exam schedule.
          </p>
        </div>

        <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
          <button
            onClick={() => setTab('assignments')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === 'assignments' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
            )}
          >
            Assignments ({assignments.length})
          </button>
          <button
            onClick={() => setTab('exams')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === 'exams' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
            )}
          >
            Exam Schedule ({exams.length})
          </button>
        </div>
      </div>

      {tab === 'assignments' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((asg) => (
            <Card key={asg.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-primary-600">
                    {asg.subjectCode} &bull; {asg.subjectName}
                  </span>
                  <CardTitle className="mt-1">{asg.title}</CardTitle>
                </div>
                <StatusBadge
                  status={asg.status === 'graded' ? 'approved' : asg.status === 'submitted' ? 'cleared' : 'pending'}
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{asg.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Due: {formatDate(asg.dueDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    {asg.marksObtained !== undefined
                      ? `Score: ${asg.marksObtained}/${asg.maxMarks}`
                      : `Max Marks: ${asg.maxMarks}`}
                  </span>
                </div>

                {asg.submittedFile ? (
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Submitted: {asg.submittedFile}</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setUploadTarget(asg)}
                    icon={<Upload className="h-4 w-4" />}
                  >
                    Upload Submission
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-3.5 font-semibold">Subject</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Type</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Date &amp; Time</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Venue</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Max Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {exams.map((ex) => (
                  <tr key={ex.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <p className="font-semibold">{ex.subjectName}</p>
                      <p className="text-xs font-mono text-muted-foreground">{ex.subjectCode}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                        {ex.examType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {formatDate(ex.date)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{ex.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {ex.room}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">{ex.maxMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={!!uploadTarget}
        onClose={() => { setUploadTarget(null); setSelectedFile(null); }}
        title="Submit Assignment"
        description={uploadTarget ? `${uploadTarget.subjectCode} - ${uploadTarget.title}` : ''}
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="border-2 border-dashed rounded-xl p-6 text-center space-y-2">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium">Choose PDF, DOCX, or ZIP file</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.zip"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="text-xs mx-auto block"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setUploadTarget(null)}>
              Cancel
            </Button>
            <Button type="submit">Submit File</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
