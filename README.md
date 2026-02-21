# Workout Tracker API

**Workout Tracker** is a scalable backend system for tracking workouts, exercises, and user progress.  
It supports authentication, workout management, scheduling, and reporting, with a focus on **performance, scalability, and reliability**.

Built using **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**, with **JWT-based authentication**.

---

## ✨ Features

- 🔐 **User Authentication**
  - Register, login, and profile endpoints
  - Secure JWT-based authorization

- 🏋️ **Workout Management**
  - Create, update, delete workouts
  - Attach multiple exercises to each workout

- 📅 **Workout Scheduling**
  - Schedule workouts for specific dates

- 📝 **Workout Notes**
  - Add and update notes per workout

- 📊 **Reports**
  - Generate reports for workout history and progress

- ✅ **Validation**
  - Request validation using **Zod**

- 📄 **API Documentation**
  - Swagger / OpenAPI support

- ⚡ **Performance & Scalability**
  - Load tested with **k6**
  - Monitored using **Prometheus & Grafana**
  - Scaled using **PM2 cluster mode**

---

## 🧱 Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Validation:** Zod
- **Testing:** Jest, Supertest
- **Docs:** Swagger (OpenAPI)
- **Performance:** k6, Prometheus, Grafana
- **Process Manager:** PM2

---

## 📂 Project Structure

```

.
├── config
│   └── swagger.ts
├── index.ts
├── middlewares
│   ├── auth.ts
│   └── workoutOwnership.ts
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
│   └── exercise.seeder.ts
├── types
│   ├── customError.ts
│   └── express.d.ts
└── utils
├── bcrypt.ts
├── errorHandler.ts
└── jwt.ts

````

---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL
- npm or yarn

---

### Installation

```bash
git clone <repo_url>
cd workout-tracker
npm install
````

---

## 🔐 Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## 🗄️ Database Setup

### Run migrations

```bash
npx prisma migrate dev --name init
```

### Generate client

```bash
npx prisma generate
```

### Seed data

```bash
npx ts-node seeders/exercise.seeder.ts
```

---

## ▶️ Running the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

Server runs at:

```
http://localhost:5000
```

---

## 📄 API Documentation

Swagger UI:

```
http://localhost:5000/api-docs
```

Supports **Bearer JWT authentication**.

---

## 🔑 Authentication

| Endpoint         | Method | Description   |
| ---------------- | ------ | ------------- |
| `/auth/register` | POST   | Register user |
| `/auth/login`    | POST   | Login         |
| `/auth/profile`  | GET    | Get profile   |

---

## 🏋️ Workouts

| Endpoint                 | Method | Description    |
| ------------------------ | ------ | -------------- |
| `/workouts`              | POST   | Create workout |
| `/workouts`              | GET    | List workouts  |
| `/workouts/:id`          | GET    | Get workout    |
| `/workouts/:id`          | PATCH  | Update workout |
| `/workouts/:id`          | DELETE | Delete workout |
| `/workouts/:id/notes`    | PATCH  | Add notes      |
| `/workouts/:id/schedule` | PATCH  | Schedule       |
| `/workouts/reports`      | GET    | Reports        |

> All routes require JWT authentication and ownership validation.

---

## 🧪 Testing

Run tests:

```bash
npm test
```

* Unit & integration tests using **Jest** and **Supertest**
* Achieved **81% test coverage**

---

## ⚡ Performance & Load Testing

Load testing was performed using **k6**:

* Simulated up to **500 concurrent users**
* Achieved ~**500 requests/sec**
* Error rate < **0.05%**
* p95 latency: **~1.3–1.45s under peak load**

Example:

```bash
k6 run loadtests/userLoadtest.js
```

---

## 📊 Monitoring

* **Prometheus** for metrics collection
* **Grafana** for visualization dashboards

Metrics exposed at:

```
/metrics
```

---

## 🚀 Scaling

Application scaled using **PM2 cluster mode**:

```bash
pm2 start dist/app.js -i max
```

* Utilizes all CPU cores
* Improves throughput and concurrency handling

---

## 📌 Exercises

Seeded exercises include:

* Categories: `CARDIO`, `STRENGTH`, `FLEXIBILITY`
* Muscle groups: `CHEST`, `BACK`, `LEGS`, `SHOULDERS`, `ARMS`, `CORE`, `FULL_BODY`

---

## 🔗 Project Reference

Solution inspired by:

[https://roadmap.sh/projects/fitness-workout-tracker](https://roadmap.sh/projects/fitness-workout-tracker)
