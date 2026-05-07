const METRICS = [
  { key: "totalTasks", label: "Total Tasks", icon: "ALL", cls: "m-total", getValue: data => data.totalTasks ?? 0 },
  { key: "todo", label: "To Do", icon: "TODO", cls: "m-todo", getValue: data => data.byStatus?.["To Do"] ?? 0 },
  { key: "inProgress", label: "In Progress", icon: "RUN", cls: "m-prog", getValue: data => data.byStatus?.["In Progress"] ?? 0 },
  { key: "done", label: "Done", icon: "DONE", cls: "m-done", getValue: data => data.byStatus?.Done ?? 0 },
  { key: "overdue", label: "Overdue", icon: "LATE", cls: "m-over", getValue: data => data.overdueTasks ?? 0 },
];

export function Dashboard({ dashboard }) {
  const perUser = Object.entries(dashboard.perUser || {});

  return (
    <>
      <div className="metrics-row anim-2">
        {METRICS.map(metric => (
          <div className={`metric-orb ${metric.cls}`} key={metric.key}>
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-value">{metric.getValue(dashboard)}</div>
            <div className="metric-label">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="activity-bar anim-3">
        <span className="activity-label">Assigned</span>
        {perUser.length ? (
          perUser.map(([name, count]) => (
            <span className="user-chip" key={name}>
              <span className="chip-av">{name[0]}</span>
              {name}: {count}
            </span>
          ))
        ) : (
          <span className="user-chip">
            <span className="chip-av">?</span>
            No assignments yet
          </span>
        )}
      </div>
    </>
  );
}
