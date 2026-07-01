# 🎓 Student Management System

A full-stack web application for managing students and courses with role-based access control. Built with **Next.js**, **Spring Boot**, and **Supabase PostgreSQL**.

---

## 📌 Project Overview

The Student Management System (SMS) allows authorized users to log in, view a dashboard, and manage student and course records through a secure, JWT-protected interface. The system supports three user roles — **Admin**, **Staff**, and **Student** — each with tailored access and a dedicated interface.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), Vanilla CSS |
| Backend | Spring Boot 3, Spring Security |
| Database | Supabase PostgreSQL |
| Auth | JWT (JSON Web Token) |
| Build Tool | Maven (backend), npm (frontend) |

---

## 👥 Roles & Permissions

### ADMIN
- Full access to all features
- Create, view, edit, and delete students and courses
- View all registered users
- Manage user roles

### STAFF
- Can view and manage (add/edit) students and courses
- Cannot delete records
- Cannot access user management

### STUDENT
- Self-registers via the public registration page (role auto-assigned)
- Can view available courses (read-only: no Status or Actions columns)
- Can view their own profile (view-only, cannot self-edit)
- No access to student records or management features

---

## ✨ Features

### Authentication
- JWT-based registration and login
- Role is embedded in the login response and stored in `localStorage`
- Protected frontend pages redirect to login if unauthenticated
- Stateless backend with JWT filter on every request

### Dashboard
- **Admin/Staff**: Total Students count, Total Courses count, Signed-in Role — with quick links to Manage Students and Manage Courses
- **Student**: Your Role, Total Courses count — with quick links to Browse Courses and My Profile

### Student Management (Admin & Staff only)
- List, add, edit, and delete student records
- Fields: First Name, Last Name, Email, Phone, Date of Birth, Course, Status
- Delete restricted to Admin only

### Course Management
- **Admin/Staff**: Full CRUD — list, add, edit, delete (delete: Admin only)
- **Student**: Read-only view — shows Code, Name, Duration only (Status and Actions columns hidden)

### Profile Page
- All roles can view their own profile (Name, Email, Role, Member Since)
- Students see a 🔒 view-only notice — profile changes must be made by an Admin

### Navigation
- Navbar links are filtered by role:
  - Students see: Dashboard, Courses, Profile
  - Admin/Staff see: Dashboard, Students, Courses, Profile
- Role badge displayed in the navbar

---

## 🗄️ Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| id | BIGINT | Primary key, auto-increment |
| full_name | VARCHAR(120) | Required |
| email | VARCHAR | Unique, required |
| password | VARCHAR | BCrypt hashed |
| role | VARCHAR | `ADMIN`, `STAFF`, or `STUDENT` |
| created_at | TIMESTAMP | Set on creation |

### `students`
| Column | Type | Notes |
|---|---|---|
| id | BIGINT | Primary key |
| first_name | VARCHAR | Required |
| last_name | VARCHAR | Required |
| email | VARCHAR | Required |
| phone | VARCHAR | Optional |
| date_of_birth | DATE | Optional |
| course_id | BIGINT | FK → courses |
| status | VARCHAR | e.g. `ACTIVE`, `INACTIVE` |
| created_at | TIMESTAMP | Set on creation |

### `courses`
| Column | Type | Notes |
|---|---|---|
| id | BIGINT | Primary key |
| course_name | VARCHAR | Required |
| course_code | VARCHAR | Required |
| description | TEXT | Optional |
| duration | VARCHAR | Optional |
| status | VARCHAR | e.g. `ACTIVE`, `INACTIVE` |
| created_at | TIMESTAMP | Set on creation |

---

## 📡 API Endpoints

### Authentication (Public)
```
POST /api/auth/register    → Register (role auto-set to STUDENT)
POST /api/auth/login       → Login, returns JWT + user info
```

### Students (ADMIN & STAFF only)
```
GET    /api/students        → List all students
GET    /api/students/{id}   → Get student by ID
POST   /api/students        → Create student
PUT    /api/students/{id}   → Update student
DELETE /api/students/{id}   → Delete student (ADMIN only)
```

