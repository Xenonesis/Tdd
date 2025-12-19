# Product Requirements Document (PRD): Internship Learning Management System (RBAC-Based)

## 1. Introduction

### 1.1 Objective
The objective of this TDD Kata is to design, develop, and test a full-stack Internship Learning Management System (LMS) with strict Role-Based Access Control (RBAC). This project evaluates the ability to build a real-world, production-style system by applying Test-Driven Development (TDD), backend API development, authentication and authorization, relational database design, frontend single-page application development, sequential progress tracking, and certificate generation.

The system simulates an internship or training platform where Students, Mentors, and Admins interact under clearly defined permissions and business rules. All development must follow TDD principles: write tests before implementing features, following the Red-Green-Refactor cycle.

### 1.2 Scope
- Full-stack web application with separate frontend and backend
- Persistent database (Supabase PostgreSQL recommended)
- JWT-based authentication with RBAC enforcement
- Three user roles: Student, Mentor, Admin
- Course management with sequential chapter progression
- Progress tracking and certificate generation
- Responsive, professional UI

### 1.3 Out of Scope
- Mobile applications
- Multi-tenant architecture
- Advanced analytics beyond basic reporting
- Integration with external LMS platforms
- Real-time notifications (beyond basic implementation)

## 2. User Roles and Permissions

### 2.1 Student
Students are learners enrolled in internship courses.

**Permissions:**
- Register and log in to the system
- View only courses assigned to them
- Access chapters in strict sequential order (cannot skip)
- Complete chapters one by one
- Track chapter-wise and overall progress
- View course content (images and video links)
- Download course completion certificate only after 100% completion

**Restrictions:**
- Cannot access unassigned courses
- Cannot skip chapters
- Cannot generate certificates before full completion

### 2.2 Mentor
Mentors are instructors responsible for creating and managing courses.

**Permissions:**
- Log in (accounts must be approved by Admin)
- Create new courses
- Add chapters step-by-step to courses
- Assign courses to selected students
- Track progress of students enrolled in their courses

**Restrictions:**
- Cannot approve their own accounts
- Can only manage courses they created
- Cannot access admin-level features

### 2.3 Admin
Admins have complete control over the system.

**Permissions:**
- Approve or reject mentor accounts
- Manage all users (students and mentors)
- View platform-wide analytics (users, courses, completions)
- Access all system resources without restriction

**Restrictions:**
- None (full system access)

### 2.4 Access Control Enforcement
All access must be enforced using RBAC at both API and database levels.

**HTTP Status Codes for Unauthorized Access:**
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: Insufficient permissions

## 3. Functional Requirements

### 3.1 Authentication & Authorization
- JWT-based authentication mandatory
- JWT payload must include: userId, role
- All protected endpoints must validate JWT and verify user role
- RBAC enforced at backend API level
- RBAC enforced at database level (using Supabase Row Level Security where applicable)

### 3.2 User Management
- Student self-registration
- Admin approval workflow for mentors
- User profile management
- Role-based user listing and management

### 3.3 Course Management
- Mentor creation of courses with title, description
- Chapter addition with title, description, image, video link, sequence order
- Course assignment to students
- Course visibility restricted to assigned students only

### 3.4 Progress Tracking
- Sequential chapter completion (no skipping)
- Chapter-wise progress storage
- Automatic completion percentage calculation
- Progress visualization for students and mentors

### 3.5 Certificate Generation
- Dynamic PDF certificate generation
- Certificate unlocked only after 100% course completion
- Downloadable anytime after completion
- Certificate includes course details and completion date

## 4. Technical Requirements

### 4.1 Backend API (RESTful)
**Technology Stack Options:**
- Node.js with TypeScript (Express or NestJS)
- Python (Django or FastAPI)
- Java (Spring Boot)
- Ruby on Rails

**Responsibilities:**
- Business logic implementation
- RBAC enforcement
- Input validation
- Progress and certificate eligibility checks

### 4.2 Database
**Requirements:**
- Persistent, production-grade database
- No in-memory databases allowed

**Supported Databases:**
- PostgreSQL (recommended)
- MongoDB
- MySQL
- SQLite

**Supabase PostgreSQL (Recommended):**
- Fully managed PostgreSQL database
- Supports tables, relationships, joins, indexes, constraints, transactions
- Row Level Security for additional RBAC enforcement

**Suggested Database Schema:**
- Users (id, email, password, firstName, lastName, role, isActive, createdAt, updatedAt)
- Courses (id, title, description, mentorId, createdAt, updatedAt)
- Chapters (id, courseId, title, description, imageUrl, videoUrl, sequenceOrder, createdAt)
- CourseAssignments (id, courseId, studentId, assignedAt)
- Progress (id, studentId, chapterId, completedAt)
- Certificates (id, studentId, courseId, pdfUrl, issuedAt)

### 4.3 Frontend Application
**Technology Stack:**
- Modern Single Page Application framework: React, Vue, Angular, or Svelte

**Required Screens:**
- Login and Registration
- Student Dashboard
- Mentor Dashboard
- Admin Panel
- Course Viewer (chapter-by-chapter)
- Progress Tracking View
- Certificate Download Page

**Functionality:**
- Secure JWT token handling and storage
- Role-based UI rendering
- Locked chapters until prerequisites completed
- Visual progress indicators (percentage/progress bars)
- Certificate download enabled only after completion

### 4.4 API Endpoints

#### Authentication
- `POST /api/auth/register` - Student registration only
- `POST /api/auth/login` - Login for all roles

