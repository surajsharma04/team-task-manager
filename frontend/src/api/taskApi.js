import { request } from "./httpClient";

export function getProjectTasks(token, projectId) {
  return request(`/tasks/project/${projectId}`, { token });
}

export function createTask(token, payload) {
  return request("/tasks", {
    token,
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateTask(token, taskId, payload) {
  return request(`/tasks/${taskId}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function deleteTask(token, taskId) {
  return request(`/tasks/${taskId}`, {
    token,
    method: "DELETE"
  });
}
