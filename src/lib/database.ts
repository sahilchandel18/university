import { generateId, generateApplicationId } from './utils';
import type {
  User, Student, Faculty, Admin, NoDuesApplication,
  DepartmentClearance, Notification, DepartmentType,
  ClearanceStatus, DashboardStats, SubjectAttendance,
  Assignment, ExamSchedule, TimetableSlot, FeeRecord, Notice
} from '../types';

const STORAGE_KEYS = {
  USERS: 'dav_portal_users',
  APPLICATIONS: 'dav_portal_applications',
  NOTIFICATIONS: 'dav_portal_notifications',
  ASSIGNMENTS: 'dav_portal_assignments',
  FEES: 'dav_portal_fees',
  NOTICES: 'dav_portal_notices',
  INITIALIZED: 'dav_portal_initialized_v2',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Seed data
const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'student-rahul-001',
    username: 'rahul2024',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@dav.edu.in',
    role: 'student',
    enrollmentNumber: 'DAV2024001',
    semester: 6,
    course: 'B.Tech Computer Science',
    section: 'A',
    fatherName: 'Rajesh Sharma',
    motherName: 'Sunita Sharma',
    dob: '2002-05-15',
    bloodGroup: 'B+',
    admissionYear: 2021,
    phone: '9876543210',
    address: 'Jalandhar, Punjab',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'student-priya-002',
    username: 'priya2024',
    name: 'Priya Verma',
    email: 'priya.verma@dav.edu.in',
    role: 'student',
    enrollmentNumber: 'DAV2024002',
    semester: 4,
    course: 'B.Tech Electronics',
    section: 'B',
    fatherName: 'Amit Verma',
    motherName: 'Kavita Verma',
    dob: '2003-08-20',
    bloodGroup: 'A+',
    admissionYear: 2022,
    phone: '9876543211',
    address: 'Chandigarh',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'student-ankit-003',
    username: 'ankit2024',
    name: 'Ankit Kumar',
    email: 'ankit.kumar@dav.edu.in',
    role: 'student',
    enrollmentNumber: 'DAV2024003',
    semester: 8,
    course: 'B.Tech Mechanical',
    section: 'A',
    fatherName: 'Suresh Kumar',
    motherName: 'Meena Kumar',
    dob: '2001-12-10',
    bloodGroup: 'O+',
    admissionYear: 2020,
    phone: '9876543212',
    address: 'Ludhiana, Punjab',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_PASSWORDS: Record<string, string> = {
  '12344': '12344',
  'admin': '12344',
  '1122': '1122',
  'academic': '1122',
  '1212': '1212',
  'library': '1212',
  '2231': '2231',
  'hostel': '2231',
  '2431': '2431',
  'accounts': '2431',
  'rahul2024': 'password123',
  'priya2024': 'password123',
  'ankit2024': 'password123',
};

const DEFAULT_FACULTY: Faculty[] = [
  {
    id: 'faculty-academic-001',
    username: '1122',
    name: 'Dr. Sunil Kapoor',
    email: 'academic@dav.edu.in',
    role: 'faculty',
    department: 'academic',
    phone: '9800000001',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'faculty-library-002',
    username: '1212',
    name: 'Mrs. Anita Gupta',
    email: 'library@dav.edu.in',
    role: 'faculty',
    department: 'library',
    phone: '9800000002',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'faculty-hostel-003',
    username: '2231',
    name: 'Mr. Vikram Singh',
    email: 'hostel@dav.edu.in',
    role: 'faculty',
    department: 'hostel',
    phone: '9800000003',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'faculty-accounts-004',
    username: '2431',
    name: 'Mr. Deepak Jain',
    email: 'accounts@dav.edu.in',
    role: 'faculty',
    department: 'accounts',
    phone: '9800000004',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_ADMIN: Admin = {
  id: 'admin-001',
  username: '12344',
  name: 'DAV University Admin',
  email: 'admin@dav.edu.in',
  role: 'admin',
  phone: '9800000000',
  createdAt: new Date().toISOString(),
};

const DEFAULT_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    subjectCode: 'CSE-601',
    subjectName: 'Software Engineering',
    title: 'SRS Document for Campus ERP',
    description: 'Prepare a complete IEEE-format Software Requirements Specification document with DFD and ER diagrams.',
    dueDate: '2026-12-05',
    maxMarks: 25,
    status: 'pending',
  },
  {
    id: 'asg-2',
    subjectCode: 'CSE-602',
    subjectName: 'Computer Networks',
    title: 'TCP/IP Socket Programming Lab',
    description: 'Implement a multi-threaded client-server chat application using TCP sockets.',
    dueDate: '2026-12-02',
    maxMarks: 20,
    status: 'submitted',
    submittedFile: 'socket_lab_rahul.zip',
    submittedAt: '2026-11-22T14:30:00Z',
  },
  {
    id: 'asg-3',
    subjectCode: 'CSE-603',
    subjectName: 'Database Management Systems',
    title: 'Normalization & Query Optimization',
    description: 'Normalize the given unnormalized schema up to BCNF and write optimized SQL queries.',
    dueDate: '2026-11-20',
    maxMarks: 20,
    status: 'graded',
    submittedFile: 'dbms_assignment3.pdf',
    submittedAt: '2026-11-18T11:15:00Z',
    marksObtained: 19,
  },
  {
    id: 'asg-4',
    subjectCode: 'CSE-604',
    subjectName: 'Compiler Design',
    title: 'Lexical Analyzer using Flex',
    description: 'Build a lexical analyzer for a subset of C language.',
    dueDate: '2026-12-10',
    maxMarks: 25,
    status: 'pending',
  },
];

const DEFAULT_FEES: FeeRecord[] = [
  {
    id: 'fee-1',
    studentId: 'student-rahul-001',
    title: 'Semester 6 Tuition Fee',
    semester: 6,
    amount: 58000,
    dueDate: '2026-08-15',
    status: 'paid',
    paidAt: '2026-08-10T10:20:00Z',
    receiptNo: 'DAV-RCP-2026-8812',
  },
  {
    id: 'fee-2',
    studentId: 'student-rahul-001',
    title: 'Hostel & Mess Charges (Sem 6)',
    semester: 6,
    amount: 32000,
    dueDate: '2026-08-20',
    status: 'paid',
    paidAt: '2026-08-14T15:40:00Z',
    receiptNo: 'DAV-RCP-2026-8945',
  },
  {
    id: 'fee-3',
    studentId: 'student-rahul-001',
    title: 'End-Term Examination Fee',
    semester: 6,
    amount: 2500,
    dueDate: '2026-12-01',
    status: 'pending',
  },
];

const DEFAULT_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'No Dues Clearance Schedule for Final Year & Outgoing Batches',
    category: 'Academic',
    content: 'All eligible students are advised to submit their No Dues clearance application online through the DAV University Student Portal. All four departments (Academic, Library, Hostel, Accounts) will review applications within 48 working hours.',
    date: '2026-11-24',
    issuedBy: 'Office of the Registrar, DAV University',
    important: true,
  },
  {
    id: 'not-2',
    title: 'End-Semester Examination Date Sheet Released',
    category: 'Examination',
    content: 'The theory and practical examination schedule for Odd/Even Semester 2026 has been published. Students must ensure 75% minimum attendance to download admit cards.',
    date: '2026-11-20',
    issuedBy: 'Controller of Examinations',
    important: true,
  },
  {
    id: 'not-3',
    title: 'Central Library Book Return Deadline',
    category: 'Academic',
    content: 'Students applying for No Dues clearance must return all issued library books and settle any overdue fines prior to Library Department verification.',
    date: '2026-11-18',
    issuedBy: 'Chief Librarian, DAV University',
  },
  {
    id: 'not-4',
    title: 'Hostel Room Inspection & Key Handover Notice',
    category: 'Hostel',
    content: 'Hostel residents vacating rooms after semester exams must complete room inspection with the Hostel Warden to receive Hostel Department clearance.',
    date: '2026-11-15',
    issuedBy: 'Chief Warden, Boys & Girls Hostel',
  },
];

