import { request } from "./httpClient";

export function login(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function signup(payload) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
