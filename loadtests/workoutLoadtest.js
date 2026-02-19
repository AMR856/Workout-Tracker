import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "10s", target: 5 },   // ramp up to 5 VUs
    { duration: "30s", target: 10 },  // stay at 10 VUs
    { duration: "10s", target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests should be below 500ms
  },
};

const BASE_URL = "http://localhost:5000";
const USER = {
  email: "loadtest@example.com",
  password: "StrongP@ss1",
};

export default function () {
  let registerRes = http.post(`${BASE_URL}/auth/register`, JSON.stringify(USER), {
    headers: { "Content-Type": "application/json" },
  });
  check(registerRes, {
    "register status 201 or 400": (r) => r.status === 201 || r.status === 400,
  });

  let loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify(USER), {
    headers: { "Content-Type": "application/json" },
  });
  check(loginRes, { "login status 200": (r) => r.status === 200 });

  const token = loginRes.json("data.token");

  const workoutPayload = {
    title: "Load Test Workout",
    notes: "Testing high load",
    exercises: [
      { exerciseId: "ae2bd07c-9acf-4a74-8c9a-23c5daa3fed4", sets: 4, reps: 10, weight: 50 },
    ],
  };

  let createRes = http.post(`${BASE_URL}/workouts`, JSON.stringify(workoutPayload), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  check(createRes, { "create workout status 201": (r) => r.status === 201 });

  const workoutId = createRes.json("data.id");

  const updatePayload = { title: "Updated Load Test Workout", notes: "Updated notes" };
  let updateRes = http.patch(`${BASE_URL}/workouts/${workoutId}`, JSON.stringify(updatePayload), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  check(updateRes, { "update workout status 200": (r) => r.status === 200 });

  const schedulePayload = { scheduledAt: new Date(Date.now() + 3600 * 1000).toISOString() };
  let scheduleRes = http.patch(
    `${BASE_URL}/workouts/${workoutId}/schedule`,
    JSON.stringify(schedulePayload),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  check(scheduleRes, { "schedule workout status 200": (r) => r.status === 200 });

  const notesPayload = { notes: "Adding notes during load test" };
  let notesRes = http.patch(`${BASE_URL}/workouts/${workoutId}/notes`, JSON.stringify(notesPayload), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  check(notesRes, { "add notes status 200": (r) => r.status === 200 });

  let getRes = http.get(`${BASE_URL}/workouts/${workoutId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  check(getRes, { "get workout status 200": (r) => r.status === 200 });

  let listRes = http.get(`${BASE_URL}/workouts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  check(listRes, { "list workouts status 200": (r) => r.status === 200 });

  let deleteRes = http.del(`${BASE_URL}/workouts/${workoutId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  check(deleteRes, { "delete workout status 204": (r) => r.status === 204 });

  sleep(1); 
}
