# Online Learning Platform with GPT Integration

A clean, production-ready Full Stack MERN (MongoDB, Express, React, Node.js) online education platform featuring Role-Based Access Control (RBAC) and AI-powered course recommendations.

---

## Project Overview

Online Learning Platform is designed to connect students with high-quality education and empower instructors to publish and manage courses. The platform features separate dashboards and permissions for Students and Instructors, secure JWT authentication with bcrypt password hashing, course enrollment tracking, and an AI Course Recommendation assistant that matches students' learning goals with courses available in the database.

---

## Features

### For Students
- **Account Registration & Login**: Secure role-based onboarding.
- **Browse Available Courses**: Explore all published courses with instructor information.
- **View Course Details**: Deep dive into full syllabus, curriculum modules, and overview.
- **Course Enrollment**: Single-click enrollment with duplicate prevention and active status tracking.
- **My Courses**: Personalized dashboard displaying all currently enrolled courses.
- **AI Course Assistant**: Input career goals (e.g., *"I want to become a software engineer"*) to receive curated recommendations based strictly on available platform courses.

### For Instructors
- **Account Registration & Login**: Dedicated instructor onboarding.
- **Instructor Dashboard**: Overview of all courses created by the logged-in instructor.
- **Create Course**: Publish courses with title, description, and detailed syllabus.
- **Edit & Update Course**: Modify course details with database-level ownership verification.
- **Delete Course**: Safely remove courses owned by the instructor.
- **Track Enrolled Students**: Dedicated table view of students enrolled in each course (`Name`, `Email`, `Status`, `Enrolled Date`).

---

## Technology Stack

- **Frontend**: React.js (v19) + Vite, React Router DOM (v7), Axios
- **Backend**: Node.js, Express.js (REST API)
- **Database**: MongoDB with Mongoose ODM
- **Authentication & Security**: JSON Web Tokens (JWT), bcryptjs password hashing, CORS, input sanitization
- **AI Integration**: OpenAI / GPT Chat Completions API with fallback matching

---

## System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   React + Vite Frontend                │
│   (AuthContext, React Router, Axios with Bearer JWT)   │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Express.js REST API                  │
│  ├── Auth Middleware (JWT Verification)                │
│  ├── Role Middleware (Student / Instructor RBAC)       │
│  ├── Controllers: Auth, Course, Enrollment, GPT        │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
              ▼                           ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│      MongoDB Database     │ │   OpenAI GPT-3.5 API     │
│  - Users                  │ │   (Course Recommendation │
│  - Courses                │ │    Assistant)            │
│  - Enrollments            │ └──────────────────────────┘
└───────────────────────────┘
```

---

## Database Structure

The database utilizes three clean, normalized MongoDB collections:

```text
User
 ├── _id: ObjectId
 ├── name: String
 ├── email: String (unique)
 ├── password: String (bcrypt hashed)
 ├── role: String ('student' | 'instructor')
 └── createdAt: Date

Course
 ├── _id: ObjectId
 ├── title: String
 ├── description: String
 ├── content: String
 ├── instructor: ObjectId → ref: User
 ├── createdAt: Date
 └── updatedAt: Date

Enrollment
 ├── _id: ObjectId
 ├── student: ObjectId → ref: User
 ├── course: ObjectId → ref: Course
 ├── status: String ('active')
 └── enrolledAt: Date
 (Compound unique index: { student: 1, course: 1 })
```

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user (`student` or `instructor`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT + user info |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user profile |

### Courses (`/api/courses`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses` | Authenticated | List all available courses (`?mine=true` for instructor's own) |
| `GET` | `/api/courses/:id` | Authenticated | Get single course details |
| `POST` | `/api/courses` | Instructor only | Create a new course (assigns logged-in instructor) |
| `PUT` | `/api/courses/:id` | Instructor only | Update course (verifies course ownership) |
| `DELETE` | `/api/courses/:id` | Instructor only | Delete course (verifies course ownership) |
| `GET` | `/api/courses/:courseId/students` | Instructor only | Get list of enrolled students for instructor's course |

### Enrollments (`/api/enrollments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/enrollments` | Student only | Enroll in a course (prevents duplicates) |
| `GET` | `/api/enrollments/my-courses` | Student only | Get all enrolled courses for the logged-in student |

### AI Assistant (`/api/gpt`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/gpt/recommend` | Student only | Get course recommendations based on prompt & DB courses |

---

## Authentication & Role-Based Access Control (RBAC)

1. **JWT Verification (`authMiddleware.js`)**:
   - Inspects `Authorization: Bearer <token>` header.
   - Decodes `userId` and `role` and attaches to `req.user`.
   - Returns `401 Unauthorized` for invalid or missing tokens.

2. **Role Authorization (`roleMiddleware.js`)**:
   - Compares `req.user.role` with allowed roles (`student`, `instructor`).
   - Returns `403 Forbidden` if user lacks required permission.

3. **Ownership Validation**:
   - Course modification (`PUT`, `DELETE`) and student list inspection (`GET /courses/:id/students`) verify `course.instructor.toString() === req.user.userId`.
   - Instructors cannot access or tamper with courses created by other instructors.

---

## GPT Integration

When a student asks for course recommendations:
1. Student enters a query (e.g., *"I want to learn web development"*).
2. Backend queries MongoDB for active courses on the platform.
3. Backend feeds the student's request together with the available courses to the GPT prompt.
4. GPT generates recommendations strictly limited to the platform's existing courses.
5. In development/offline environments without an OpenAI key, an intelligent keyword-scoring fallback ensures uninterrupted testing and flawless demonstration.

---

## Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd "Online Learning Platform"
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/online_learning_platform
JWT_SECRET=supersecret_jwt_key_learning_platform_2026
OPENAI_API_KEY=your_openai_api_key_here
```

Start the backend:
```bash
npm run dev
```
*Backend will be running on `http://localhost:5001`.*

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5001/api
```

Start the frontend:
```bash
npm run dev
```
*Frontend will be running on `http://localhost:5173`.*

---

## Running the Project

1. Open your browser and navigate to `http://localhost:5173`.
2. Register as a **Student** or **Instructor**.
3. Log in to access the respective dashboard:
   - **Instructor**: Create a new course, view your courses, edit, delete, and inspect enrolled students.
   - **Student**: Browse available courses, view course details, enroll, check "My Courses", and test the "AI Assistant".

---

## Postman API Testing Collection

To test APIs directly via Postman or cURL:
1. `POST http://localhost:5001/api/auth/register` (Register)
2. `POST http://localhost:5001/api/auth/login` (Login -> copy returned token)
3. Set `Authorization: Bearer <TOKEN>` header for protected endpoints:
   - `GET http://localhost:5001/api/courses`
   - `POST http://localhost:5001/api/courses`
   - `POST http://localhost:5001/api/enrollments`
   - `GET http://localhost:5001/api/enrollments/my-courses`
   - `GET http://localhost:5001/api/courses/:courseId/students`
   - `POST http://localhost:5001/api/gpt/recommend`

---

## License
MIT
# Online-Learning-Platform
