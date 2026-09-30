# Online Learning Platform

A simple online learning platform built as a Full Stack MERN application. The platform has separate experiences for students and instructors, with JWT authentication, course management, course enrollment, and an AI-based course recommendation feature.

I built this project as part of a Full Stack Developer assessment. The main focus was to keep the application straightforward while covering the complete flow from the frontend to the backend and database.

---

## What the platform does

There are two types of users:

- **Student** – browse courses, view course details, enroll in courses, view enrolled courses, and get AI-based course recommendations.
- **Instructor** – create and manage courses and view the students enrolled in their courses.

The application also includes a small AI assistant. A student can describe what they want to learn, and the system uses the available courses in the database to generate relevant recommendations.

---

## Main Features

### Student

- Create a student account
- Login securely
- Browse available courses
- View individual course details
- Enroll in a course
- See a successful enrollment message
- View enrolled courses and their status
- Ask the AI assistant for course recommendations
- Logout

### Instructor

- Create an instructor account
- Login securely
- Access an instructor dashboard
- Create new courses
- View courses created by the instructor
- Edit course details
- Delete courses
- View students enrolled in each course
- Logout

### Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected backend routes
- Course ownership checks
- Backend input validation
- API keys stored in environment variables
- Passwords are never returned through the API

---

## Technology Used

### Frontend

- React.js
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- REST APIs
- Mongoose

### Database

- MongoDB

### Authentication

- JSON Web Token (JWT)
- bcryptjs

### AI

- OpenAI / GPT API

### Development

- Git
- GitHub
- Postman

The project uses React + Vite on the frontend, Express and Node.js for the API, and MongoDB with Mongoose for data storage.

---

# How the application works

The basic flow is:

```text
Student / Instructor
        |
        v
React Frontend
        |
        | HTTP / JSON
        v
Express REST API
        |
        +------------------+
        |                  |
        v                  v
    MongoDB             GPT API
        |
        v
 Users / Courses / Enrollments
```

The frontend communicates with the Express API using Axios.

The backend handles authentication, authorization, course operations, enrollment, and communication with the GPT API.

MongoDB stores users, courses, and enrollment information.

---

# Authentication and Authorization

Authentication is handled using JWT.

When a user logs in:

```text
Email + Password
       |
       v
Check user
       |
       v
Compare password using bcrypt
       |
       v
Create JWT
       |
       v
Return token
```

The token contains the user's ID and role.

Protected requests send the token using:

```text
Authorization: Bearer <token>
```

The backend verifies the token before allowing access to protected resources.

There are two roles:

```text
student
instructor
```

The backend checks the user's role before allowing access to role-specific operations.

For example:

- Students can enroll in courses.
- Instructors can create, edit, and delete courses.
- Students cannot create or modify courses.
- Instructors cannot use student-only enrollment APIs.

Course ownership is also checked. An instructor can only edit, delete, or view enrolled students for courses that belong to that instructor.

---

# Database Structure

The application uses three main MongoDB collections.

## User

```text
User
├── _id
├── name
├── email
├── password
├── role
└── createdAt
```

`role` can be:

```text
student
instructor
```

Passwords are stored as bcrypt hashes rather than plain text.

---

## Course

```text
Course
├── _id
├── title
├── description
├── content
├── instructor
├── createdAt
└── updatedAt
```

The `instructor` field references the user who created the course.

---

## Enrollment

```text
Enrollment
├── _id
├── student
├── course
├── status
└── enrolledAt
```

The `student` field references the student.

The `course` field references the enrolled course.

A student cannot enroll in the same course more than once.

---

# API Endpoints

The backend is organized as REST APIs.

## Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a student or instructor account |
| POST | `/api/auth/login` | Public | Login and receive a JWT |
| GET | `/api/auth/me` | Authenticated | Get the current user's information |

---

## Courses

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/courses` | Authenticated | View available courses |
| GET | `/api/courses/:id` | Authenticated | View course details |
| POST | `/api/courses` | Instructor | Create a course |
| PUT | `/api/courses/:id` | Instructor | Update a course |
| DELETE | `/api/courses/:id` | Instructor | Delete a course |
| GET | `/api/courses/:courseId/students` | Instructor | View students enrolled in a course |

The instructor ownership check is applied to course update, delete, and enrolled-student requests.

---

## Enrollments

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/enrollments` | Student | Enroll in a course |
| GET | `/api/enrollments/my-courses` | Student | View enrolled courses |

Duplicate enrollments are prevented.

---

