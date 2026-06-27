import http from "k6/http";
import { check, sleep } from "k6";

// # Local (dev)
// k6 run -e IS_DEV=true loadtests/userLoadtest.js

// # Production
// k6 run -e IS_DEV=false loadtests/userLoadtest.js

const BASE_URL =
  __ENV.IS_DEV === "true"
    ? "http://localhost:5001"
    : "https://workout-tracker-app-617bd3c5a4b7.herokuapp.com";

export let options = {
  stages: [
    { duration: "15s", target: 5  }, // gentle warm up
    { duration: "30s", target: 20 }, // ramp to moderate load
    { duration: "30s", target: 30 }, // peak — safe for free Supabase
    { duration: "15s", target: 0  }, // ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<3000"], // realistic for free tier at 30 VUs
    http_req_failed:   ["rate<0.05"],  // <5% errors
    checks:            ["rate>0.90"],  // 90% checks pass
  },
};

export default function () {
  const uniqueEmail = `user${Math.floor(Math.random() * 1e9)}@example.com`;
  const password = "StrongP@ss1";

  // --- Register ---
  const registerRes = http.post(
    `${BASE_URL}/auth/register`,
    JSON.stringify({
      email: uniqueEmail,
      password: password,
      username: `user${Math.floor(Math.random() * 1e9)}`, // unique username too
    }),
    {
      headers: { "Content-Type": "application/json" },
      tags: { name: "register" },
    }
  );

  if (registerRes.status !== 201 && registerRes.status !== 409) {
    console.error(`Register failed: ${registerRes.status} - ${registerRes.body}`);
  }
  check(registerRes, {
    "register status 201": (r) => r.status === 201,
    "register response valid": (r) => {
      try {
        return r.json("data.email") !== undefined;
      } catch {
        return false;
      }
    },
  });

  sleep(0.5); // let the DB breathe between register and login

  // --- Login ---
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      email: uniqueEmail,
      password: password,
    }),
    {
      headers: { "Content-Type": "application/json" },
      tags: { name: "login" },
    }
  );

  check(loginRes, {
    "login status 200": (r) => r.status === 200,
    "token received": (r) => {
      try {
        return !!r.json("data.token");
      } catch {
        return false;
      }
    },
  });

  const token = loginRes.json("data.token");

  if (!token) {
    console.error(`Failed to get token. Status: ${loginRes.status}`);
    return;
  }

  sleep(0.3);

  // --- Profile ---
  const profileRes = http.get(`${BASE_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    tags: { name: "profile" },
  });

  check(profileRes, {
    "profile status 200": (r) => r.status === 200,
    "profile has user data": (r) => {
      try {
        return r.json("data.email") !== undefined;
      } catch {
        return false;
      }
    },
  });

  // Think time — simulates real users, reduces connection pressure
  sleep(1 + Math.random() * 2);
}