export function ProjectForm({ onSubmit }) {
  return (
    <div className="new-project-form">
      <div className="form-title">New Project</div>
      <form
        style={{ display: "flex", flexDirection: "column", gap: 0 }}
        onSubmit={event => {
          event.preventDefault();
          onSubmit(Object.fromEntries(new FormData(event.currentTarget)));
          event.currentTarget.reset();
        }}
      >
        <div className="field-group">
          <div className="field-label">NAME</div>
          <input className="input-plasma" name="name" placeholder="Project name..." required />
        </div>
        <div className="field-group" style={{ marginBottom: 10 }}>
          <div className="field-label">DESCRIPTION</div>
          <textarea className="input-plasma" name="description" placeholder="What's this about?" />
        </div>
        <button className="btn-plasma" type="submit">Create workspace</button>
      </form>
    </div>
  );
}