export function initializeDatabase(): void {
  if (localStorage.getItem(STORAGE_KEYS.INITIALIZED)) return;

  const allUsers: User[] = [DEFAULT_ADMIN, ...DEFAULT_FACULTY, ...DEFAULT_STUDENTS];
  setItem(STORAGE_KEYS.USERS, allUsers);
  setItem(STORAGE_KEYS.APPLICATIONS, []);
  setItem(STORAGE_KEYS.NOTIFICATIONS, []);
  setItem(STORAGE_KEYS.ASSIGNMENTS, DEFAULT_ASSIGNMENTS);
  setItem(STORAGE_KEYS.FEES, DEFAULT_FEES);
  setItem(STORAGE_KEYS.NOTICES, DEFAULT_NOTICES);

  localStorage.setItem('dav_portal_passwords', JSON.stringify(DEFAULT_PASSWORDS));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}

export function resetDatabase(): void {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  localStorage.removeItem('dav_portal_passwords');
  localStorage.removeItem('dav_portal_current_user');
  initializeDatabase();
}

// Auth functions (supports username, email, enrollmentNumber, and department aliases)
export function authenticateUser(identifier: string, password: string): User | null {
  const cleanId = identifier.trim();
  const passwords: Record<string, string> = JSON.parse(
    localStorage.getItem('dav_portal_passwords') || '{}'
  );
  const users = getItem<User[]>(STORAGE_KEYS.USERS, []);

  // Map friendly aliases to canonical usernames
  const aliasMap: Record<string, string> = {
    'admin': '12344',
    'academic': '1122',
    'library': '1212',
    'hostel': '2231',
    'accounts': '2431',
  };

  const resolvedUsername = aliasMap[cleanId.toLowerCase()] || cleanId;

  const matchedUser = users.find(
    u =>
      u.username.toLowerCase() === resolvedUsername.toLowerCase() ||
      u.email.toLowerCase() === cleanId.toLowerCase() ||
      (u.enrollmentNumber && u.enrollmentNumber.toLowerCase() === cleanId.toLowerCase())
  );

  if (!matchedUser) return null;

  if (passwords[matchedUser.username] === password || passwords[cleanId] === password) {
    return matchedUser;
  }

  return null;
}

