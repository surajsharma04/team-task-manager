export function WorkspaceHeader({ project, membership, taskCount, isTaskCountLoading }) {
  const [firstWord, ...rest] = project?.name?.split(" ") || [];
  const trailingTitle = rest.join(" ") || "Project";
  const isAdmin = membership?.role === "Admin";
  const taskLabel = isAdmin ? "team tasks in this project" : "assigned tasks in this project";

  return (
    <header className="workspace-header anim-1">
      <div>
        <div className="header-eyebrow">
          <span className="pulse-ring" />
          {project ? "Active Workspace" : "Get Started"}
        </div>
        <h1 className="project-headline">
          {project ? (
            <>
              {firstWord} <em>{trailingTitle}</em>
            </>
          ) : (
            <>
              Create your<br />
              <em>first project</em>
            </>
          )}
        </h1>
        <p className="project-subtitle">
          {project?.description || (project
            ? `${membership?.role || "Member"} access - Manage tasks and collaborate`
            : "Start by creating a workspace in the sidebar.")}
        </p>
      </div>

      {project && (
        <div className="hero-3d-scene">
          <div className="hero-3d-card">
            <div className="hero-card-label">Live Board</div>
            <div className={`hero-card-value ${isTaskCountLoading ? "is-loading" : ""}`}>
              {isTaskCountLoading ? "..." : taskCount ?? 0}
            </div>
            <div className="hero-card-sub">{taskLabel}</div>
          </div>
        </div>
      )}
    </header>
  );
}