## AI Course Recommendations

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/gpt/recommend` | Student | Get course recommendations |

The student's prompt is sent to the backend. The backend first gets the available courses from MongoDB and then sends the course information together with the student's request to GPT.

This keeps the recommendations connected to the courses that actually exist on the platform.

For example:

```text
I want to become a software engineer.
What courses should I follow?
```

The system can recommend relevant courses such as JavaScript, React, Node.js, or other courses that are actually available in the database.

---

# GPT API Usage

The GPT API key is kept in the backend environment variables.

It is not included in the React application.

Example:

```env
OPENAI_API_KEY=your_api_key_here
```

The assessment provides a limited number of GPT API requests, so the implementation avoids unnecessary API calls and does not call the API inside loops.

The API key should never be committed to GitHub.

---

# Project Structure

The project is divided into frontend and backend applications.

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
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# Running the Project Locally

## Requirements

Before starting, make sure you have:

- Node.js 18 or newer
- MongoDB or a MongoDB Atlas database
- Git
- An OpenAI API key for the AI recommendation feature

---

## 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>

cd "Online Learning Platform"
```

---

## 2. Start the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```env
PORT=5001

MONGO_URI=mongodb://127.0.0.1:27017/online_learning_platform

JWT_SECRET=your_jwt_secret

OPENAI_API_KEY=your_openai_api_key
```

Then start the backend:

```bash
npm run dev
```

The API should be available at:

```text
http://localhost:5001
```

---

## 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5001/api
```

Then run:

```bash
npm run dev
```

The frontend should normally be available at:

```text
http://localhost:5173
```

---

# Using the Application

### Student flow

A student can:

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
AI Course Recommendations
```

### Instructor flow

An instructor can:

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

This covers the student and instructor workflows required by the assessment.

---

# Testing the API

The backend APIs can be tested using Postman.

A basic testing flow is:

### 1. Register

```http
POST /api/auth/register
```

### 2. Login

```http
POST /api/auth/login
```

Copy the JWT returned by the login request.

### 3. Add the token

For protected requests:

```text
Authorization: Bearer <TOKEN>
```

### 4. Test course APIs

```http
GET    /api/courses
GET    /api/courses/:id
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id
```

### 5. Test enrollment

```http
POST /api/enrollments
GET  /api/enrollments/my-courses
```

### 6. Test enrolled students

```http
GET /api/courses/:courseId/students
```

### 7. Test AI recommendations

```http
POST /api/gpt/recommend
```

I also test invalid cases such as incorrect login details, missing JWTs, unauthorized roles, duplicate enrollments, invalid course IDs, and attempts to modify another instructor's course.

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

Do not commit either `.env` file to GitHub.

---

# Deployment

The application is designed to run as two deployed parts:

```text
React Frontend
       |
       v
Cloud Hosting
       |
       v
Express Backend
       |
       +---------> MongoDB Atlas
       |
       +---------> OpenAI API
```

After deployment, the frontend's API URL needs to point to the deployed backend instead of the local `localhost` URL.

Make sure the production environment contains the required:

- MongoDB connection string
- JWT secret
- OpenAI API key
- Frontend API URL

The assessment requires the application to be accessible through a public URL.

---

# Git and Version Control

Git is used to keep track of the project changes.

Before pushing the project, make sure sensitive files are excluded:

```text
node_modules/
.env
dist/
```

The GitHub repository should contain the source code and documentation, but not API keys or other secrets.

---

# What I focused on

For this project, I focused mainly on getting the backend flow right rather than adding unnecessary features.

The important parts were:

- Designing a simple MongoDB structure
- Building REST APIs with Express
- Handling authentication with JWT
- Hashing passwords with bcrypt
- Separating student and instructor permissions
- Making sure instructors can only manage their own courses
- Preventing duplicate enrollments
- Connecting the frontend to the backend
- Connecting GPT through the backend
- Keeping the project easy to understand and maintain

The assessment specifically identifies the backend as the most important part of the implementation, while simple styling is sufficient for the required UI.

---

# Future Improvements

If this were developed beyond the assessment, some useful additions could be:

- Course search and filtering
- Course categories
- Progress tracking
- Course reviews and ratings
- Instructor profiles
- Admin dashboard
- More detailed AI learning paths
- Course content such as videos and documents
- Better analytics for instructors

These are intentionally outside the current scope so that the core requirements remain simple and reliable.

---

## Final Project

**GitHub:** `<YOUR_GITHUB_REPOSITORY_URL>`

**Live Application:** `<YOUR_DEPLOYED_FRONTEND_URL>`

**Backend API:** `<YOUR_DEPLOYED_BACKEND_URL>`

---

## License

This project was created for a Full Stack Developer assessment.