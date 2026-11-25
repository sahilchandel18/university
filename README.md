# DAV University — Smart Student Portal & No Dues System

A full-stack university student portal built with React, TypeScript, Tailwind CSS, Recharts, and Supabase/PostgreSQL schema support.

## Features

- **Role-Based Authentication**: Student, Faculty (4 departments), and Admin sign-in with Remember Me, Show/Hide Password, and Forgot Password reset.
- **Student Portal**:
  - Dashboard with attendance charts, pending assignments, fee summary, and notices
  - Academics & Attendance tracker
  - Assignments submission & End-Term Exam schedule
  - Weekly Class Timetable
  - Fees & Online Payment with printable receipts
  - University Notices & Circulars
  - **No Dues Clearance**: Submit application, get unique Application ID (`ND-YYYY-XXXXXX`), track live status across all 4 departments, and print/download the official **No Dues Cleared Certificate** once all 4 departments approve.
- **Faculty Portals (4 Departments)**:
  - Academic, Library, Hostel, and Accounts departments
  - View student applications and **Approve** or **Reject** (with remarks)
- **Admin Dashboard**:
  - Live analytics & Recharts department breakdown
  - Inspect all No Dues applications and department clearances
  - Full Student CRUD (add new students with username/password, edit, delete, search, pagination)

## Demo Credentials

| Role | Username / ID | Password |
| :--- | :--- | :--- |
| **Admin** | `12344` | `12344` |
| **Academic Faculty** | `1122` | `1122` |
| **Library Faculty** | `1212` | `1212` |
| **Hostel Faculty** | `2231` | `2231` |
| **Accounts Faculty** | `2431` | `2431` |
| **Student (Rahul)** | `rahul2024` (or `DAV2024001`) | `password123` |
| **Student (Priya)** | `priya2024` (or `DAV2024002`) | `password123` |
| **Student (Ankit)** | `ankit2024` (or `DAV2024003`) | `password123` |

## Local Development

```bash
npm install
npm run dev
```

## Production Build & Vercel Deployment

1. Copy `.env.example` to `.env` and add your Supabase credentials (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) if connecting to a live Supabase project.
2. Run `supabase/schema.sql` in your Supabase SQL Editor to create tables and Row Level Security (RLS) policies.
3. Run `npm run build` to verify TypeScript & Vite production build.
4. Deploy directly to Vercel (`vercel.json` handles SPA routing).
