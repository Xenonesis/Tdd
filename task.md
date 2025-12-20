TDD Kata: Internship Learning Management System (RBAC-Based)
Objective
The objective of this kata is to design, develop, and test a full-stack Internship Learning Management System (LMS) with strict Role-Based Access Control (RBAC).
This project evaluates a candidate’s ability to build a real-world, production-style system by applying:
Backend API development
Authentication and authorization
Role-Based Access Control (RBAC)
Relational database design
Frontend single-page application development
Sequential progress tracking
Certificate generation
Test-Driven Development (TDD)
Responsible and transparent use of AI tools
The system simulates an internship or training platform where Students, Mentors, and Admins interact under clearly defined permissions and business rules.

Roles & Access Control (Mandatory)
The application must implement three user roles, and all access must be enforced using RBAC at both API and database levels.

1. Student
   Students are learners enrolled in internship courses.
   Students must be able to:
   Register and log in
   View only the courses assigned to them
   Access chapters in a strict sequence
   Complete chapters one by one (cannot skip chapters)
   Track chapter-wise and overall progress
   View course content (images and video links)
   Download a course completion certificate only after 100% completion

2. Mentor
   Mentors are instructors responsible for creating and managing courses.
   Mentors must be able to:
   Log in (mentor accounts must be approved by Admin)
   Create new courses
   Add chapters step-by-step to a course
   Assign courses to selected students
   Track the progress of students enrolled in their courses

3. Admin
   Admins have complete control over the system.
   Admins must be able to:
   Approve or reject mentor accounts
   Manage all users (students and mentors)
   View platform-wide analytics (users, courses, completions)
   Access all system resources without restriction
   Unauthorized access must be handled correctly using HTTP status codes:
   401 Unauthorized (invalid or missing token)
   403 Forbidden (insufficient permissions)

Core Requirements

1. Backend API (RESTful)
   Technology
   You must choose one backend technology stack:
   Node.js with TypeScript (Express or NestJS)
   Python (Django or FastAPI)
   Java (Spring Boot)
   Ruby on Rails
   The backend is responsible for:
   Business logic
   RBAC enforcement
   Validation rules
   Progress and certificate eligibility checks

Database (Supabase – PostgreSQL)
Database Choice
The system must use a persistent, production-grade database.
In-memory databases are not allowed.
You must use one of the following:
PostgreSQL
MongoDB
MySQL
SQLite
Supabase Database (Recommended, Not Mandatory)
Supabase is allowed and recommended because:
Supabase provides a fully managed PostgreSQL database
PostgreSQL is a relational, production-ready SQL database
Supports tables, relationships, joins, indexes, constraints, and transactions
Fully compliant with internship and production requirements
In this project:
Supabase will be used as the database layer
The backend will connect to Supabase PostgreSQL
Supabase is not an in-memory solution and fully satisfies database requirements
Suggested database entities:
Users (students, mentors, admins)
Courses
Chapters
Course assignments
Progress tracking
Certificates

Authentication & Authorization
JWT-based authentication is mandatory
JWT payload must include:
userId
role (student, mentor, admin)
All protected endpoints must:
Validate JWT token
Verify user role before granting access
RBAC must be enforced at:
Backend API level
Database level (optional but encouraged using Supabase Row Level Security)

API Endpoints
Authentication
POST /api/auth/register (Student registration only)
POST /api/auth/login

User Management (Admin Only)
GET /api/users
PUT /api/users/:id/approve-mentor
DELETE /api/users/:id

Course Management (Mentor Only)
POST /api/courses
GET /api/courses/my
PUT /api/courses/:id
DELETE /api/courses/:id
Each course must include:
Unique ID
Title
Description
Mentor ID
Creation timestamp

Chapter Management (Mentor Only)
POST /api/courses/:id/chapters
GET /api/courses/:id/chapters
Each chapter must include:
Title
Description
Image (file upload or URL)
Video link (YouTube, Vimeo, or Drive)
Sequence order

Course Assignment (Mentor Only)
POST /api/courses/:id/assign
Rules:
Courses must be visible only to assigned students
Unassigned students must not access the course

Progress Tracking (Student Only)
POST /api/progress/:chapterId/complete
GET /api/progress/my
Rules:
Chapters must be completed sequentially
Progress must be stored chapter-wise
Completion percentage must be calculated automatically

Certificate Generation
GET /api/certificates/:courseId
Rules:
Certificate unlocked only after 100% course completion
Certificate must be generated dynamically as a PDF
Certificate must be downloadable anytime after completion

2. Frontend Application
   Technology
   Use a modern Single Page Application (SPA) framework:
   React
   Vue
   Angular
   Svelte

Required Screens
Login and Registration
Student Dashboard
Mentor Dashboard
Admin Panel
Course Viewer (chapter-by-chapter)
Progress Tracking View
Certificate Download Page

Functionality
Secure JWT handling
Role-based UI rendering
Locked chapters until prerequisites are completed
Visual progress indicators (percentage or progress bar)
Certificate download enabled only after completion

Design Requirements
Responsive design
Clean and professional UI
Clear role-based navigation

Process & Technical Guidelines

Test-Driven Development (TDD)
Write tests before implementing features
Follow the Red-Green-Refactor cycle
Focus testing on:
Authentication and RBAC enforcement
Sequential chapter unlocking logic
Certificate eligibility conditions

Clean Coding Practices
Follow SOLID principles
Use modular and scalable architecture
Write clean, readable, and well-documented code

Git & Version Control
Use Git for version control
Commit frequently with clear and descriptive messages
Commit history should reflect development progress

AI Usage Policy
AI tools may be used responsibly.

README Requirement: “My AI Usage”
The README.md must include:
AI tools used
How AI was used
Reflection on how AI improved productivity and learning

Interview Readiness
Candidates must be prepared to explain:
Where AI assistance was used
How AI-generated code was validated
Why Supabase PostgreSQL was chosen as the database

Deliverables
Public Git repository
Detailed README.md with setup instructions
Test report or coverage summary
Screenshots of the application
Live deployment link (recommended)

Important Notes
Plagiarism is strictly prohibited
AI usage must be transparently disclosed
Focus on business logic, RBAC enforcement, and real-world behavior
Supabase is used as a PostgreSQL database, not an in-memory solution
