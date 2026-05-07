import { request } from "./httpClient";

export function getDashboard(token) {
  return request("/dashboard", { token });
}
