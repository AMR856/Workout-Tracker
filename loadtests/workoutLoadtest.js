import http from "k6/http";
import { check, sleep } from "k6";

// # Local (dev)
// k6 run -e IS_DEV=true loadtests/workoutLoadtest.js

// # Production
// k6 run -e IS_DEV=false loadtests/workoutLoadtest.js

export let options = {
  stages: [
    { duration: "15s", target: 5  },  // warm up gently
    { duration: "30s", target: 20 },  // ramp to realistic load
    { duration: "30s", target: 30 },  // peak — free Supabase sweet spot
    { duration: "15s", target: 0  },  // ramp down
  ],

  thresholds: {
    http_req_duration: ["p(95)<3000"], // 3s is realistic for free tier at 30 VUs
    http_req_failed:   ["rate<0.05"],  // <5% errors
    checks:            ["rate>0.90"],  // 90% checks pass
  },
};

const BASE_URL =
  __ENV.IS_DEV === "true"
    ? "http://localhost:5001"
    : "https://workout-tracker-app-617bd3c5a4b7.herokuapp.com";

export function setup() {
  const res = http.get(`${BASE_URL}/exercises`);
  if (res.status !== 200) {
    throw new Error(`Failed to fetch exercises: ${res.status}`);
  }
  return res.json("data");
}

function generateUser() {
  const id = Math.floor(Math.random() * 1e9);
  return {
    email: `user${id}@test.com`,
    password: "StrongP@ss1",
    username: `user${id}`,
  };
}

export default function (exercises) {
  const user = generateUser();

  // --- Register ---
  let registerRes = http.post(
    `${BASE_URL}/auth/register`,
    JSON.stringify(user),
    {
      headers: { "Content-Type": "application/json" },
      tags: { name: "register" },
    }
  );
  check(registerRes, {
    "register 201 or 409": (r) => r.status === 201 || r.status === 409,
  });

  sleep(0.5); // give the DB a breath between register and login

  // --- Login ---
  let loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify(user), {
    headers: { "Content-Type": "application/json" },
    tags: { name: "login" },
  });
  check(loginRes, {
    "login status 200": (r) => r.status === 200,
    "token exists": (r) => {
      try {
        return !!r.json("data.token");
      } catch {
        return false;
      }
    },
  });

  const token = loginRes.json("data.token");
  if (!token) {
    console.error(`Login failed for ${user.email}. Status: ${loginRes.status}`);
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const randomExercise =
    exercises[Math.floor(Math.random() * exercises.length)];

  const workoutPayload = JSON.stringify({
    title: "Heavy Load Workout",
    notes: "Stress testing",
    exercises: [
      {
        exerciseId: randomExercise.id,
        sets: 4,
        reps: 12,
        weight: 60,
      },
    ],
  });

  // --- Create (single, not batch) ---
  // Batching 3 POSTs per VU at 100 VUs = 300 simultaneous writes — too heavy for free tier
  let createRes = http.post(`${BASE_URL}/workouts`, workoutPayload, {
    headers,
    tags: { name: "create" },
  });
  check(createRes, {
    "create workout 201": (r) => r.status === 201,
  });

  let workoutId;
  try {
    workoutId = createRes.json("data.id");
  } catch (e) {
    console.error(`Failed to extract workout ID: ${createRes.body}`);
    return;
  }
  if (!workoutId) {
    console.error("Workout ID is null/undefined. Cannot continue.");
    return;
  }

  sleep(0.3);

  // --- Update (sequential, not batch) ---
  // Batching 3 PATCHes on the same row causes lock contention — do them one at a time
  let updateRes = http.patch(
    `${BASE_URL}/workouts/${workoutId}`,
    JSON.stringify({ title: "Updated Heavy Workout" }),
    { headers, tags: { name: "update" } }
  );
  check(updateRes, { "update 200": (r) => r.status === 200 });

  let scheduleRes = http.patch(
    `${BASE_URL}/workouts/${workoutId}/schedule`,
    JSON.stringify({
      scheduledAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    }),
    { headers, tags: { name: "schedule" } }
  );
  check(scheduleRes, { "schedule 200": (r) => r.status === 200 });

  let notesRes = http.patch(
    `${BASE_URL}/workouts/${workoutId}/notes`,
    JSON.stringify({ notes: "Heavy load notes" }),
    { headers, tags: { name: "notes" } }
  );
  check(notesRes, { "notes 200": (r) => r.status === 200 });

  sleep(0.3);

  // --- Read ---
  let getRes = http.get(`${BASE_URL}/workouts/${workoutId}`, {
    headers,
    tags: { name: "getById" },
  });
  check(getRes, { "read by id 200": (r) => r.status === 200 });

  let listRes = http.get(`${BASE_URL}/workouts`, {
    headers,
    tags: { name: "list" },
  });
  check(listRes, { "list 200": (r) => r.status === 200 });

  sleep(0.3);

  // --- Delete ---
  let delRes = http.del(`${BASE_URL}/workouts/${workoutId}`, null, {
    headers,
    tags: { name: "delete" },
  });
  check(delRes, {
    "delete 200 or 204": (r) => r.status === 200 || r.status === 204,
  });

  // Random think time — simulates real users, reduces connection pressure
  sleep(1 + Math.random() * 2);
}