export function resetUserPassword(identifier: string, newPassword: string): boolean {
  const cleanId = identifier.trim();
  const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
  const matchedUser = users.find(
    u =>
      u.username.toLowerCase() === cleanId.toLowerCase() ||
      u.email.toLowerCase() === cleanId.toLowerCase() ||
      (u.enrollmentNumber && u.enrollmentNumber.toLowerCase() === cleanId.toLowerCase())
  );
  if (!matchedUser) return false;

  const passwords: Record<string, string> = JSON.parse(
    localStorage.getItem('dav_portal_passwords') || '{}'
  );
  passwords[matchedUser.username] = newPassword;
  localStorage.setItem('dav_portal_passwords', JSON.stringify(passwords));
  return true;
}

// User CRUD
export function getUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.USERS, []);
}

export function getStudents(): Student[] {
  return getItem<User[]>(STORAGE_KEYS.USERS, []).filter(u => u.role === 'student') as Student[];
}

export function getUserById(id: string): User | null {
  const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
  return users.find(u => u.id === id) || null;
}

export function addStudent(student: Omit<Student, 'id' | 'role' | 'createdAt'>, password: string): Student {
  const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
  const passwords: Record<string, string> = JSON.parse(
    localStorage.getItem('dav_portal_passwords') || '{}'
  );

  const existing = users.find(
    u =>
      u.username.toLowerCase() === student.username.toLowerCase() ||
      u.email.toLowerCase() === student.email.toLowerCase() ||
      (u.enrollmentNumber && u.enrollmentNumber.toLowerCase() === student.enrollmentNumber.toLowerCase())
  );
  if (existing) throw new Error('Student with this username, email, or enrollment number already exists');

  const newStudent: Student = {
    ...student,
    id: generateId(),
    role: 'student',
    createdAt: new Date().toISOString(),
  };

  users.push(newStudent);
  passwords[student.username] = password;

  setItem(STORAGE_KEYS.USERS, users);
  localStorage.setItem('dav_portal_passwords', JSON.stringify(passwords));

  return newStudent;
}