### Courses (All authenticated users for GET; ADMIN & STAFF for write)
```
GET    /api/courses         → List all courses
GET    /api/courses/{id}    → Get course by ID
POST   /api/courses         → Create course
PUT    /api/courses/{id}    → Update course
DELETE /api/courses/{id}    → Delete course (ADMIN only)
```

### Users
```
GET /api/users/me           → Current user's profile (all roles)
GET /api/users              → All users (ADMIN only)
```

---

## 🚀 Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- Maven
- A Supabase PostgreSQL database

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create `src/main/resources/application-local.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://<your-supabase-host>:5432/postgres?sslmode=require
   spring.datasource.username=<your-db-username>
   spring.datasource.password=<your-db-password>

   spring.jpa.hibernate.ddl-auto=update

   server.port=8080

   app.jwt.secret=<your-jwt-secret-min-32-chars>
   app.jwt.expiration-ms=86400000
   ```

3. Run the backend:
   ```bash
   # Windows
   .\mvnw spring-boot:run "-Dspring-boot.run.profiles=local"

   # macOS / Linux
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
   ```

   Backend runs at: `http://localhost:8080`

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

3. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

   Frontend runs at: `http://localhost:3000`

---

## 🔑 Creating Users

| Role | How to create |
|---|---|
| **STUDENT** | Self-register via `/register` — role is automatically assigned |
| **STAFF** | Register normally, then manually update `role = 'STAFF'` in the database |
| **ADMIN** | Manually insert or update `role = 'ADMIN'` in the database |

> Currently, STAFF and ADMIN accounts must be created by updating the role column directly in Supabase. A future admin UI for user management is planned.

---

## 📁 Project Structure

```
student-management-system/
├── backend/
│   └── src/main/java/com/example/studentmanagement/
│       ├── controller/        # REST controllers (Auth, Student, Course, User)
│       ├── dto/               # Request/Response DTOs
│       ├── entity/            # JPA entities (User, Student, Course)
│       ├── repository/        # Spring Data JPA repositories
│       ├── security/          # JWT filter, JwtUtil, SecurityConfig
│       └── service/           # Business logic (AuthService, StudentService, CourseService)
│
└── frontend/
    └── src/
        ├── app/
        │   ├── dashboard/     # Dashboard page (role-aware)
        │   ├── students/      # Students list + form
        │   ├── courses/       # Courses list + form
        │   ├── profile/       # Profile page (view-only for students)
        │   ├── login/         # Login page
        │   └── register/      # Registration page
        ├── components/
        │   └── Navbar.js      # Role-filtered navigation bar
        └── lib/
            ├── api.js         # API client functions
            └── storage.js     # Auth session helpers (localStorage)
```

---

## 🔒 Security Notes

- Passwords are hashed with **BCrypt** before storage
- JWT tokens expire after **24 hours** (configurable via `app.jwt.expiration-ms`)
- All non-public API endpoints require a valid `Authorization: Bearer <token>` header
- Role enforcement is done on the **backend** (Spring Security) — frontend UI checks are for UX only
- Never commit `application-local.properties` or `.env.local` to version control

---

## 📋 Pages

| Page | Path | Access |
|---|---|---|
| Home | `/` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Dashboard | `/dashboard` | All authenticated |
| Students | `/students` | Admin, Staff |
| Student Form | `/students/form` | Admin, Staff |
| Courses | `/courses` | All authenticated |
| Course Form | `/courses/form` | Admin, Staff |
| Profile | `/profile` | All authenticated |

---

## 🧪 Testing the API

Use **Postman** or any REST client:

1. Register: `POST /api/auth/register` with `{ "fullName", "email", "password" }`
2. Login: `POST /api/auth/login` → copy the `token` from the response
3. Use the token as `Authorization: Bearer <token>` on all subsequent requests

---

## 📦 Deliverables

- ✅ Next.js frontend with role-aware UI
- ✅ Spring Boot REST API with JWT authentication
- ✅ Supabase PostgreSQL database
- ✅ Role-based access control (ADMIN / STAFF / STUDENT)
- ✅ Student CRUD features
- ✅ Course CRUD features
- ✅ Profile page for all users
- ✅ Responsive design (desktop, tablet, mobile)
