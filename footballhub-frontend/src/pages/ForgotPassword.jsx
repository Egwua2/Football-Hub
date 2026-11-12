import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

async function readResponse(response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequest(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Enter the email address linked to your account.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || data?.error || "Could not request a reset code."
        );
      }

      setStep("reset");
      setMessage(
        data?.message ||
          "If an account exists for that email, a reset code will be sent."
      );
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot reach the server. Please try again shortly."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the six-digit code sent to your email.");
      return;
    }

    if (password.length < 8 || new TextEncoder().encode(password).length > 72) {
      setError("Password must be at least 8 characters and no more than 72 bytes.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code,
          newPassword: password,
        }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || data?.error || "Could not reset your password."
        );
      }

      setMessage(
        data?.message ||
          "Your password has been reset. Log in with your new password."
      );
      setStep("complete");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot reach the server. Please try again shortly."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card verify-card">
        <div className="auth-logo">
          <span className="auth-logo-top">FH</span>
          <span className="auth-logo-bottom">FOOTY HUB</span>
        </div>

        <h1>
          {step === "request"
            ? "Forgot password?"
            : step === "reset"
              ? "Create a new password"
              : "Password updated"}
        </h1>

        <p className="auth-subtitle">
          {step === "request"
            ? "Enter your account email and we'll send you a reset code."
            : step === "reset"
              ? "Enter the code from your email and choose a new password."
              : "Your account is secured with your new password."}
        </p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-info">{message}</div>}

        {step === "request" && (
          <form onSubmit={handleRequest}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send reset code"}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleReset}>
            <input
              type="email"
              value={email}
              readOnly
              aria-label="Account email"
            />

            <input
              className="verification-code"
              type="text"
              name="code"
              placeholder="6-digit reset code"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="New password (at least 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Updating password..." : "Reset password"}
            </button>

            <button
              className="auth-secondary-button"
              type="button"
              onClick={() => {
                setStep("request");
                setCode("");
                setPassword("");
                setConfirmPassword("");
                setError("");
                setMessage("");
              }}
              disabled={loading}
            >
              Request another code
            </button>
          </form>
        )}

        {step === "complete" && (
          <button type="button" onClick={() => navigate("/login", { replace: true })}>
            Go to login
          </button>
        )}

        <p className="auth-switch">
          <Link to="/login">Back to log in</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
