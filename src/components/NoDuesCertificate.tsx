import React from 'react';
import { GraduationCap, CheckCircle2, Printer, Download, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { formatDate } from '../lib/utils';
import { DEPARTMENT_LABELS } from '../types';
import type { NoDuesApplication } from '../types';

interface NoDuesCertificateProps {
  application: NoDuesApplication;
}

export function NoDuesCertificate({ application }: NoDuesCertificateProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 no-print">
        <Button variant="outline" onClick={handlePrint} icon={<Printer className="h-4 w-4" />}>
          Print Certificate
        </Button>
        <Button onClick={handlePrint} icon={<Download className="h-4 w-4" />}>
          Save as PDF
        </Button>
      </div>

      <div className="bg-white text-slate-900 border-4 border-double border-navy-900 rounded-xl p-8 md:p-10 shadow-lg max-w-3xl mx-auto">
        {/* University Header */}
        <div className="text-center border-b-2 border-navy-900 pb-6 mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-navy-900 text-white flex items-center justify-center">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-navy-900 tracking-wide">
                DAV UNIVERSITY
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Sarmastpur, Jalandhar - Pathankot National Highway, Punjab
              </p>
            </div>
          </div>
          <div className="mt-4 inline-block px-5 py-1.5 bg-navy-900 text-white text-sm font-bold tracking-widest uppercase rounded">
            No Dues Clearance Certificate
          </div>
        </div>

        {/* Certificate Meta */}
        <div className="flex flex-wrap justify-between gap-2 text-sm mb-6 bg-slate-50 p-4 rounded-lg border">
          <div>
            <span className="text-slate-500">Application ID: </span>
            <span className="font-bold font-mono text-navy-900">{application.applicationId}</span>
          </div>
          <div>
            <span className="text-slate-500">Issue Date: </span>
            <span className="font-semibold">{formatDate(application.updatedAt)}</span>
          </div>
        </div>

        {/* Body Text */}
        <p className="text-sm md:text-base leading-relaxed text-slate-700 mb-6">
          This is to certify that <span className="font-bold text-slate-900">{application.studentName}</span>,
          bearing Enrollment Number <span className="font-bold font-mono text-slate-900">{application.enrollmentNumber}</span>,
          enrolled in <span className="font-semibold text-slate-900">{application.course}</span> (Semester {application.semester}),
          has cleared all academic, library, hostel, and financial dues with DAV University.
        </p>

        {/* Department Clearances Table */}
        <div className="border rounded-lg overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-navy-900 text-white">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold">Department</th>
                <th className="text-left px-4 py-2.5 font-semibold">Status</th>
                <th className="text-left px-4 py-2.5 font-semibold">Verified By</th>
                <th className="text-left px-4 py-2.5 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {application.clearances.map((c) => (
                <tr key={c.id} className="bg-white">
                  <td className="px-4 py-3 font-medium">{DEPARTMENT_LABELS[c.department]}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="h-4 w-4" /> Approved
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.reviewedBy || 'Authorized Signatory'}</td>
                  <td className="px-4 py-3 text-slate-600">{c.reviewedAt ? formatDate(c.reviewedAt) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Signatures */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t">
          <div className="flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="h-8 w-8" />
            <div className="text-xs">
              <p className="font-bold uppercase tracking-wider">Digitally Verified</p>
              <p className="text-slate-500">All 4 Departments Cleared</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="font-bold text-navy-900 text-sm">Controller of Examinations / Registrar</p>
            <p className="text-xs text-slate-500">DAV University, Jalandhar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
