# Online Learning Platform

A full-stack online learning platform built with the MERN stack. The application supports two types of users: students and instructors.

Students can browse courses, view course details, enroll in courses, manage their enrolled courses, and get course recommendations through an AI assistant.

Instructors can create and manage their courses and view the students enrolled in each course.

This project was developed as part of a Full Stack Developer assessment, with a focus on keeping the implementation simple, secure, and easy to understand.



> Replace the placeholder URLs above with the actual deployed URLs before submitting.

---

# Features

## Student Features

- Student registration and login
- JWT-based authentication
- Browse available courses
- View course details
- Enroll in courses
- Prevent duplicate enrollments
- View enrollment status
- View all enrolled courses
- Get AI-based course recommendations
- Logout

## Instructor Features

- Instructor registration and login
- Instructor dashboard
- Create courses
- View created courses
- Edit courses
- Delete courses
- View students enrolled in a course
- Logout

## Security Features

- Password hashing using bcrypt
- JWT authentication
- Role-based access control
- Protected API routes
- Course ownership validation
- Backend input validation
- Environment variables for sensitive information
- API keys are not exposed in the frontend
- Passwords are never returned in API responses

---

# Technology Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- REST API
- Mongoose

### Database

- MongoDB / MongoDB Atlas

### Authentication

- JSON Web Token (JWT)
- bcryptjs

### AI

- OpenAI GPT API

### Development and Testing

- Git
- GitHub
- Postman

---

# System Design & Architecture

The application follows a simple three-layer structure.

```text
                    ┌─────────────────────┐
                    │   React + Vite      │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                         HTTP / JSON
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Node.js + Express  │
                    │      REST API       │
                    └───────┬───────┬─────┘
                            │       │
                            │       │
                            ▼       ▼
                  ┌────────────┐  ┌─────────────┐
                  │  MongoDB   │  │ OpenAI GPT  │
                  │  Database  │  │     API     │
                  └────────────┘  └─────────────┘
```

### Frontend

The React frontend handles:

- User interface
- Login and registration
- Course browsing
- Course enrollment
- Instructor dashboard
- AI recommendation interface

Axios is used to communicate with the backend REST API.

### Backend

The Express backend handles:

- Authentication
- JWT verification
- Role-based authorization
- Course management
- Enrollment
- Instructor student information
- GPT API communication
- Input validation

### Database

MongoDB stores:

- Users
- Courses
- Enrollments

### AI

The GPT API is accessed from the backend. The frontend never communicates directly with the OpenAI API.

---

# Database Structure

The application uses three main MongoDB collections.

## 1. User

```text
User
├── _id: ObjectId
├── name: String
├── email: String (unique)
├── password: String (bcrypt hashed)
├── role: String ("student" | "instructor")
└── createdAt: Date
```

The `role` field determines which parts of the application the user can access.

---

## 2. Course

```text
Course
├── _id: ObjectId
├── title: String
├── description: String
├── content: String
├── instructor: ObjectId → User
├── createdAt: Date
└── updatedAt: Date
```

Each course belongs to an instructor.

---

## 3. Enrollment

```text
Enrollment
├── _id: ObjectId
├── student: ObjectId → User
├── course: ObjectId → Course
├── status: String
└── enrolledAt: Date
```

The student and course fields reference the corresponding documents.

A unique combination of student and course prevents the same student from enrolling in the same course more than once.

### Relationships

```text
User
 │
 ├───────────────┐
 │               │
 │ instructor    │ student
 ▼               ▼
Course        Enrollment
 │               │
 └───────────────┘
        course
```

---

# API Documentation

All protected endpoints require a JWT in the request header:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication APIs

### Register

```http
POST /api/auth/register
```

Access: **Public**

Example request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "student"
}
```

The `role` can be:

```text
student
instructor
```

---

### Login

```http
POST /api/auth/login
```

Access: **Public**

Example request:

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

Example response:

```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### Get Current User

```http
GET /api/auth/me
```

Access: **Authenticated users**

Returns the currently logged-in user's information.

---

