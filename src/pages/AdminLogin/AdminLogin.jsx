import { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAdminAuth } from "../../auth/AdminAuth";
import "./AdminLogin.css";

export default function AdminLogin() {
  const { user, loading, login, logout } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const pending = useRef(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (pending.current) return;

    pending.current = true;
    setBusy(true);
    setError("");

    try {
      await login(email, password);
    } catch (failure) {
      setError(failure.message);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-login-page" role="status">
        Checking your session…
      </main>
    );
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin/properties" replace />;
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link to="/" className="admin-login-brand">
          Haggai Homes
        </Link>

        <p className="admin-login-eyebrow">ADMINISTRATION</p>

        <h1>Welcome back</h1>
        <p>Sign in to manage the property catalogue.</p>

        {user && (
          <p role="alert">
            Your current account is not an administrator.{" "}
            <button onClick={logout}>Sign out</button>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email address</label>

          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={busy}
          />

          <label htmlFor="admin-password">Password</label>

          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={busy}
          />

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={busy}
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p>Need access? Contact your system administrator.</p>

        <Link to="/">Back to Haggai Homes</Link>
      </section>
    </main>
  );
}