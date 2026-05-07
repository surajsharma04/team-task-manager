import { useEffect, useState } from "react";
import { BackgroundCanvas } from "./components/ui/BackgroundCanvas";
import { Sidebar } from "./components/layout/Sidebar";
import { WorkspaceHeader } from "./components/layout/WorkspaceHeader";
import { AuthView } from "./features/auth/AuthView";
import { Dashboard } from "./features/dashboard/Dashboard";
import { MemberPanel } from "./features/members/MemberPanel";
import { TaskForm } from "./features/tasks/TaskForm";
import { TaskPanel } from "./features/tasks/TaskPanel";
import { useWorkspaceAnimation } from "./hooks/useWorkspaceAnimation";
import { useTaskManagerStore } from "./store/useTaskManagerStore";

export function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token            = useTaskManagerStore(s => s.token);
  const user             = useTaskManagerStore(s => s.user);
  const projects         = useTaskManagerStore(s => s.projects);
  const tasks            = useTaskManagerStore(s => s.tasks);
  const tasksProjectId   = useTaskManagerStore(s => s.tasksProjectId);
  const dashboard        = useTaskManagerStore(s => s.dashboard);
  const selectedProjectId = useTaskManagerStore(s => s.selectedProjectId);
  const message          = useTaskManagerStore(s => s.message);
  const isTasksLoading   = useTaskManagerStore(s => s.isTasksLoading);
  const authenticate     = useTaskManagerStore(s => s.authenticate);
  const logout           = useTaskManagerStore(s => s.logout);
  const loadWorkspace    = useTaskManagerStore(s => s.loadWorkspace);
  const setSelectedProjectId = useTaskManagerStore(s => s.setSelectedProjectId);
  const createProject    = useTaskManagerStore(s => s.createProject);
  const addMember        = useTaskManagerStore(s => s.addMember);
  const removeMember     = useTaskManagerStore(s => s.removeMember);
  const createTask       = useTaskManagerStore(s => s.createTask);
  const updateTask       = useTaskManagerStore(s => s.updateTask);
  const deleteTask       = useTaskManagerStore(s => s.deleteTask);
  const selectedProject  = useTaskManagerStore(s => s.selectedProject());
  const currentMembership = useTaskManagerStore(s => s.currentMembership());
  const isAdmin          = useTaskManagerStore(s => s.isAdmin());
  const canCreateProject = useTaskManagerStore(s => s.canCreateProject());
  const taskListBelongsToSelectedProject = Boolean(selectedProject && tasksProjectId === selectedProject._id);
  const selectedTaskCount = taskListBelongsToSelectedProject ? tasks.length : 0;

  useEffect(() => {
    if (token && user) loadWorkspace();
  }, [token, user, loadWorkspace]);

  useEffect(() => {
    if (!isSidebarOpen) return undefined;

    const handleKeyDown = event => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  useWorkspaceAnimation(Boolean(token && user));

  const handleSelectProject = projectId => {
    setSelectedProjectId(projectId);
    setIsSidebarOpen(false);
  };

  if (!token || !user) {
    return <AuthView onAuth={authenticate} message={message} />;
  }

  return (
    <>
      <BackgroundCanvas />
      <div className={`role-background ${isAdmin ? "admin-bg" : "user-bg"}`} />
      <div className="grid-overlay" />

      <main
        className={`app-shell ${isAdmin ? "admin-theme" : "user-theme"}`}
        style={{ position: "relative", zIndex: 2 }}
      >
        <div className="mobile-topbar">
          <button
            className="mobile-menu-btn"
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <span />
            <span />
            <span />
          </button>

          <select
            className="mobile-project-select"
            value={selectedProject?._id || selectedProjectId || ""}
            onChange={event => handleSelectProject(event.target.value)}
            aria-label="Select project"
            disabled={!projects.length}
          >
            {projects.length ? (
              projects.map(project => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))
            ) : (
              <option>No projects</option>
            )}
          </select>

          {isAdmin && selectedProject && (
            <div className="mobile-action-links" aria-label="Workspace actions">
              <a href="#members-panel">Members</a>
              <a href="#new-task-panel">New Task</a>
            </div>
          )}
        </div>

        <button
          className={`sidebar-backdrop ${isSidebarOpen ? "is-visible" : ""}`}
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />

        <Sidebar
          user={user}
          projects={projects}
          selectedProjectId={selectedProject?._id || selectedProjectId}
          canCreateProject={canCreateProject}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCreateProject={createProject}
          onSelectProject={handleSelectProject}
          onLogout={logout}
        />

        <div className="workspace" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <WorkspaceHeader
            project={selectedProject}
            membership={currentMembership}
            taskCount={selectedTaskCount}
            isTaskCountLoading={isTasksLoading || (Boolean(selectedProject) && !taskListBelongsToSelectedProject)}
          />

          <Dashboard dashboard={dashboard} />

          <div className="workspace-body anim-5">
            <TaskPanel
              tasks={tasks}
              selectedProject={selectedProject}
              isAdmin={isAdmin}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />

            {isAdmin && (
              <div className="right-panel anim-6">
                <div id="members-panel" className="admin-panel-anchor">
                  <MemberPanel
                    project={selectedProject}
                    onAddMember={addMember}
                    onRemoveMember={removeMember}
                  />
                </div>
                <div id="new-task-panel" className="admin-panel-anchor">
                  <TaskForm project={selectedProject} onSubmit={createTask} />
                </div>
              </div>
            )}
          </div>

          {message && (
            <div
              style={{
                margin: "0 36px 20px",
                padding: "12px 16px",
                background: "rgba(251,113,133,0.08)",
                border: "1px solid rgba(251,113,133,0.2)",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                color: "var(--rose)",
              }}
            >
              {message}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
