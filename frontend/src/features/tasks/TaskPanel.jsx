import { useState } from "react";
import { STATUSES } from "../../constants";
import { formatDate } from "../../utils/formatters";

const STATUS_COLOR = {
  "To Do": "var(--rose)",
  "In Progress": "var(--gold)",
  Done: "#4ade80",
};

const PRIORITY_BADGE = {
  High: "tb-high",
  Medium: "tb-med",
  Low: "tb-low",
};

const STATUS_BADGE = {
  "To Do": "tb-todo",
  "In Progress": "tb-prog",
  Done: "tb-done",
};

export function TaskPanel({ tasks, selectedProject, isAdmin, onUpdateTask, onDeleteTask }) {
  const [filter, setFilter] = useState("");
  const filtered = tasks.filter(task => !filter || task.status === filter);
  const title = isAdmin ? "Team Tasks" : "My Assigned Tasks";

  return (
    <section className="task-panel anim-4">
      <div className="task-panel-header">
        <div className="panel-title-wrap">
          <span className="panel-title">{title}</span>
          <span className="task-count-badge">{filtered.length.toString().padStart(2, "0")}</span>
        </div>

        <div className="filter-wrap">
          <button
            className={`filter-btn ${!filter ? "active" : ""}`}
            type="button"
            onClick={() => setFilter("")}
          >
            All
          </button>
          {STATUSES.map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? "active" : ""}`}
              type="button"
              onClick={() => setFilter(filter === status ? "" : status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="task-scroll">
        {!selectedProject && (
          <div className="empty-state">
            <div className="empty-glyph">TF</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)" }}>No workspace selected</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>Create or join a project to start tracking work</div>
          </div>
        )}

        {selectedProject && !filtered.length && (
          <div className="empty-state">
            <div className="empty-glyph">{filter ? "0" : "OK"}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)" }}>
              {filter ? "No tasks match" : isAdmin ? "No tasks created yet" : "No assigned tasks yet"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>
              {filter ? "Try a different filter" : isAdmin ? "Create and assign a task from the right panel" : "Assigned tasks from this project will appear here"}
            </div>
          </div>
        )}

        {filtered.map(task => (
          <article
            className="task-card"
            key={task._id}
            style={{ "--tc": STATUS_COLOR[task.status] || "var(--plasma)" }}
          >
            <div className="task-header">
              <div className="task-title">{task.title}</div>
              {task.description && <div className="task-desc">{task.description}</div>}
            </div>

            <div className="task-badges">
              <span className={`tbadge ${STATUS_BADGE[task.status] || "tb-neutral"}`}>
                {task.status}
              </span>
              <span className={`tbadge ${PRIORITY_BADGE[task.priority] || "tb-neutral"}`}>
                {task.priority}
              </span>
              <span className="tbadge tb-neutral">Due {formatDate(task.dueDate)}</span>
              <span className="tbadge tb-neutral">{task.assignee?.name || "Unassigned"}</span>
            </div>

            <div className="task-footer">
              <select
                className="task-status-select"
                value={task.status}
                onChange={event => onUpdateTask(task._id, { status: event.target.value })}
              >
                {STATUSES.map(status => <option key={status}>{status}</option>)}
              </select>
              {isAdmin && (
                <button
                  className="btn-delete"
                  type="button"
                  onClick={() => onDeleteTask(task._id)}
                >
                  Delete
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
