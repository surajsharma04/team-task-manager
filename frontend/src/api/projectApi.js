import { request } from "./httpClient";

export function getProjects(token) {
  return request("/projects", { token });
}

export function createProject(token, payload) {
  return request("/projects", {
    token,
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function addProjectMember(token, projectId, payload) {
  return request(`/projects/${projectId}/members`, {
    token,
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function removeProjectMember(token, projectId, userId) {
  return request(`/projects/${projectId}/members/${userId}`, {
    token,
    method: "DELETE"
  });
}
