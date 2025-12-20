# 📝 Manual Testing Guide

This guide provides step-by-step instructions for manually testing the Internship Learning Management System.

---

## 🚀 Prerequisites

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run start:dev
   ```
   Server runs on: `http://localhost:3000`

2. **Start the Frontend (Optional)**
   ```bash
   npm run dev
   ```
   Frontend runs on: `http://localhost:3001`

3. **API Testing Tool** (choose one):
   - Postman
   - Insomnia
   - cURL
   - Thunder Client (VS Code extension)

---

## 🎯 Test Scenario 1: Complete User Journey

### Step 1: Register Users

#### Register a Student
**POST** `http://localhost:3000/api/auth/register`

```json
{
  "email": "student@test.com",
  "password": "Student123!",
  "firstName": "John",
  "lastName": "Student",
  "role": "STUDENT"
}
```

**Expected Response (201):**
```json
{
  "user": {
    "id": "user-id",
    "email": "student@test.com",
    "firstName": "John",
    "lastName": "Student",
    "role": "STUDENT",
    "isActive": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Account created successfully."
}
```

**Save the `accessToken` as `STUDENT_TOKEN`**

---

#### Register a Mentor
**POST** `http://localhost:3000/api/auth/register`

```json
{
  "email": "mentor@test.com",
  "password": "Mentor123!",
  "firstName": "Jane",
  "lastName": "Mentor",
  "role": "MENTOR"
}
```

**Expected Response (201):**
```json
{
  "user": {
    "id": "mentor-id",
    "email": "mentor@test.com",
    "firstName": "Jane",
    "lastName": "Mentor",
    "role": "MENTOR",
    "isActive": false
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Mentor account created. Waiting for admin approval."
}
```

**⚠️ Note:** Mentor accounts start as `isActive: false` and need admin approval.

**Save the mentor `id` as `MENTOR_ID`**

---

#### Activate Mentor (Admin Action)

You can activate the mentor manually via database or create an admin endpoint. For testing, use Prisma Studio:

```bash
cd backend
npx prisma studio
```

Find the mentor user and set `isActive` to `true`.

Then login again:

**POST** `http://localhost:3000/api/auth/login`

```json
{
  "email": "mentor@test.com",
  "password": "Mentor123!"
}
```

**Save the new `accessToken` as `MENTOR_TOKEN`**

---

#### Register an Admin
**POST** `http://localhost:3000/api/auth/register`

```json
{
  "email": "admin@test.com",
  "password": "Admin123!",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN"
}
```

**Save the `accessToken` as `ADMIN_TOKEN`**

---

### Step 2: Test Authentication

#### Get User Profile
**GET** `http://localhost:3000/api/auth/profile`

**Headers:**
```
Authorization: Bearer STUDENT_TOKEN
```

**Expected Response (200):**
```json
{
  "id": "user-id",
  "email": "student@test.com",
  "firstName": "John",
  "lastName": "Student",
  "role": "STUDENT",
  "isActive": true
}
```

**✅ Test:** Try without token → Should get 401 Unauthorized

---

### Step 3: Create a Course (Mentor)

**POST** `http://localhost:3000/api/courses`

**Headers:**
```
Authorization: Bearer MENTOR_TOKEN
```

**Body:**
```json
{
  "title": "Introduction to TypeScript",
  "description": "Learn TypeScript from basics to advanced concepts"
}
```

**Expected Response (201):**
```json
{
  "id": "course-id",
  "title": "Introduction to TypeScript",
  "description": "Learn TypeScript from basics to advanced concepts",
  "mentorId": "mentor-id",
  "createdAt": "2025-12-21T00:00:00.000Z"
}
```

**Save the `id` as `COURSE_ID`**

**❌ Test:** Try with STUDENT_TOKEN → Should get 403 Forbidden

---

### Step 4: Add Chapters to Course (Mentor)

**POST** `http://localhost:3000/api/courses/COURSE_ID/chapters`

**Headers:**
```
Authorization: Bearer MENTOR_TOKEN
```

**Body:**
```json
{
  "title": "Chapter 1: TypeScript Basics",
  "description": "Understanding variables, types, and interfaces",
  "videoUrl": "https://example.com/videos/typescript-basics.mp4"
}
```

**Expected Response (201):**
```json
{
  "id": "chapter-id",
  "title": "Chapter 1: TypeScript Basics",
  "description": "Understanding variables, types, and interfaces",
  "videoUrl": "https://example.com/videos/typescript-basics.mp4",
  "courseId": "course-id",
  "sequenceOrder": 1,
  "createdAt": "2025-12-21T00:00:00.000Z"
}
```

