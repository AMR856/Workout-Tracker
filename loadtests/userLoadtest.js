import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://localhost:5000";

export let options = {
 stages: [
    { duration: "1m", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "1m", target: 200 },
    { duration: "1m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const registerRes = http.post(`${BASE_URL}/auth/register`, JSON.stringify({
    email: `user${Math.floor(Math.random() * 10000)}@example.com`,
    password: "StrongP@ss1",
    username: "loaduser",
  }), { headers: { "Content-Type": "application/json" } });

  check(registerRes, {
    "register status 201": (r) => r.status === 201,
  });

  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: "user@example.com",
    password: "StrongP@ss1",
  }), { headers: { "Content-Type": "application/json" } });

  check(loginRes, {
    "login status 200": (r) => r.status === 200,
    "token received": (r) => r.json("data.token") !== undefined,
  });

  const token = loginRes.json("data.token");

  const profileRes = http.get(`${BASE_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(profileRes, {
    "profile status 200": (r) => r.status === 200,
  });

  sleep(1);
}
