import { getId } from "../../utils/formatters";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#0f766e,#1d4ed8)",
  "linear-gradient(135deg,#7c3aed,#db2777)",
  "linear-gradient(135deg,#b45309,#15803d)",
  "linear-gradient(135deg,#1d4ed8,#0891b2)",
  "linear-gradient(135deg,#be185d,#7c3aed)",
];

export function MemberPanel({ project, onAddMember, onRemoveMember }) {
  if (!project) return null;

  return (
    <div className="panel-card">
      <div className="panel-card-title">
        <span className="panel-card-title-dot" />
        Members
      </div>

      <form
        style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}
        onSubmit={event => {
          event.preventDefault();
          onAddMember(Object.fromEntries(new FormData(event.currentTarget)));
          event.currentTarget.reset();
        }}
      >
        <div className="field-group">
          <div className="field-label">EMAIL</div>
          <input className="input-plasma" type="email" name="email" placeholder="colleague@acme.io" required />
        </div>
        <div className="field-group">
          <div className="field-label">ROLE</div>
          <select className="input-plasma form-select" name="role">
            <option>Member</option>
            <option>Admin</option>
          </select>
        </div>
        <button className="btn-plasma" type="submit" style={{ fontSize: 12, padding: "8px 14px" }}>
          Add Member
        </button>
      </form>

      <div>
        {project.members.map((member, index) => {
          const initials = member.user.name
            ? member.user.name.split(" ").map(name => name[0]).join("").slice(0, 2).toUpperCase()
            : "?";

          return (
            <div className="member-row" key={member._id || getId(member.user)}>
              <div
                className="member-av"
                style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
              >
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="member-name">{member.user.name}</div>
                <div className="member-role">{member.user.email} - {member.role}</div>
              </div>
              {getId(project.createdBy) !== getId(member.user) && (
                <button className="btn-remove" type="button" onClick={() => onRemoveMember(getId(member.user))}>
                  Remove
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
