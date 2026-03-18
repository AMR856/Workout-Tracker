import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "30s", target: 50 },
    { duration: "30s", target: 100 },
    { duration: "10s", target: 0 },
  ],
  
  thresholds: {
    http_req_duration: ["p(95)<2000"],
    http_req_failed: ["rate<0.1"],
    checks: ["rate>0.85"],
  },
};

const BASE_URL = "https://workout-tracker-app-617bd3c5a4b7.herokuapp.com";

function generateUser() {
  const id = Math.floor(Math.random() * 1e9);
  return {
    email: `user${id}@test.com`,
    password: "StrongP@ss1",
    username: `user${id}`,
  };
}

export default function () {
  const user = generateUser();

  let registerRes = http.post(`${BASE_URL}/auth/register`, JSON.stringify(user), {
    headers: { "Content-Type": "application/json" },
    tags: { name: "register" },
  });

  check(registerRes, {
    "register 201 or 409": (r) => r.status === 201 || r.status === 409,
  });

  let loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify(user), {
    headers: { "Content-Type": "application/json" },
    tags: { name: "login" },
  });

  check(loginRes, {
    "login status 200": (r) => r.status === 200,
    "token exists": (r) => {
      try {
        return r.json("data.token") !== undefined && r.json("data.token") !== null;
      } catch {
        return false;
      }
    },
  });

  const token = loginRes.json("data.token");

  if (!token) {
    console.error(`Login failed for user ${user.email}. Response: ${loginRes.status}`);
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const workoutPayload = JSON.stringify({
    title: "Heavy Load Workout",
    notes: "Stress testing",
    exercises: [
      {
        exerciseId: "664d1885-7e50-4b73-a4c2-9c3f4bfcfbe6",
        sets: 4,
        reps: 12,
        weight: 60,
      },
    ],
  });

  let createBatch = http.batch([
    ["POST", `${BASE_URL}/workouts`, workoutPayload, { headers, tags: { name: "create" } }],
    ["POST", `${BASE_URL}/workouts`, workoutPayload, { headers, tags: { name: "create" } }],
    ["POST", `${BASE_URL}/workouts`, workoutPayload, { headers, tags: { name: "create" } }],
  ]);

  createBatch.forEach((res, idx) => {
    check(res, {
      "create workout 201": (r) => r.status === 201,
    });
  });

  let workoutId;
  try {
    workoutId = createBatch[0].json("data.id");
  } catch (e) {
    console.error(`Failed to extract workout ID from response: ${createBatch[0].body}`);
    return;
  }

  if (!workoutId) {
    console.error("Workout ID is null/undefined. Cannot continue.");
    return;
  }

  let updateBatch = http.batch([
    [
      "PATCH",
      `${BASE_URL}/workouts/${workoutId}`,
      JSON.stringify({ title: "Updated Heavy Workout" }),
      { headers, tags: { name: "update" } },
    ],
    [
      "PATCH",
      `${BASE_URL}/workouts/${workoutId}/schedule`,
      JSON.stringify({
        scheduledAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      }),
      { headers, tags: { name: "schedule" } },
    ],
    [
      "PATCH",
      `${BASE_URL}/workouts/${workoutId}/notes`,
      JSON.stringify({ notes: "Heavy load notes" }),
      { headers, tags: { name: "notes" } },
    ],
  ]);

  updateBatch.forEach((res) => {
    check(res, {
      "update/schedule/notes 200": (r) => r.status === 200,
    });
  });

  let readBatch = http.batch([
    ["GET", `${BASE_URL}/workouts/${workoutId}`, null, { headers, tags: { name: "getById" } }],
    ["GET", `${BASE_URL}/workouts`, null, { headers, tags: { name: "list" } }],
    ["GET", `${BASE_URL}/workouts`, null, { headers, tags: { name: "list" } }],
  ]);

  readBatch.forEach((res) => {
    check(res, {
      "read 200": (r) => r.status === 200,
    });
  });

  let delRes = http.del(`${BASE_URL}/workouts/${workoutId}`, null, {
    headers,
    tags: { name: "delete" },
  });

  check(delRes, {
    "delete 200 or 204": (r) => r.status === 200 || r.status === 204,
  });

  sleep(Math.random() * 2);
}