**Save the `id` as `CHAPTER_1_ID`**

Add more chapters:

```json
{
  "title": "Chapter 2: Advanced Types",
  "description": "Generics, utility types, and type guards",
  "videoUrl": "https://example.com/videos/advanced-types.mp4"
}
```

**Save as `CHAPTER_2_ID`**

---

### Step 5: Assign Course to Student (Mentor)

**POST** `http://localhost:3000/api/courses/COURSE_ID/assign`

**Headers:**
```
Authorization: Bearer MENTOR_TOKEN
```

**Body:**
```json
{
  "studentIds": ["STUDENT_ID"]
}
```

**Expected Response (201):**
```json
[
  {
    "id": "assignment-id",
    "courseId": "course-id",
    "studentId": "student-id",
    "assignedAt": "2025-12-21T00:00:00.000Z",
    "student": {
      "id": "student-id",
      "email": "student@test.com",
      "firstName": "John",
      "lastName": "Student"
    }
  }
]
```

---

### Step 6: View Assigned Courses (Student)

**GET** `http://localhost:3000/api/courses/my`

**Headers:**
```
Authorization: Bearer STUDENT_TOKEN
```

**Expected Response (200):**
```json
[
  {
    "id": "course-id",
    "title": "Introduction to TypeScript",
    "description": "Learn TypeScript from basics to advanced concepts",
    "mentor": {
      "firstName": "Jane",
      "lastName": "Mentor"
    },
    "assignedAt": "2025-12-21T00:00:00.000Z"
  }
]
```

---

### Step 7: Get Course Chapters (Student)

**GET** `http://localhost:3000/api/courses/COURSE_ID/chapters`

**Headers:**
```
Authorization: Bearer STUDENT_TOKEN
```

**Expected Response (200):**
```json
[
  {
    "id": "chapter-1-id",
    "title": "Chapter 1: TypeScript Basics",
    "description": "Understanding variables, types, and interfaces",
    "videoUrl": "https://example.com/videos/typescript-basics.mp4",
    "sequenceOrder": 1,
    "isCompleted": false
  },
  {
    "id": "chapter-2-id",
    "title": "Chapter 2: Advanced Types",
    "description": "Generics, utility types, and type guards",
    "videoUrl": "https://example.com/videos/advanced-types.mp4",
    "sequenceOrder": 2,
    "isCompleted": false
  }
]
```

---

### Step 8: Complete Chapters (Student)

#### Complete Chapter 1
**POST** `http://localhost:3000/api/progress/CHAPTER_1_ID/complete`

**Headers:**
```
Authorization: Bearer STUDENT_TOKEN
```

**Expected Response (201):**
```json
{
  "progress": {
    "id": "progress-id",
    "studentId": "student-id",
    "chapterId": "chapter-1-id",
    "completedAt": "2025-12-21T00:00:00.000Z"
  },
  "completedChapters": 1,
  "totalChapters": 2,
  "isComplete": false
}
```

#### Complete Chapter 2
**POST** `http://localhost:3000/api/progress/CHAPTER_2_ID/complete`

**Headers:**
```
Authorization: Bearer STUDENT_TOKEN
```

**Expected Response (201):**
```json
{
  "progress": {
    "id": "progress-id-2",
    "studentId": "student-id",
    "chapterId": "chapter-2-id",
    "completedAt": "2025-12-21T00:00:00.000Z"
  },
  "completedChapters": 2,
  "totalChapters": 2,
  "isComplete": true
}
```

**❌ Test:** Try with MENTOR_TOKEN → Should get 403 Forbidden

---

### Step 9: Check Progress (Student)

#### View All Progress
**GET** `http://localhost:3000/api/progress/my`

**Headers:**
```
Authorization: Bearer STUDENT_TOKEN
```

**Expected Response (200):**
```json
[
  {
    "courseId": "course-id",
    "courseTitle": "Introduction to TypeScript",
    "completedChapters": 2,
    "totalChapters": 2,
    "completionPercentage": 100
  }
]
```

#### View Course-Specific Progress
**GET** `http://localhost:3000/api/progress/course/COURSE_ID`

**Headers:**
```
Authorization: Bearer STUDENT_TOKEN
```

