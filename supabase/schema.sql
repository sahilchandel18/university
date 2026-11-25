-- DAV University Smart Student Portal - Supabase PostgreSQL Schema
-- Run this script in your Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles & Departments Enums
CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');
CREATE TYPE department_type AS ENUM ('academic', 'library', 'hostel', 'accounts');
CREATE TYPE clearance_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE application_status AS ENUM ('pending', 'cleared', 'rejected');

-- Users / Profiles Table (linked to auth.users when using Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  department department_type,
  enrollment_number TEXT UNIQUE,
  course TEXT,
  semester INTEGER,
  section TEXT,
  father_name TEXT,
  mother_name TEXT,
  dob DATE,
  blood_group TEXT,
  admission_year INTEGER,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- No Dues Applications Table
CREATE TABLE no_dues_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'pending',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Department Clearances Table (4 rows per application)
CREATE TABLE department_clearances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES no_dues_applications(id) ON DELETE CASCADE,
  department department_type NOT NULL,
  status clearance_status NOT NULL DEFAULT 'pending',
  remarks TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  UNIQUE(application_id, department)
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE no_dues_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_clearances ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies: Students see only their own data; Faculty/Admin have scoped access
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.auth_id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Students view own applications" ON no_dues_applications
  FOR SELECT USING (
    student_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
  );

CREATE POLICY "Students insert own applications" ON no_dues_applications
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid() AND role = 'student')
  );

CREATE POLICY "Faculty and Admin view applications" ON no_dues_applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.auth_id = auth.uid() AND p.role IN ('faculty', 'admin'))
  );

CREATE POLICY "Faculty update own department clearance" ON department_clearances
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.auth_id = auth.uid()
        AND p.role = 'faculty'
        AND p.department = department_clearances.department
    )
  );
