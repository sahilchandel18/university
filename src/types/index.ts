export type UserRole = 'student' | 'faculty' | 'admin';

export type DepartmentType = 'academic' | 'library' | 'hostel' | 'accounts';

export type ClearanceStatus = 'pending' | 'approved' | 'rejected';

export type ApplicationStatus = 'pending' | 'cleared' | 'rejected';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  department?: DepartmentType;
  enrollmentNumber?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  semester?: number;
  course?: string;
  section?: string;
  createdAt: string;
}

export interface Student extends User {
  role: 'student';
  enrollmentNumber: string;
  semester: number;
  course: string;
  section: string;
  fatherName: string;
  motherName: string;
  dob: string;
  bloodGroup?: string;
  admissionYear: number;
}

export interface Faculty extends User {
  role: 'faculty';
  department: DepartmentType;
}

export interface Admin extends User {
  role: 'admin';
}

export interface NoDuesApplication {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  course: string;
  semester: number;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  clearances: DepartmentClearance[];
}

export interface DepartmentClearance {
  id: string;
  applicationId: string;
  department: DepartmentType;
  status: ClearanceStatus;
  remarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface SubjectAttendance {
  id: string;
  code: string;
  name: string;
  faculty: string;
  credits: number;
  attended: number;
  total: number;
  grade?: string;
}

export interface Assignment {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  status: 'pending' | 'submitted' | 'graded';
  submittedFile?: string;
  submittedAt?: string;
  marksObtained?: number;
}

export interface ExamSchedule {
  id: string;
  subjectCode: string;
  subjectName: string;
  examType: 'Mid-Term' | 'End-Term' | 'Practical';
  date: string;
  time: string;
  room: string;
  maxMarks: number;
}

export interface TimetableSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string;
  subjectCode: string;
  subjectName: string;
  room: string;
  faculty: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

export interface FeeRecord {
  id: string;
  studentId: string;
  title: string;
  semester: number;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending';
  paidAt?: string;
  receiptNo?: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Academic' | 'Examination' | 'Hostel' | 'Accounts' | 'General';
  content: string;
  date: string;
  issuedBy: string;
  important?: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  clearedApplications: number;
}

export const DEPARTMENTS: { key: DepartmentType; label: string; icon: string }[] = [
  { key: 'academic', label: 'Academic Department', icon: 'GraduationCap' },
  { key: 'library', label: 'Library Department', icon: 'BookOpen' },
  { key: 'hostel', label: 'Hostel Department', icon: 'Building2' },
  { key: 'accounts', label: 'Accounts Department', icon: 'Wallet' },
];

export const DEPARTMENT_LABELS: Record<DepartmentType, string> = {
  academic: 'Academic Department',
  library: 'Library Department',
  hostel: 'Hostel Department',
  accounts: 'Accounts Department',
};
