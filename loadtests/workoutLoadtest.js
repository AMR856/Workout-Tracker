import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  scenarios: {
    ramping_load: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 50 },
        { duration: "1m", target: 100 },
        { duration: "1m", target: 200 },
        { duration: "1m", target: 300 },
        { duration: "30s", target: 0 },
      ],
    },
    spike_test: {
      executor: "constant-arrival-rate",
      rate: 200,
      timeUnit: "1s",
      duration: "1m",
      preAllocatedVUs: 100,
      maxVUs: 400,
    },
  },

  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.05"], 
  },
};

const BASE_URL = "http://localhost:5000";

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
    "register ok": (r) => r.status === 201 || r.status === 409,
  });

  let loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify(user), {
    headers: { "Content-Type": "application/json" },
    tags: { name: "login" },
  });

  check(loginRes, {
    "login success": (r) => r.status === 200,
    "token exists": (r) => r.json("data.token") !== undefined,
  });

  const token = loginRes.json("data.token");

  if (!token) {
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
        exerciseId: "ae2bd07c-9acf-4a74-8c9a-23c5daa3fed4",
        sets: 4,
        reps: 12,
        weight: 60,
      },
    ],
  });

  let batchRes = http.batch([
    ["POST", `${BASE_URL}/workouts`, workoutPayload, { headers, tags: { name: "create" } }],
    ["POST", `${BASE_URL}/workouts`, workoutPayload, { headers, tags: { name: "create" } }],
    ["POST", `${BASE_URL}/workouts`, workoutPayload, { headers, tags: { name: "create" } }],
  ]);

  batchRes.forEach((res) => {
    check(res, { "create workout 201": (r) => r.status === 201 });
  });

  const workoutId = batchRes[0].json("data.id");

  if (!workoutId) return;

  http.batch([
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

  http.batch([
    ["GET", `${BASE_URL}/workouts/${workoutId}`, null, { headers, tags: { name: "getById" } }],
    ["GET", `${BASE_URL}/workouts`, null, { headers, tags: { name: "list" } }],
    ["GET", `${BASE_URL}/workouts`, null, { headers, tags: { name: "list" } }],
  ]);

  let delRes = http.del(`${BASE_URL}/workouts/${workoutId}`, null, {
    headers,
    tags: { name: "delete" },
  });

  check(delRes, {
    "delete 204": (r) => r.status === 204,
  });

  sleep(Math.random() * 2); // 🔥 more realistic user behavior
}