import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { updateStudent } from '../../lib/database';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Student } from '../../types';

export function StudentProfile() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useNotification();
  const student = user as Student;

  const [phone, setPhone] = useState(student?.phone || '');
  const [address, setAddress] = useState(student?.address || '');
  const [bloodGroup, setBloodGroup] = useState(student?.bloodGroup || '');
  const [saving, setSaving] = useState(false);

  if (!student) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      updateStudent(student.id, { phone, address, bloodGroup });
      refreshUser();
      showToast('Profile Updated', 'Your contact details have been saved.', 'success');
    } catch (err: any) {
      showToast('Update Failed', err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">View your academic identity and update contact details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white text-3xl font-bold flex items-center justify-center mx-auto shadow-lg">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{student.name}</h2>
              <p className="text-sm text-primary-600 font-mono font-semibold">{student.enrollmentNumber}</p>
              <p className="text-xs text-muted-foreground mt-1">{student.course} &bull; Sem {student.semester} (Sec {student.section})</p>
            </div>
            <div className="pt-4 border-t text-left space-y-2.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" /> <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" /> <span>{student.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> <span>{student.address || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4" /> <span>Admission Year: {student.admissionYear}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal &amp; Academic Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" value={student.name} disabled icon={<User className="h-4 w-4" />} />
                <Input label="Username" value={student.username} disabled />
                <Input label="Father's Name" value={student.fatherName} disabled />
                <Input label="Mother's Name" value={student.motherName} disabled />
                <Input label="Date of Birth" value={student.dob} disabled />
                <Input
                  label="Blood Group"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  placeholder="e.g. B+"
                />
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="h-4 w-4" />}
                />
                <Input
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  icon={<MapPin className="h-4 w-4" />}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={saving} icon={<Save className="h-4 w-4" />}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
