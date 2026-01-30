# Workout Tracker API

**Workout Tracker** is a backend system for tracking workouts and progress. It allows users to sign up, log in, create workout plans, schedule workouts, and generate reports on past workouts.

This API is built with **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**, and uses **JWT** for secure authentication.

---


## Features

* **User Authentication**: Sign up, log in, view profile
* **JWT-based Authentication** for securing routes
* **Workout Management**: CRUD operations for workouts
* **Exercise Management**: Include multiple exercises per workout
* **Workout Scheduling**: Schedule workouts for specific dates/times
* **Reports**: Generate reports on past workouts and progress
* **Validation**: Input validation using **Zod**
* **Swagger/OpenAPI Documentation**

---

## Tech Stack

* **Node.js** & **Express.js**
* **TypeScript**
* **Prisma ORM**
* **PostgreSQL**
* **JWT** authentication
* **Zod** validation
* **Swagger** for API docs

---

## Project Structure

```
.
├── config
│   └── swagger.ts             # Swagger/OpenAPI configuration
├── index.ts                   # Entry point
├── middlewares
│   ├── auth.ts                # JWT authentication middleware
│   └── workoutOwnership.ts    # Workout ownership verification
├── modules
│   ├── exercises
│   │   └── exercise.model.ts
│   ├── users
│   │   ├── user.controller.ts
│   │   ├── user.model.ts
│   │   ├── user.route.ts
│   │   ├── user.service.ts
│   │   └── user.validation.ts
│   └── workouts
│       ├── workout.controller.ts
│       ├── workout.model.ts
│       ├── workout.route.ts
│       ├── workout.service.ts
│       └── workout.validation.ts
├── seeders
│   └── exercise.seeder.ts      # Seed initial exercises
├── types
│   ├── customError.ts
│   └── express.d.ts
└── utils
    ├── bcrypt.ts
    ├── errorHandler.ts
    └── jwt.ts
```

---

## Getting Started

### Prerequisites

* Node.js >= 18
* PostgreSQL
* npm or yarn

### Installation

```bash
git clone <repo_url>
cd workout-tracker
npm install
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## Database Setup

### Prisma Migrations

```bash
npx prisma migrate dev --name init
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Seed Initial Data

```bash
ts-node seeders/exercise.seeder.ts
```

---

## Running the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

Server runs at: `http://localhost:5000`

---

## API Documentation

Swagger UI is available at:

```
http://localhost:5000/api-docs
```

Supports **Bearer JWT authentication** for protected endpoints.

---

## Authentication

* **Register**: `POST /auth/register`
* **Login**: `POST /auth/login`
* **Profile**: `GET /auth/profile` (protected)

---

## Workout Endpoints

* **Create Workout**: `POST /workouts`
* **Update Workout**: `PATCH /workouts/:workoutId`
* **Delete Workout**: `DELETE /workouts/:workoutId`
* **Add Notes**: `PATCH /workouts/:workoutId/notes`
* **Schedule Workout**: `PATCH /workouts/:workoutId/schedule`
* **List Workouts**: `GET /workouts`
* **Get Workout by ID**: `GET /workouts/:workoutId`
* **Generate Reports**: `GET /workouts/reports`

*All workout routes are protected using JWT and require workout ownership verification.*

---

## Exercises

* **Seeded Exercise Data**: Each exercise includes `name`, `description`, `category` (CARDIO, STRENGTH, FLEXIBILITY), and `muscleGroup` (CHEST, BACK, LEGS, SHOULDERS, ARMS, CORE, FULL_BODY)

---

## Validation

* Input validation is handled using **Zod**
* Ensures correct types, UUIDs, number ranges, and required fields

Solution for Workout Tracker Project https://roadmap.sh/projects/fitness-workout-tracker