#### User Management (Admin Only)
- `GET /api/users` - List all users
- `PUT /api/users/:id/approve-mentor` - Approve mentor account
- `DELETE /api/users/:id` - Delete user

#### Course Management (Mentor Only)
- `POST /api/courses` - Create new course
- `GET /api/courses/my` - Get mentor's courses
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

#### Chapter Management (Mentor Only)
- `POST /api/courses/:id/chapters` - Add chapter to course
- `GET /api/courses/:id/chapters` - Get course chapters

#### Course Assignment (Mentor Only)
- `POST /api/courses/:id/assign` - Assign course to students

#### Progress Tracking (Student Only)
- `POST /api/progress/:chapterId/complete` - Mark chapter as complete
- `GET /api/progress/my` - Get student's progress

#### Certificate Generation
- `GET /api/certificates/:courseId` - Generate/download certificate

## 5. Non-Functional Requirements

### 5.1 Performance
- Response times < 2 seconds for API calls
- Support for concurrent users
- Efficient database queries with proper indexing

### 5.2 Security
- Secure password hashing (bcrypt recommended)
- JWT token expiration and refresh
- Input validation and sanitization
- Protection against common web vulnerabilities (XSS, CSRF)

### 5.3 Usability
- Intuitive user interface
- Clear error messages
- Responsive design for mobile and desktop
- Accessibility compliance (WCAG 2.1 AA)

### 5.4 Scalability
- Modular architecture following SOLID principles
- Database design supporting future growth
- API design allowing for feature extensions

## 6. Testing Requirements

### 6.1 Test-Driven Development (TDD)
- Write tests before implementing features
- Follow Red-Green-Refactor cycle
- Focus testing on:
  - Authentication and RBAC enforcement
  - Sequential chapter unlocking logic
  - Certificate eligibility conditions

### 6.2 Testing Types
- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Security testing for RBAC enforcement

### 6.3 Test Coverage
- Minimum 80% code coverage
- All critical paths tested
- Edge cases covered

## 7. UI/UX Requirements

### 7.1 Design Principles
- Clean and professional appearance
- Consistent design language
- Clear visual hierarchy
- Intuitive navigation

### 7.2 Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interfaces

### 7.3 Role-Based UI
- Different dashboards for each role
- Conditional rendering based on permissions
- Clear indication of user role and available actions

## 8. Development Process

### 8.1 Clean Coding Practices
- Follow SOLID principles
- Modular and scalable architecture
- Clean, readable, well-documented code
- Consistent code formatting

### 8.2 Git & Version Control
- Use Git for version control
- Frequent commits with descriptive messages
- Commit history reflecting development progress
- Feature branches for new functionality

### 8.3 AI Usage Policy
- AI tools may be used responsibly
- Transparent disclosure of AI assistance
- Validation of AI-generated code
- README must include "My AI Usage" section detailing:
  - AI tools used
  - How AI was used
  - Reflection on productivity and learning improvements

## 9. Deployment and Delivery

### 9.1 Deliverables
- Public Git repository
- Detailed README.md with setup instructions
- Test report or coverage summary
- Screenshots of the application
- Live deployment link (recommended)

### 9.2 Documentation
- API documentation
- Database schema documentation
- Setup and deployment guides
- User manuals for each role

### 9.3 Interview Readiness
Candidates must be prepared to explain:
- Where AI assistance was used
- How AI-generated code was validated
- Why Supabase PostgreSQL was chosen as the database
- TDD implementation details
- RBAC enforcement mechanisms

## 10. Success Criteria

### 10.1 Functional Completeness
- All user roles can perform their designated actions
- RBAC is properly enforced
- Sequential progress tracking works correctly
- Certificates are generated only upon completion

### 10.2 Technical Excellence
- Clean, maintainable code
- Comprehensive test coverage
- Secure implementation
- Responsive and usable interface

### 10.3 Process Compliance
- TDD practices followed throughout
- Git history shows iterative development
- AI usage transparently documented
- All deliverables provided

## 11. Risks and Mitigations

### 11.1 Technical Risks
- Database connection issues: Use Supabase for reliable hosting
- Authentication vulnerabilities: Implement proper JWT handling and validation
- Performance issues: Optimize queries and implement caching where needed

### 11.2 Process Risks
- Incomplete TDD adoption: Regular code reviews to ensure test-first approach
- Scope creep: Strict adherence to defined requirements
- AI over-reliance: Manual validation and understanding of all generated code

## 12. Timeline and Milestones

### Phase 1: Planning and Setup (Week 1)
- Requirements analysis
- Technology stack selection
- Database schema design
- Development environment setup

### Phase 2: Core Backend Development (Weeks 2-3)
- Authentication and RBAC implementation
- User management APIs
- Database integration
- Basic course and chapter management

### Phase 3: Advanced Features (Weeks 4-5)
- Progress tracking logic
- Certificate generation
- File upload handling
- Advanced RBAC enforcement

### Phase 4: Frontend Development (Weeks 6-7)
- UI/UX design and implementation
- Integration with backend APIs
- Role-based UI rendering
- Responsive design

### Phase 5: Testing and Refinement (Week 8)
- Comprehensive testing
- Performance optimization
- Security review
- Documentation completion

### Phase 6: Deployment and Presentation (Week 9)
- Production deployment
- Final testing
- Documentation review
- Project presentation

---

*This PRD serves as the comprehensive guide for developing the Internship Learning Management System. All development must adhere to these specifications while following TDD principles and clean coding practices.*