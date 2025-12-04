# Student Training Point Management System API

This is the backend API for the Student Training Point Management System, built with Express and Prisma.

## Base URL

The API is accessible at: `http://localhost:5001/api`

## Endpoints

### Authentication (`/api/auth`)

*   **POST** `/login`: Login a user.
*   **POST** `/register`: Register a new user.

### Users (`/api/users`)

*   **GET** `/students`: Get a list of all students.
*   **POST** `/students`: Create a new student.
*   **PUT** `/students/:id`: Update a student's information.
*   **DELETE** `/students/:id`: Delete a student.

### Classes (`/api/classes`)

*   **GET** `/`: Get a list of all classes.
*   **POST** `/`: Create a new class.
*   **DELETE** `/:id`: Delete a class.

### Semesters (`/api/semesters`)

*   **GET** `/`: Get a list of all semesters.
*   **POST** `/`: Create a new semester.
*   **PUT** `/:id/current`: Set a semester as the current semester.

### Activities (`/api/activities`)

*   **GET** `/`: Get a list of all activities.
*   **POST** `/`: Create a new activity.

### Participations (`/api/participations`)

*   **POST** `/register`: Register a student for an activity.
*   **GET** `/student/:studentId`: Get a list of activities a student has participated in.
*   **PUT** `/:id/status`: Update the status of a participation (e.g., approve/reject).

### Scores (`/api/scores`)

*   **POST** `/calculate`: Calculate training points for a student.
*   **GET** `/`: Get a student's score (likely requires query parameters or body, check implementation if needed).

## Data Models

Key data models used in the API:

*   **TaiKhoan (Account)**: Stores user credentials and role (ADMIN, STUDENT).
*   **SinhVien (Student)**: Stores student details, linked to an account and a class.
*   **Lop (Class)**: Represents a class of students.
*   **HocKy (Semester)**: Represents a semester.
*   **HoatDong (Activity)**: Represents an activity that students can participate in to earn points.
*   **ThamGia (Participation)**: Records a student's participation in an activity.
*   **DiemRenLuyen (Training Point)**: Stores the calculated training score for a student in a semester.

## Setup

1.  Install dependencies: `npm install`
2.  Set up environment variables in `.env` (DATABASE_URL, etc.).
3.  Run migrations: `npx prisma migrate dev`
4.  Seed the database: `npm run prisma:seed`
5.  Start the server: `npm run dev`
