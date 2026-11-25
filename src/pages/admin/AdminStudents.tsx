import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { getStudents, addStudent, updateStudent, deleteStudent } from '../../lib/database';
import { useNotification } from '../../contexts/NotificationContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import type { Student } from '../../types';

const PAGE_SIZE = 6;

const emptyForm = {
  username: '',
  password: '',
  name: '',
  email: '',
  enrollmentNumber: '',
  course: 'B.Tech Computer Science',
  semester: 6,
  section: 'A',
  fatherName: '',
  motherName: '',
  dob: '2003-01-01',
  phone: '',
  address: '',
  admissionYear: 2023,
};

export function AdminStudents() {
  const { showToast } = useNotification();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadStudents = () => {
    setStudents(getStudents());
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.username.toLowerCase().includes(search.toLowerCase()) ||
    s.enrollmentNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAddModal = () => {
    setEditingStudent(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (s: Student) => {
    setEditingStudent(s);
    setForm({
      username: s.username,
      password: '',
      name: s.name,
      email: s.email,
      enrollmentNumber: s.enrollmentNumber,
      course: s.course,
      semester: s.semester,
      section: s.section,
      fatherName: s.fatherName || '',
      motherName: s.motherName || '',
      dob: s.dob || '2003-01-01',
      phone: s.phone || '',
      address: s.address || '',
      admissionYear: s.admissionYear || 2023,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.name.trim() || !form.email.trim() || !form.enrollmentNumber.trim()) {
      showToast('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }
    if (!editingStudent && !form.password.trim()) {
      showToast('Validation Error', 'Password is required for a new student.', 'error');
      return;
    }

    try {
      if (editingStudent) {
        updateStudent(
          editingStudent.id,
          {
            username: form.username.trim(),
            name: form.name.trim(),
            email: form.email.trim(),
            enrollmentNumber: form.enrollmentNumber.trim(),
            course: form.course.trim(),
            semester: Number(form.semester),
            section: form.section.trim(),
            fatherName: form.fatherName.trim(),
            motherName: form.motherName.trim(),
            dob: form.dob,
            phone: form.phone.trim(),
            address: form.address.trim(),
            admissionYear: Number(form.admissionYear),
          },
          form.password.trim() || undefined
        );
        showToast('Student Updated', `${form.name} has been updated.`, 'success');
      } else {
        addStudent(
          {
            username: form.username.trim(),
            name: form.name.trim(),
            email: form.email.trim(),
            enrollmentNumber: form.enrollmentNumber.trim(),
            course: form.course.trim(),
            semester: Number(form.semester),
            section: form.section.trim(),
            fatherName: form.fatherName.trim() || 'Parent Name',
            motherName: form.motherName.trim() || 'Mother Name',
            dob: form.dob,
            phone: form.phone.trim(),
            address: form.address.trim(),
            admissionYear: Number(form.admissionYear),
          },
          form.password.trim()
        );
        showToast('Student Added', `${form.name} can now log in with username "${form.username}".`, 'success');
      }
      setModalOpen(false);
      loadStudents();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const handleDelete = (s: Student) => {
    if (window.confirm(`Delete student ${s.name} (${s.enrollmentNumber})?`)) {
      deleteStudent(s.id);
      showToast('Deleted', `${s.name} removed from database.`, 'info');
      loadStudents();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Students</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add, edit, or remove student accounts and login credentials.
          </p>
        </div>
        <Button onClick={openAddModal} icon={<UserPlus className="h-4 w-4" />}>
          Add New Student
        </Button>
      </div>

      <SearchBar
        value={search}
        onChange={(v) => { setSearch(v); setPage(1); }}
        placeholder="Search by name, username, enrollment no, or email..."
        className="sm:w-96"
      />

      {paginated.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users className="h-8 w-8 text-muted-foreground" />}
            title="No Students Found"
            description="No student accounts match your search."
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-3.5 font-semibold">Student</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Username</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Enrollment No.</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Course &amp; Sem</th>
                  <th className="text-right px-6 py-3.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginated.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{s.username}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-primary-600">{s.enrollmentNumber}</td>
                    <td className="px-6 py-4">
                      <p>{s.course}</p>
                      <p className="text-xs text-muted-foreground">Sem {s.semester} &bull; Sec {s.section}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditModal(s)} icon={<Edit2 className="h-3.5 w-3.5" />}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(s)} icon={<Trash2 className="h-3.5 w-3.5" />}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t text-xs text-muted-foreground">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStudent ? 'Edit Student Account' : 'Add New Student'}
        description="Student can sign in immediately with the configured username/enrollment and password."
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Rohan Mehta"
            />
            <Input
              label="Email *"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. rohan@dav.edu.in"
            />
            <Input
              label="Username *"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="e.g. rohan2026"
            />
            <Input
              label={editingStudent ? 'New Password (leave blank to keep)' : 'Password *'}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password"
            />
            <Input
              label="Enrollment Number *"
              value={form.enrollmentNumber}
              onChange={(e) => setForm({ ...form, enrollmentNumber: e.target.value })}
              placeholder="e.g. DAV2026004"
            />
            <Input
              label="Course *"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
            />
            <Input
              label="Semester"
              type="number"
              min={1}
              max={10}
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
            />
            <Input
              label="Section"
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              label="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingStudent ? 'Save Changes' : 'Create Student'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