export function updateStudent(id: string, data: Partial<Student>, newPassword?: string): Student {
  const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) throw new Error('Student not found');

  const oldUsername = users[index].username;
  users[index] = { ...users[index], ...data };
  setItem(STORAGE_KEYS.USERS, users);

  const passwords: Record<string, string> = JSON.parse(
    localStorage.getItem('dav_portal_passwords') || '{}'
  );
  if (data.username && data.username !== oldUsername) {
    passwords[data.username] = newPassword || passwords[oldUsername] || 'password123';
    delete passwords[oldUsername];
  } else if (newPassword) {
    passwords[users[index].username] = newPassword;
  }
  localStorage.setItem('dav_portal_passwords', JSON.stringify(passwords));

  return users[index] as Student;
}

export function deleteStudent(id: string): void {
  let users = getItem<User[]>(STORAGE_KEYS.USERS, []);
  const student = users.find(u => u.id === id);
  if (!student) throw new Error('Student not found');

  users = users.filter(u => u.id !== id);
  setItem(STORAGE_KEYS.USERS, users);

  const passwords: Record<string, string> = JSON.parse(
    localStorage.getItem('dav_portal_passwords') || '{}'
  );
  delete passwords[student.username];
  localStorage.setItem('dav_portal_passwords', JSON.stringify(passwords));

  let apps = getItem<NoDuesApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  apps = apps.filter(a => a.studentId !== id);
  setItem(STORAGE_KEYS.APPLICATIONS, apps);
}

// No Dues Applications
export function createNoDuesApplication(studentId: string): NoDuesApplication {
  const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
  const student = users.find(u => u.id === studentId) as Student;
  if (!student) throw new Error('Student not found');

  const apps = getItem<NoDuesApplication[]>(STORAGE_KEYS.APPLICATIONS, []);

  const existingActive = apps.find(
    a => a.studentId === studentId && (a.status === 'pending' || a.status === 'cleared')
  );
  if (existingActive) throw new Error('You already have an active or cleared No Dues application');

  const applicationId = generateApplicationId();
  const now = new Date().toISOString();

  const clearances: DepartmentClearance[] = [
    { id: generateId(), applicationId, department: 'academic', status: 'pending' },
    { id: generateId(), applicationId, department: 'library', status: 'pending' },
    { id: generateId(), applicationId, department: 'hostel', status: 'pending' },
    { id: generateId(), applicationId, department: 'accounts', status: 'pending' },
  ];

  const application: NoDuesApplication = {
    id: generateId(),
    applicationId,
    studentId,
    studentName: student.name,
    enrollmentNumber: student.enrollmentNumber,
    course: student.course,
    semester: student.semester,
    status: 'pending',
    appliedAt: now,
    updatedAt: now,
    clearances,
  };

  apps.push(application);
  setItem(STORAGE_KEYS.APPLICATIONS, apps);

  addNotification(
    studentId,
    'Application Submitted',
    `Your No Dues application ${applicationId} has been submitted and sent to all 4 departments.`,
    'success'
  );

  // Notify all 4 faculty departments
  users.filter(u => u.role === 'faculty').forEach(fac => {
    addNotification(
      fac.id,
      'New No Dues Application',
      `${student.name} (${student.enrollmentNumber}) applied for No Dues (${applicationId}).`,
      'info'
    );
  });

  return application;
}

