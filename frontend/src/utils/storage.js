const keys = {
  token: "ttm_token",
  user: "ttm_user",
  project: "ttm_project"
};

export function loadSession() {
  return {
    token: localStorage.getItem(keys.token) || "",
    user: JSON.parse(localStorage.getItem(keys.user) || "null"),
    selectedProjectId: localStorage.getItem(keys.project) || ""
  };
}

export function saveSession(token, user) {
  localStorage.setItem(keys.token, token);
  localStorage.setItem(keys.user, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(keys.token);
  localStorage.removeItem(keys.user);
  localStorage.removeItem(keys.project);
}

export function saveSelectedProject(projectId) {
  if (projectId) localStorage.setItem(keys.project, projectId);
  else localStorage.removeItem(keys.project);
}
