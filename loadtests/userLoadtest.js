import http from "k6/http";
import { check, sleep } from "k6";

// # Local (dev)
// k6 run -e IS_DEV=true loadtests/userLoadtest.js

// # Production
// k6 run -e IS_DEV=false loadtests/userLoadtest.js

const BASE_URL =
  __ENV.IS_DEV === "true"
    ? "http://localhost:5000"
    : "https://workout-tracker-app-617bd3c5a4b7.herokuapp.com";

export let options = {
  stages: [
    { duration: "20", target: 50 },
    { duration: "20s", target: 100 },
    { duration: "20s", target: 200 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const uniqueEmail = `user${Math.floor(Math.random() * 10000000)}@example.com`;
  const password = "StrongP@ss1";

  console.log(`Using BASE_URL: ${BASE_URL}/auth/register`);
  const registerRes = http.post(
    `${BASE_URL}/auth/register`,
    JSON.stringify({
      email: uniqueEmail,
      password: password,
      username: "loaduser",
    }),
    { headers: { "Content-Type": "application/json" } },
  );

  check(registerRes, {
    "register status 201": (r) => r.status === 201,
    "register response valid": (r) => r.json("data.email") !== undefined,
  });

  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      email: uniqueEmail,
      password: password,
    }),
    { headers: { "Content-Type": "application/json" } },
  );

  check(loginRes, {
    "login status 200": (r) => r.status === 200,
    "token received": (r) => r.json("data.token") !== undefined,
  });

  const token = loginRes.json("data.token");

  if (!token) {
    console.error(`Failed to get token. Response: ${loginRes.body}`);
    return;
  }

  const profileRes = http.get(`${BASE_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(profileRes, {
    "profile status 200": (r) => r.status === 200,
    "profile has user data": (r) => r.json("data.email") !== undefined,
  });

  sleep(1);
}
