export function ProjectList({ projects, selectedProjectId, canCreateProject, onSelect }) {
  if (!projects.length) {
    return (
      <div style={{ padding: "16px 8px", fontSize: 11, color: "var(--text3)", textAlign: "center" }}>
        {canCreateProject ? "No projects yet. Create one above or ask an admin to add you." : "No projects assigned yet. Ask an admin to add you."}
      </div>
    );
  }

  return (
    <nav>
      {projects.map(project => {
        const isActive = project._id === selectedProjectId;
        return (
          <button
            key={project._id}
            className={`project-item ${isActive ? "active" : ""}`}
            type="button"
            onClick={() => onSelect(project._id)}
          >
            <span className="project-name">{project.name}</span>
            <span className="project-meta">
              <span className="project-dot" />
              {project.members.length} member{project.members.length !== 1 ? "s" : ""}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