export function getApplicationsByStudent(studentId: string): NoDuesApplication[] {
  const apps = getItem<NoDuesApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  return apps.filter(a => a.studentId === studentId).sort(
    (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  );
}

export function getApplicationsByDepartment(department: DepartmentType): NoDuesApplication[] {
  const apps = getItem<NoDuesApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  return apps.filter(a =>
    a.clearances.some(c => c.department === department)
  ).sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
}

export function getAllApplications(): NoDuesApplication[] {
  return getItem<NoDuesApplication[]>(STORAGE_KEYS.APPLICATIONS, []).sort(
    (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  );
}

export function getApplicationById(applicationId: string): NoDuesApplication | null {
  const apps = getItem<NoDuesApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  return apps.find(a => a.applicationId === applicationId) || null;
}

export function updateClearanceStatus(
  applicationId: string,
  department: DepartmentType,
  status: ClearanceStatus,
  reviewedBy: string,
  remarks?: string
): NoDuesApplication {
  const apps = getItem<NoDuesApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  const appIndex = apps.findIndex(a => a.applicationId === applicationId);
  if (appIndex === -1) throw new Error('Application not found');

  const app = apps[appIndex];
  const clearanceIndex = app.clearances.findIndex(c => c.department === department);
  if (clearanceIndex === -1) throw new Error('Department clearance not found');

  app.clearances[clearanceIndex] = {
    ...app.clearances[clearanceIndex],
    status,
    reviewedBy,
    reviewedAt: new Date().toISOString(),
    remarks,
  };

  const allApproved = app.clearances.every(c => c.status === 'approved');
  const anyRejected = app.clearances.some(c => c.status === 'rejected');

  if (allApproved) {
    app.status = 'cleared';
    addNotification(
      app.studentId,
      'No Dues Cleared!',
      `Congratulations! Your No Dues application ${applicationId} has been cleared by all 4 departments. Your certificate is ready!`,
      'success'
    );
  } else if (anyRejected) {
    app.status = 'rejected';
    addNotification(
      app.studentId,
      'No Dues Rejected',
      `Your No Dues application ${applicationId} was rejected by the ${department} department.${remarks ? ` Reason: ${remarks}` : ''}`,
      'error'
    );
  } else {
    app.status = 'pending';
    addNotification(
      app.studentId,
      'Department Clearance Update',
      `Your No Dues application ${applicationId} has been ${status} by the ${department} department.`,
      status === 'approved' ? 'success' : 'info'
    );
  }

  app.updatedAt = new Date().toISOString();
  apps[appIndex] = app;
  setItem(STORAGE_KEYS.APPLICATIONS, apps);

  return app;
}

// Academic / Student Portal Data
export function getSubjectsAndAttendance(): SubjectAttendance[] {
  return [
    { id: 'sub-1', code: 'CSE-601', name: 'Software Engineering', faculty: 'Dr. Sunil Kapoor', credits: 4, attended: 34, total: 38, grade: 'A' },
    { id: 'sub-2', code: 'CSE-602', name: 'Computer Networks', faculty: 'Prof. Rakesh Mehta', credits: 4, attended: 31, total: 36, grade: 'A-' },
    { id: 'sub-3', code: 'CSE-603', name: 'Database Management Systems', faculty: 'Dr. Neha Sharma', credits: 4, attended: 37, total: 40, grade: 'A+' },
    { id: 'sub-4', code: 'CSE-604', name: 'Compiler Design', faculty: 'Prof. Amitabh Roy', credits: 3, attended: 24, total: 32, grade: 'B+' },
    { id: 'sub-5', code: 'CSE-605', name: 'Machine Learning', faculty: 'Dr. Priya Nair', credits: 4, attended: 35, total: 38, grade: 'A' },
  ];
}

export function getAssignments(): Assignment[] {
  return getItem<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, DEFAULT_ASSIGNMENTS);
}

export function submitAssignment(id: string, fileName: string): Assignment[] {
  const assignments = getAssignments();
  const idx = assignments.findIndex(a => a.id === id);
  if (idx !== -1) {
    assignments[idx] = {
      ...assignments[idx],
      status: 'submitted',
      submittedFile: fileName,
      submittedAt: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.ASSIGNMENTS, assignments);
  }
  return assignments;
}

export function getExamSchedule(): ExamSchedule[] {
  return [
    { id: 'ex-1', subjectCode: 'CSE-601', subjectName: 'Software Engineering', examType: 'End-Term', date: '2026-12-14', time: '09:30 AM - 12:30 PM', room: 'Block A - Hall 101', maxMarks: 100 },
    { id: 'ex-2', subjectCode: 'CSE-602', subjectName: 'Computer Networks', examType: 'End-Term', date: '2026-12-16', time: '09:30 AM - 12:30 PM', room: 'Block A - Hall 104', maxMarks: 100 },
    { id: 'ex-3', subjectCode: 'CSE-603', subjectName: 'Database Management Systems', examType: 'End-Term', date: '2026-12-18', time: '09:30 AM - 12:30 PM', room: 'Block B - Hall 202', maxMarks: 100 },
    { id: 'ex-4', subjectCode: 'CSE-604', subjectName: 'Compiler Design', examType: 'End-Term', date: '2026-12-21', time: '01:30 PM - 04:30 PM', room: 'Block A - Hall 102', maxMarks: 100 },
    { id: 'ex-5', subjectCode: 'CSE-605', subjectName: 'Machine Learning', examType: 'Practical', date: '2026-12-23', time: '10:00 AM - 01:00 PM', room: 'AI & ML Lab 3', maxMarks: 50 },
  ];
}

export function getTimetable(): TimetableSlot[] {
  return [
    { day: 'Monday', time: '09:00 - 10:00', subjectCode: 'CSE-601', subjectName: 'Software Engineering', room: 'CR-201', faculty: 'Dr. Sunil Kapoor', type: 'Lecture' },
    { day: 'Monday', time: '10:00 - 11:00', subjectCode: 'CSE-602', subjectName: 'Computer Networks', room: 'CR-201', faculty: 'Prof. Rakesh Mehta', type: 'Lecture' },
    { day: 'Monday', time: '11:30 - 01:30', subjectCode: 'CSE-603', subjectName: 'DBMS Lab', room: 'Lab-2', faculty: 'Dr. Neha Sharma', type: 'Lab' },
    { day: 'Tuesday', time: '09:00 - 10:00', subjectCode: 'CSE-604', subjectName: 'Compiler Design', room: 'CR-204', faculty: 'Prof. Amitabh Roy', type: 'Lecture' },
    { day: 'Tuesday', time: '10:00 - 11:00', subjectCode: 'CSE-605', subjectName: 'Machine Learning', room: 'CR-204', faculty: 'Dr. Priya Nair', type: 'Lecture' },
    { day: 'Tuesday', time: '02:00 - 03:00', subjectCode: 'CSE-601', subjectName: 'SE Tutorial', room: 'TR-102', faculty: 'Dr. Sunil Kapoor', type: 'Tutorial' },
    { day: 'Wednesday', time: '09:00 - 10:00', subjectCode: 'CSE-603', subjectName: 'Database Management', room: 'CR-201', faculty: 'Dr. Neha Sharma', type: 'Lecture' },
    { day: 'Wednesday', time: '10:00 - 12:00', subjectCode: 'CSE-602', subjectName: 'CN Lab', room: 'Net Lab-1', faculty: 'Prof. Rakesh Mehta', type: 'Lab' },
    { day: 'Thursday', time: '09:00 - 10:00', subjectCode: 'CSE-605', subjectName: 'Machine Learning', room: 'CR-201', faculty: 'Dr. Priya Nair', type: 'Lecture' },
    { day: 'Thursday', time: '10:00 - 11:00', subjectCode: 'CSE-604', subjectName: 'Compiler Design', room: 'CR-201', faculty: 'Prof. Amitabh Roy', type: 'Lecture' },
    { day: 'Friday', time: '09:00 - 10:00', subjectCode: 'CSE-601', subjectName: 'Software Engineering', room: 'CR-202', faculty: 'Dr. Sunil Kapoor', type: 'Lecture' },
    { day: 'Friday', time: '11:00 - 01:00', subjectCode: 'CSE-605', subjectName: 'ML Lab', room: 'AI Lab-3', faculty: 'Dr. Priya Nair', type: 'Lab' },
  ];
}

export function getStudentFees(studentId: string): FeeRecord[] {
  const allFees = getItem<FeeRecord[]>(STORAGE_KEYS.FEES, DEFAULT_FEES);
  const studentFees = allFees.filter(f => f.studentId === studentId);
  if (studentFees.length === 0) {
    // Generate default fee records for newly added students
    return [
      {
        id: `fee-${studentId}-1`,
        studentId,
        title: 'Current Semester Tuition Fee',
        semester: 1,
        amount: 55000,
        dueDate: '2026-08-15',
        status: 'paid',
        paidAt: '2026-08-10T10:00:00Z',
        receiptNo: `DAV-RCP-${Math.floor(1000 + Math.random() * 9000)}`,
      },
      {
        id: `fee-${studentId}-2`,
        studentId,
        title: 'Examination Fee',
        semester: 1,
        amount: 2500,
        dueDate: '2026-12-01',
        status: 'pending',
      },
    ];
  }
  return studentFees;
}

export function payStudentFee(feeId: string, studentId: string): FeeRecord[] {
  const allFees = getItem<FeeRecord[]>(STORAGE_KEYS.FEES, DEFAULT_FEES);
  const idx = allFees.findIndex(f => f.id === feeId);
  const receiptNo = `DAV-RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  if (idx !== -1) {
    allFees[idx] = {
      ...allFees[idx],
      status: 'paid',
      paidAt: new Date().toISOString(),
      receiptNo,
    };
    setItem(STORAGE_KEYS.FEES, allFees);
  } else {
    allFees.push({
      id: feeId,
      studentId,
      title: 'Examination Fee',
      semester: 1,
      amount: 2500,
      dueDate: '2026-12-01',
      status: 'paid',
      paidAt: new Date().toISOString(),
      receiptNo,
    });
    setItem(STORAGE_KEYS.FEES, allFees);
  }
  addNotification(studentId, 'Fee Payment Successful', `Receipt ${receiptNo} generated for your fee payment.`, 'success');
  return getStudentFees(studentId);
}

export function getNotices(): Notice[] {
  return getItem<Notice[]>(STORAGE_KEYS.NOTICES, DEFAULT_NOTICES);
}

// Notifications
export function addNotification(
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
): Notification {
  const notifications = getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const notification: Notification = {
    id: generateId(),
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };

  notifications.unshift(notification);
  const userNotifs = notifications.filter(n => n.userId === userId);
  if (userNotifs.length > 100) {
    const toRemove = userNotifs.slice(100).map(n => n.id);
    const filtered = notifications.filter(n => !toRemove.includes(n.id));
    setItem(STORAGE_KEYS.NOTIFICATIONS, filtered);
  } else {
    setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  return notification;
}

export function getNotifications(userId: string): Notification[] {
  const notifications = getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  return notifications.filter(n => n.userId === userId);
}

export function markNotificationRead(notificationId: string): void {
  const notifications = getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const index = notifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    notifications[index].read = true;
    setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
}

export function markAllNotificationsRead(userId: string): void {
  const notifications = getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  notifications.forEach(n => {
    if (n.userId === userId) n.read = true;
  });
  setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

// Dashboard Stats
export function getDashboardStats(): DashboardStats {
  const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
  const apps = getItem<NoDuesApplication[]>(STORAGE_KEYS.APPLICATIONS, []);

  return {
    totalStudents: users.filter(u => u.role === 'student').length,
    totalApplications: apps.length,
    pendingApplications: apps.filter(a => a.status === 'pending').length,
    approvedApplications: apps.filter(a => a.clearances.some(c => c.status === 'approved')).length,
    rejectedApplications: apps.filter(a => a.status === 'rejected').length,
    clearedApplications: apps.filter(a => a.status === 'cleared').length,
  };
}

export function getDepartmentStats(department: DepartmentType) {
  const apps = getItem<NoDuesApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  const deptClearances = apps.map(a => a.clearances.find(c => c.department === department)).filter(Boolean);

  return {
    total: deptClearances.length,
    pending: deptClearances.filter(c => c!.status === 'pending').length,
    approved: deptClearances.filter(c => c!.status === 'approved').length,
    rejected: deptClearances.filter(c => c!.status === 'rejected').length,
  };
}
