import { create } from "zustand";
import { login, signup } from "../api/authApi";
import { getDashboard } from "../api/dashboardApi";
import { addProjectMember, createProject, getProjects, removeProjectMember } from "../api/projectApi";
import { createTask, deleteTask, getProjectTasks, updateTask } from "../api/taskApi";
import { EMPTY_DASHBOARD } from "../constants";
import { clearSession, loadSession, saveSelectedProject, saveSession } from "../utils/storage";

const session = loadSession();

export const useTaskManagerStore = create((set, get) => ({
  token: session.token,
  user: session.user,
  selectedProjectId: session.selectedProjectId,
  projects: [],
  tasks: [],
  tasksProjectId: "",
  dashboard: EMPTY_DASHBOARD,
  message: "",
  isLoading: false,
  isTasksLoading: false,

  selectedProject: () => {
    const { projects, selectedProjectId } = get();
    return projects.find(project => project._id === selectedProjectId) || projects[0] || null;
  },

  currentMembership: () => {
    const { user } = get();
    const project = get().selectedProject();
    return project?.members.find(member => (member.user?._id || member.user?.id || member.user) === (user?.id || user?._id)) || null;
  },

  isAdmin: () => get().currentMembership()?.role === "Admin",
  canCreateProject: () => Boolean(get().user),

  setMessage: message => set({ message }),

  setSelectedProjectId: projectId => {
    saveSelectedProject(projectId);
    set({ selectedProjectId: projectId, tasks: [], tasksProjectId: "", isTasksLoading: Boolean(projectId) });
    if (projectId) get().loadTasks(projectId);
  },

  authenticate: async (mode, payload) => {
    try {
      set({ isLoading: true, message: "" });
      const data = mode === "signup" ? await signup(payload) : await login(payload);
      saveSession(data.token, data.user);
      set({ token: data.token, user: data.user, isLoading: false });
      await get().loadWorkspace();
    } catch (error) {
      set({ message: error.message, isLoading: false });
    }
  },

  logout: () => {
    clearSession();
    set({
      token: "",
      user: null,
      selectedProjectId: "",
      projects: [],
      tasks: [],
      tasksProjectId: "",
      dashboard: EMPTY_DASHBOARD,
      message: ""
    });
  },

  loadWorkspace: async () => {
    const { token, selectedProjectId } = get();
    if (!token) return;

    try {
      set({ isLoading: true, message: "" });
      const [projectData, dashboard] = await Promise.all([getProjects(token), getDashboard(token)]);
      const projects = projectData.projects;
      const nextProjectId = projects.some(project => project._id === selectedProjectId)
        ? selectedProjectId
        : projects[0]?._id || "";

      saveSelectedProject(nextProjectId);
      set({ projects, dashboard, selectedProjectId: nextProjectId, isLoading: false });

      if (nextProjectId) await get().loadTasks(nextProjectId);
      else set({ tasks: [], tasksProjectId: "", isTasksLoading: false });
    } catch (error) {
      set({ message: error.message, isLoading: false });
    }
  },

  loadTasks: async projectId => {
    const { token } = get();
    if (!token || !projectId) {
      set({ tasks: [], tasksProjectId: "", isTasksLoading: false });
      return;
    }

    try {
      set({ isTasksLoading: true });
      const data = await getProjectTasks(token, projectId);
      if (get().selectedProjectId === projectId) {
        set({ tasks: data.tasks, tasksProjectId: projectId, isTasksLoading: false, message: "" });
      } else {
        set({ isTasksLoading: false });
      }
    } catch (error) {
      set({ message: error.message, isTasksLoading: false });
    }
  },

  createProject: async payload => {
    try {
      const { token } = get();
      const data = await createProject(token, payload);
      saveSelectedProject(data.project._id);
      set({ selectedProjectId: data.project._id, message: "" });
      await get().loadWorkspace();
    } catch (error) {
      set({ message: error.message });
    }
  },

  addMember: async payload => {
    try {
      const { token } = get();
      const project = get().selectedProject();
      await addProjectMember(token, project._id, payload);
      await get().loadWorkspace();
    } catch (error) {
      set({ message: error.message });
    }
  },

  removeMember: async userId => {
    try {
      const { token } = get();
      const project = get().selectedProject();
      await removeProjectMember(token, project._id, userId);
      await get().loadWorkspace();
    } catch (error) {
      set({ message: error.message });
    }
  },

  createTask: async payload => {
    try {
      const { token } = get();
      const project = get().selectedProject();
      await createTask(token, { ...payload, projectId: project._id });
      await Promise.all([get().loadTasks(project._id), get().loadWorkspace()]);
    } catch (error) {
      set({ message: error.message });
    }
  },

  updateTask: async (taskId, payload) => {
    try {
      const { token } = get();
      const project = get().selectedProject();
      await updateTask(token, taskId, payload);
      await Promise.all([get().loadTasks(project._id), get().loadWorkspace()]);
    } catch (error) {
      set({ message: error.message });
    }
  },

  deleteTask: async taskId => {
    try {
      const { token } = get();
      const project = get().selectedProject();
      await deleteTask(token, taskId);
      await Promise.all([get().loadTasks(project._id), get().loadWorkspace()]);
    } catch (error) {
      set({ message: error.message });
    }
  }
}));
