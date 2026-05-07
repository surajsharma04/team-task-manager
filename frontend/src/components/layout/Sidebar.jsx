import { ProjectForm } from "../../features/projects/ProjectForm";

export function Sidebar({
  user,
  projects,
  selectedProjectId,
  canCreateProject,
  isOpen,
  onClose,
  onCreateProject,
  onSelectProject,
  onLogout,
}) {
  const initials = user?.name
    ? user.name.split(" ").map(name => name[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  const selectedProject = projects.find(project => project._id === selectedProjectId);

  const handleSelectProject = projectId => {
    onSelectProject(projectId);
    onClose?.();
  };

  return (
    <aside className={`sidebar ${isOpen ? "is-open" : ""}`} aria-label="Workspace navigation">
      <div className="brand-wrap">
        <div className="brand">
          <div className="brand-gem">
            <div className="brand-gem-inner">TF</div>
          </div>
          <div>
            <div className="brand-name">TaskFlow</div>
            <div className="brand-tagline">Command Center</div>
          </div>
        </div>

        <button className="drawer-close" type="button" onClick={onClose} aria-label="Close sidebar">
          X
        </button>

        <div className="user-orb">
          <div className="avatar">{initials}</div>
          <div>
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
        </div>
      </div>

      <div className="sidebar-content">
        {canCreateProject && (
          <>
            <div className="section-head">New Workspace</div>
            <ProjectForm onSubmit={onCreateProject} />
          </>
        )}

        <div className="section-head">Projects</div>
        {projects.length ? (
          <div className="project-switcher">
            <div className="project-switcher-current">
              <span className="project-dot" />
              <span>{selectedProject?.name || "Choose a project"}</span>
            </div>
            <select
              className="input-plasma form-select project-dropdown"
              value={selectedProjectId || ""}
              onChange={event => handleSelectProject(event.target.value)}
              aria-label="Select project"
            >
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name} - {project.members.length} member{project.members.length !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="sidebar-empty">
            {canCreateProject ? "No projects yet. Create one above or ask an admin to add you." : "No projects assigned yet. Ask an admin to add you."}
          </div>
        )}
      </div>

      <div className="sidebar-bottom">
        <button className="btn-logout" type="button" onClick={onLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
