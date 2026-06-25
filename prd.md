# Product Requirements Document

## Student Management System

## 1. Project Overview

The Student Management System is a simple full stack web application designed to manage students, courses, and user access. The system will allow authorized users to log in, view dashboard information, manage student records, manage course records, and perform basic CRUD operations through a secure interface.

The project will be built using **Next.js** for the frontend, **Spring Boot** for the backend REST API, and **Supabase PostgreSQL** as the database.

## 2. Project Goals

The main goal of this project is to build a simple, functional full stack application that demonstrates frontend development, backend API development, database integration, authentication, and basic security.

The system should allow users to:

* Register and log in securely
* View a dashboard
* Add, view, update, and delete students
* Add, view, update, and delete courses
* Assign students to courses if needed
* Protect backend APIs using JWT authentication
* Use role-based access for admin and normal users

## 3. Target Users

### Admin User

The admin can manage all student and course records. The admin can also view registered users and access secured system features.

### Normal User

The normal user can log in and view available student and course information, depending on permissions.

## 4. Main Features

### Authentication

Users should be able to register and log in using email and password. After login, the system should generate a JWT token that is used to access protected APIs.

### Dashboard

After logging in, users should see a dashboard showing basic system information such as total students, total courses, and quick navigation links.

### Student Management

The system should allow users to create, view, update, and delete student records.

Student information may include:

* Student ID
* First name
* Last name
* Email
* Phone number
* Date of birth
* Course
* Status

### Course Management

The system should allow users to create, view, update, and delete course records.

Course information may include:

* Course ID
* Course name
* Course code
* Description
* Duration
* Status

### User Management

The system should store user information for authentication and authorization.

User information may include:

* User ID
* Full name
* Email
* Password
* Role
* Created date

## 5. Functional Requirements

### User Authentication Requirements

* The system must allow users to register.
* The system must allow users to log in.
* The system must validate login credentials.
* The system must generate a JWT token after successful login.
* The system must protect private pages and APIs.
* The system must allow users to log out.

### Student Requirements

* The system must allow creating a new student.
* The system must allow viewing all students.
* The system must allow viewing a single student’s details.
* The system must allow editing student information.
* The system must allow deleting a student.
* The system must show validation errors for invalid student data.

### Course Requirements

* The system must allow creating a new course.
* The system must allow viewing all courses.
* The system must allow viewing a single course’s details.
* The system must allow editing course information.
* The system must allow deleting a course.
* The system must show validation errors for invalid course data.

### Role-Based Access Requirements

* Admin users should be able to create, update, and delete records.
* Normal users should only access allowed pages and actions.
* Unauthorized users should not access protected endpoints.

## 6. Non-Functional Requirements

### Security

* Passwords must be stored securely using encryption or hashing.
* JWT must be required for protected backend routes.
* Users should not access pages or APIs without proper authentication.

### Performance

* Pages should load quickly.
* API responses should be efficient.
* Loading states should be displayed while data is being fetched.

### Usability

* The interface should be simple and easy to use.
* Forms should be clear and responsive.
* Error messages should be understandable.

### Responsiveness

* The application should work on desktop, tablet, and mobile screens.

### Maintainability

* Frontend and backend code should be organized clearly.
* Environment variables should be used for sensitive configuration.
* API routes, services, controllers, and components should follow a clean structure.

## 7. Database Requirements

The system will use Supabase PostgreSQL.

### Tables

#### Users Table

Stores registered user information.

Fields:

* id
* full_name
* email
* password
* role
* created_at

#### Students Table

Stores student records.

Fields:

* id
* first_name
* last_name
* email
* phone
* date_of_birth
* course_id
* status
* created_at

#### Courses Table

Stores course records.

Fields:

* id
* course_name
* course_code
* description
* duration
* status
* created_at

## 8. User Flows

### User Registration Flow

1. User opens the registration page.
2. User enters full name, email, password, and confirms password.
3. System validates the form.
4. Backend checks if the email already exists.
5. If valid, the user account is created.
6. User is redirected to the login page.

### User Login Flow

1. User opens the login page.
2. User enters email and password.
3. Frontend sends login request to backend.
4. Backend validates credentials.
5. If successful, backend returns a JWT token.
6. Token is stored on the frontend.
7. User is redirected to the dashboard.

### View Dashboard Flow

1. Logged-in user opens the dashboard.
2. Frontend requests dashboard data from backend.
3. Backend verifies JWT token.
4. System displays total students, total courses, and navigation links.

### Add Student Flow

1. Admin opens the Students page.
2. Admin clicks “Add Student”.
3. Admin fills in student details.
4. System validates the form.
5. Frontend sends data to backend.
6. Backend saves the student in the database.
7. Student list updates with the new record.

### Edit Student Flow

1. Admin opens the Students page.
2. Admin selects a student record.
3. Admin edits the student information.
4. System validates the updated data.
5. Backend updates the student record.
6. Updated information is displayed in the student list.

### Delete Student Flow

1. Admin opens the Students page.
2. Admin clicks delete on a student record.
3. System asks for confirmation.
4. Backend deletes the student record.
5. Student list refreshes.

### Add Course Flow

1. Admin opens the Courses page.
2. Admin clicks “Add Course”.
3. Admin enters course details.
4. System validates the form.
5. Backend saves the course in the database.
6. Course list updates with the new record.

### Logout Flow

1. User clicks the logout button.
2. Frontend removes the stored JWT token.
3. User is redirected to the login page.
4. Protected pages become inaccessible until login again.

## 9. Pages Required

### Login Page

Allows users to enter email and password.

### Registration Page

Allows new users to create an account.

### Dashboard Page

Shows summary statistics and navigation.

### Students Page

Displays student list and provides add, edit, view, and delete actions.

### Courses Page

Displays course list and provides add, edit, view, and delete actions.

### Error / Unauthorized Page

Displayed when users try to access pages they are not allowed to view.

## 10. API Requirements

### Authentication APIs

* POST `/api/auth/register`
* POST `/api/auth/login`

### Student APIs

* GET `/api/students`
* GET `/api/students/{id}`
* POST `/api/students`
* PUT `/api/students/{id}`
* DELETE `/api/students/{id}`

### Course APIs

* GET `/api/courses`
* GET `/api/courses/{id}`
* POST `/api/courses`
* PUT `/api/courses/{id}`
* DELETE `/api/courses/{id}`

## 11. Success Criteria

The project will be considered successful when:

* Users can register and log in.
* JWT authentication works correctly.
* Students can be created, viewed, updated, and deleted.
* Courses can be created, viewed, updated, and deleted.
* Supabase PostgreSQL is connected successfully.
* Frontend pages are responsive.
* APIs are tested using Postman.
* Protected routes cannot be accessed without login.
* Complete documentation is provided.

## 12. Final Deliverables

The final deliverables include:

* Next.js frontend application
* Spring Boot backend REST API
* Supabase PostgreSQL database
* JWT authentication system
* Student CRUD features
* Course CRUD features
* Role-based access control
* Postman API test collection
* Deployment links
* Project documentation