# Course APIs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/courses` | Authenticated | View available courses |
| GET | `/api/courses/:id` | Authenticated | View course details |
| POST | `/api/courses` | Instructor | Create a course |
| PUT | `/api/courses/:id` | Instructor | Update a course |
| DELETE | `/api/courses/:id` | Instructor | Delete a course |
| GET | `/api/courses/:courseId/students` | Instructor | View enrolled students |

### Create Course

```http
POST /api/courses
```

Example request:

```json
{
  "title": "MERN Stack Development",
  "description": "Learn full-stack web development using the MERN stack.",
  "content": "MongoDB, Express.js, React.js and Node.js fundamentals."
}
```

The instructor is taken from the authenticated JWT instead of accepting an instructor ID from the frontend.

---

### Update Course

```http
PUT /api/courses/:id
```

Example request:

```json
{
  "title": "Advanced MERN Stack",
  "description": "Advanced concepts for MERN stack development.",
  "content": "Authentication, APIs, deployment and advanced React concepts."
}
```

Only the instructor who owns the course can update it.

---

### Delete Course

```http
DELETE /api/courses/:id
```

Only the instructor who owns the course can delete it.

---

### View Enrolled Students

```http
GET /api/courses/:courseId/students
```

Access: **Course owner / Instructor**

Returns information such as:

- Student name
- Email
- Enrollment status
- Enrollment date

---

# Enrollment APIs

### Enroll in a Course

```http
POST /api/enrollments
```

Access: **Student**

Example request:

```json
{
  "courseId": "COURSE_ID"
}
```

Example success response:

```json
{
  "message": "Successfully enrolled in the course"
}
```

If the student is already enrolled, the API returns an appropriate error instead of creating another enrollment.

---

### My Courses

```http
GET /api/enrollments/my-courses
```

Access: **Student**

Returns the courses that belong to the currently logged-in student's enrollments.

---

# AI Course Recommendation

### Get Recommendations

```http
POST /api/gpt/recommend
```

Access: **Student**

Example request:

```json
{
  "prompt": "I want to become a full stack developer. Which courses should I take?"
}
```

### How it works

```text
Student enters learning goal
          ↓
Frontend sends request
          ↓
Express backend receives request
          ↓
Backend gets available courses
          ↓
Course information + student prompt
          ↓
OpenAI GPT API
          ↓
Recommendations returned
          ↓
Frontend displays results
```

The backend provides the available courses to GPT so that recommendations are based on courses that actually exist on the platform.

The OpenAI API key is stored in the backend environment variables and is never exposed to the frontend.

---

# Authentication and RBAC

The application uses JWT authentication.

After login, the server generates a token containing the user's identity and role.

Protected requests use:

```text
Authorization: Bearer <TOKEN>
```

The authentication middleware verifies the token before allowing access to protected routes.

## Student permissions

Students can:

- View courses
- View course details
- Enroll in courses
- View their enrolled courses
- Use the AI recommendation feature

## Instructor permissions

Instructors can:

- Create courses
- Update their own courses
- Delete their own courses
- View students enrolled in their own courses

The backend checks permissions rather than relying only on frontend restrictions.

---

# Course Ownership

Course ownership is checked on the backend.

For example, when an instructor tries to update a course:

```text
Request
   ↓
Verify JWT
   ↓
Check instructor role
   ↓
Find course
   ↓
Check course.instructor == logged-in user
   ↓
Allow / Reject request
```

This prevents one instructor from modifying another instructor's course.

---

# HTTP Status Codes

The API uses standard HTTP status codes.

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Authentication required / invalid token |
| 403 | User does not have permission |
| 404 | Resource not found |
| 409 | Conflict, such as duplicate enrollment |
| 500 | Server error |

---

# Project Structure

```text
Online Learning Platform/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Course.js
│   │   │   └── Enrollment.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── courseController.js
│   │   │   ├── enrollmentController.js
│   │   │   └── gptController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   ├── enrollmentRoutes.js
│   │   │   └── gptRoutes.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

# Local Setup

## Prerequisites

Install:

- Node.js 18 or newer
- MongoDB or MongoDB Atlas
- Git
- An OpenAI API key for the AI feature

---

## 1. Clone the repository

```bash
git clone https://github.com/Nikshan0702/Online-Learning-Platform.git

