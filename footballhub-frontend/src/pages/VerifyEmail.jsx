import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

async function readResponse(response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(
    location.state?.email ||
      new URLSearchParams(window.location.search).get("email") ||
      ""
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendIn, setResendIn] = useState(
    location.state?.justSent ? 60 : 0
  );

  useEffect(() => {
    if (resendIn <= 0) return undefined;

    const timer = window.setInterval(() => {
      setResendIn((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendIn]);

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Enter the email address you used to sign up.");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the six-digit code sent to your email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, code }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || data?.error || "Could not verify your email."
        );
      }

      if (!data?.token || !data?.user?.id) {
        throw new Error("The server returned an unexpected verification response.");
      }

      localStorage.setItem("footballHubToken", data.token);
      localStorage.setItem("footballHubUser", JSON.stringify(data.user));
      navigate("/", { replace: true });
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

  async function handleResend() {
    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Enter your email address first.");
      return;
    }

    setResending(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail }),
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || data?.error || "Could not resend the code."
        );
      }

      setMessage(
        data?.message ||
          "If this address needs verification, a new code will be sent."
      );
      setResendIn(60);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot reach the server. Please try again shortly."
          : err.message
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card verify-card">
        <div className="auth-logo">
          <span className="auth-logo-top">FH</span>
          <span className="auth-logo-bottom">FOOTY HUB</span>
        </div>

        <h1>Verify your email</h1>
        <p className="auth-subtitle">
          Enter the six-digit code we sent to your email address.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-info">{message}</div>}

        <form onSubmit={handleVerify}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            className="verification-code"
            type="text"
            name="code"
            placeholder="6-digit code"
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

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <button
          className="auth-secondary-button"
          type="button"
          onClick={handleResend}
          disabled={resending || resendIn > 0}
        >
          {resending
            ? "Sending..."
            : resendIn > 0
              ? `Resend code in ${resendIn}s`
              : "Resend verification code"}
        </button>

        <p className="verification-note">
          The code expires after 10 minutes. Check your spam folder if you
          cannot find the email.
        </p>

        <p className="auth-switch">
          Already verified? <Link to="/login">Log in</Link>
          {" · "}
          <Link to="/signup">Back to sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;
