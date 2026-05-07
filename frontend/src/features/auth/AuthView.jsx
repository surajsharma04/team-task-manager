import { useRef, useState } from "react";
import { BackgroundCanvas } from "../../components/ui/BackgroundCanvas";
import { useAuthAnimation } from "../../hooks/useAuthAnimation";

const STACK_CARDS = [
  { icon: "UX", title: "Design System Overhaul", sub: "4 members - 12 tasks", status: "In Progress", statusClass: "tb-prog" },
  { icon: "API", title: "API Gateway v2", sub: "3 members - 7 tasks", status: "Active", statusClass: "tb-done" },
  { icon: "APP", title: "Mobile App Launch", sub: "6 members - 21 tasks", status: "To Do", statusClass: "tb-todo" },
];

export function AuthView({ onAuth, message }) {
  const [mode, setMode] = useState("login");
  const shellRef = useRef(null);
  useAuthAnimation(shellRef);

  return (
    <>
      <BackgroundCanvas />
      <div className="role-background auth-bg" />
      <div className="grid-overlay" />

      <main ref={shellRef} className="auth-shell">
        <section className="auth-left">
          <div className="auth-left-bg" />

          <div className="auth-wordmark">
            <span className="auth-wordmark-line1">Task</span>
            <span className="auth-wordmark-line2">Flow</span>
          </div>

          <p className="auth-descriptor">
            A command center for modern teams. Plan work, assign ownership, and track progress across every project in one focused workspace.
          </p>

          <div className="auth-stack">
            {STACK_CARDS.map((card, index) => (
              <div className="auth-stack-card" key={card.title}>
                <span className="stack-icon">{card.icon}</span>
                <div className="stack-info">
                  <div className="stack-title">{card.title}</div>
                  <div className="stack-sub">{card.sub}</div>
                </div>
                <span className={`stack-badge tbadge ${card.statusClass}`}>{card.status}</span>
                <span className="stack-index">{String(index + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="auth-right">
          <div className="auth-form-card">
            <h2 className="auth-form-title">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="auth-form-sub">
              {mode === "login" ? "Sign in to your workspace" : "Start your workspace today"}
            </p>

            <div className="mode-toggle">
              <button
                className={`mode-btn ${mode === "login" ? "active" : ""}`}
                type="button"
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                className={`mode-btn ${mode === "signup" ? "active" : ""}`}
                type="button"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </div>

            <form
              className="auth-form-body"
              onSubmit={event => {
                event.preventDefault();
                onAuth(mode, Object.fromEntries(new FormData(event.currentTarget)));
              }}
            >
              {mode === "signup" && (
                <div className="field-wrap">
                  <label className="field-lbl">FULL NAME</label>
                  <input className="auth-input" name="name" placeholder="Arjun Kumar" required />
                </div>
              )}
              <div className="field-wrap">
                <label className="field-lbl">EMAIL</label>
                <input className="auth-input" type="email" name="email" placeholder="you@acme.io" required />
              </div>
              <div className="field-wrap">
                <label className="field-lbl">PASSWORD</label>
                <input className="auth-input" type="password" name="password" placeholder="Password" minLength="6" required />
              </div>
              <button className="btn-auth" type="submit">
                {mode === "login" ? "Enter workspace" : "Launch workspace"}
              </button>
            </form>

            {message && <div className="error-msg">{message}</div>}
          </div>
        </section>
      </main>
    </>
  );
}