cd "Online Learning Platform"
```

---

# 2. Backend Setup

Open a terminal and run:

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`.

### `backend/.env.example`

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

Replace the placeholder values in your local `.env` file.

Then start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5001
```

---

# 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file based on `.env.example`.

### `frontend/.env.example`

```env
VITE_API_URL=http://localhost:5001/api
```

Then start the frontend:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# Environment Variables

## Backend

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

## Frontend

```env
VITE_API_URL=http://localhost:5001/api
```

### Important

The actual `.env` files should not be committed to GitHub.

Only the `.env.example` files should be included in the repository.

---

# Running the Application

Once both servers are running:

1. Open `http://localhost:5173`
2. Register as a student or instructor.
3. Login with the created account.
4. Follow the appropriate dashboard.

### Student flow

```text
Register
   ↓
Login
   ↓
Browse Courses
   ↓
View Course
   ↓
Enroll
   ↓
My Courses
   ↓
AI Recommendations
```

### Instructor flow

```text
Register
   ↓
Login
   ↓
Instructor Dashboard
   ↓
Create Course
   ↓
Edit / Delete Course
   ↓
View Enrolled Students
```

---

# API Testing with Postman

The backend APIs can be tested independently using Postman.

A basic testing sequence is:

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Courses

```text
GET    /api/courses
GET    /api/courses/:id
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id
```

### Enrollment

```text
POST /api/enrollments
GET  /api/enrollments/my-courses
```

### Instructor

```text
GET /api/courses/:courseId/students
```

### AI

```text
POST /api/gpt/recommend
```

For protected requests, add:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

# Testing Scenarios

The main application flows were tested using both valid and invalid requests.

### Authentication

- Register a student
- Register an instructor
- Login with valid credentials
- Reject incorrect passwords
- Reject duplicate email addresses
- Reject missing authentication tokens

### Authorization

- Student cannot create a course
- Instructor can create a course
- Instructor can only update their own courses
- Instructor can only delete their own courses
- Instructor can only view students for their own courses

### Enrollment

- Student can enroll in a course
- Duplicate enrollment is prevented
- Student can view enrolled courses

### AI

- Student can submit a recommendation request
- Recommendation uses available platform courses
- Invalid or failed requests are handled appropriately

---

# Deployment

The application can be deployed as separate frontend and backend services.

```text
React + Vite
     │
     ▼
Frontend Hosting
     │
     ▼
Express REST API
     │
     ├──────────────► MongoDB Atlas
     │
     └──────────────► OpenAI API
```

For production deployment:

1. Deploy the backend.
2. Add the production MongoDB connection string.
3. Add the JWT secret.
4. Add the OpenAI API key.
5. Deploy the React frontend.
6. Set `VITE_API_URL` to the deployed backend API.
7. Verify the complete student and instructor flows using the public URL.

---

# What I Kept Simple

The project intentionally avoids unnecessary complexity.

There are no microservices, complicated state-management systems, or extra features outside the assessment requirements.

The main goal was to build a working application where the complete flow is easy to follow:

```text
React
  ↓
Express
  ↓
MongoDB
  ↓
OpenAI
```

This also makes the project easier to maintain and explain during an interview.

---

# Possible Future Improvements

If the platform were developed further, some possible additions would be:

- Course search and filtering
- Course categories
- Student progress tracking
- Course reviews and ratings
- Instructor profiles
- Admin dashboard
- Video-based course content
- Learning progress analytics
- More detailed AI learning paths

These features are outside the current assessment scope.

---

# Repository

**GitHub:**  
https://github.com/Nikshan0702/Online-Learning-Platform.git

**Live Frontend:**  
https://online-learning-platform-plum.vercel.app/

**Live Backend:**  
https://online-learning-platform-ox0b.onrender.com

---

