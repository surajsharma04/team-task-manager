import { PRIORITIES } from "../../constants";
import { getId } from "../../utils/formatters";

export function TaskForm({ project, onSubmit }) {
  if (!project) return null;

  return (
    <div className="panel-card" style={{ marginTop: 0 }}>
      <div className="panel-card-title">
        <span className="panel-card-title-dot" style={{ background: "var(--violet)", boxShadow: "0 0 6px var(--violet)" }} />
        New Task
      </div>

      <form
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
        onSubmit={event => {
          event.preventDefault();
          onSubmit(Object.fromEntries(new FormData(event.currentTarget)));
          event.currentTarget.reset();
        }}
      >
        <div className="field-group">
          <div className="field-label">TITLE</div>
          <input className="input-plasma" name="title" placeholder="Task title..." required />
        </div>
        <div className="field-group">
          <div className="field-label">DESCRIPTION</div>
          <textarea className="input-plasma" name="description" placeholder="What needs to be done?" rows="2" />
        </div>
        <div className="field-group">
          <div className="field-label">DUE DATE</div>
          <input className="input-plasma" type="date" name="dueDate" required />
        </div>
        <div className="field-group">
          <div className="field-label">PRIORITY</div>
          <select className="input-plasma form-select" name="priority">
            {PRIORITIES.map(priority => <option key={priority}>{priority}</option>)}
          </select>
        </div>
        <div className="field-group">
          <div className="field-label">ASSIGNEE</div>
          <select className="input-plasma form-select" name="assignee" required>
            {project.members.map(member => (
              <option key={getId(member.user)} value={getId(member.user)}>{member.user.name}</option>
            ))}
          </select>
        </div>
        <button className="btn-violet" type="submit" style={{ marginTop: 4 }}>Create Task</button>
      </form>
    </div>
  );
}