**Expected Response (200):**
```json
{
  "courseId": "course-id",
  "courseTitle": "Introduction to TypeScript",
  "completedChapters": 2,
  "totalChapters": 2,
  "completionPercentage": 100,
  "chapters": [
    {
      "id": "chapter-1-id",
      "title": "Chapter 1: TypeScript Basics",
      "isCompleted": true,
      "completedAt": "2025-12-21T00:00:00.000Z"
    },
    {
      "id": "chapter-2-id",
      "title": "Chapter 2: Advanced Types",
      "isCompleted": true,
      "completedAt": "2025-12-21T00:00:00.000Z"
    }
  ]
}
```

---

### Step 10: Monitor Student Progress (Mentor)

**GET** `http://localhost:3000/api/progress/students?courseId=COURSE_ID`

**Headers:**
```
Authorization: Bearer MENTOR_TOKEN
```

**Expected Response (200):**
```json
[
  {
    "studentId": "student-id",
    "studentName": "John Student",
    "studentEmail": "student@test.com",
    "courseId": "course-id",
    "courseTitle": "Introduction to TypeScript",
    "completedChapters": 2,
    "totalChapters": 2,
    "completionPercentage": 100
  }
]
```

---

### Step 11: Generate Certificate (Student)

**POST** `http://localhost:3000/api/certificates/course/COURSE_ID`

**Headers:**
```
Authorization: Bearer STUDENT_TOKEN
```

**Expected Response (201):**
```json
{
  "id": "certificate-id",
  "courseId": "course-id",
  "studentId": "student-id",
  "issuedAt": "2025-12-21T00:00:00.000Z",
  "pdfUrl": "/certificates/certificate-id.pdf",
  "course": {
    "title": "Introduction to TypeScript"
  }
}
```

**❌ Test:** Try before completing all chapters → Should get 400 Bad Request

---

### Step 12: View Certificates (Student)

**GET** `http://localhost:3000/api/certificates/my-certificates`

**Headers:**
```
Authorization: Bearer STUDENT_TOKEN
```

**Expected Response (200):**
```json
[
  {
    "id": "certificate-id",
    "courseId": "course-id",
    "courseTitle": "Introduction to TypeScript",
    "issuedAt": "2025-12-21T00:00:00.000Z",
    "pdfUrl": "/certificates/certificate-id.pdf"
  }
]
```

---

### Step 13: Admin Access

**GET** `http://localhost:3000/api/courses/all`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response (200):**
```json
[
  {
    "id": "course-id",
    "title": "Introduction to TypeScript",
    "description": "Learn TypeScript from basics to advanced concepts",
    "mentor": {
      "firstName": "Jane",
      "lastName": "Mentor"
    },
    "studentsCount": 1,
    "chaptersCount": 2,
    "createdAt": "2025-12-21T00:00:00.000Z"
  }
]
```

**❌ Test:** Try with STUDENT_TOKEN or MENTOR_TOKEN → Should get 403 Forbidden

---

## 🧪 Additional Test Scenarios

### Error Handling Tests

1. **Invalid Email Format**
   ```json
   {
     "email": "not-an-email",
     "password": "password123"
   }
   ```
   Expected: `400 Bad Request`

2. **Short Password**
   ```json
   {
     "email": "test@example.com",
     "password": "123"
   }
   ```
   Expected: `400 Bad Request`

3. **Missing Token**
   Try any protected endpoint without `Authorization` header
   Expected: `401 Unauthorized`

4. **Invalid Token**
   ```
   Authorization: Bearer invalid-token-123
   ```
   Expected: `401 Unauthorized`

5. **Wrong Role**
   Try student creating a course
   Expected: `403 Forbidden`

---

## 📊 Success Criteria Checklist

- [ ] Student can register and login
- [ ] Mentor can register (needs approval) and login after activation
- [ ] Admin can register and login
- [ ] Mentor can create courses
- [ ] Mentor can add chapters to courses
- [ ] Mentor can assign courses to students
- [ ] Student can view assigned courses
- [ ] Student can view course chapters
- [ ] Student can complete chapters
- [ ] Student can view progress (overall and per-course)
- [ ] Mentor can view student progress
- [ ] Student can generate certificate after 100% completion
- [ ] Student can view all earned certificates
- [ ] Admin can view all courses
- [ ] Role-based access control works (403 for unauthorized actions)
- [ ] Authentication required (401 for missing/invalid tokens)

---

## 🎉 All Tests Complete!

If all scenarios pass, the application is working correctly! 🚀

---

*Last updated: December 21, 2025*
