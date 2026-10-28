import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

const POSITIONS = [
  "GK", "CB", "LB", "RB", "LWB", "RWB",
  "CDM", "CM", "CAM", "LM", "RM",
  "LW", "RW", "CF", "ST",
];

function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
    gender: "",
    firstName: "",
    lastName: "",
    country: "",
    favouriteClub: "",
    favouritePlayer: "",
    favouritePosition: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.username.trim()) {
      setError("Username is required.");
      return;
    }

    const email = form.email.trim();

    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const age = Number(form.age);

    if (!form.age || age < 13 || age > 120) {
      setError("You must be between 13 and 120 years old.");
      return;
    }

    if (!form.password.trim()) {
      setError("Password is required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: form.username.trim(),
            email,
            age,
            password: form.password,
            gender: form.gender || null,
            firstName: form.firstName.trim() || null,
            lastName: form.lastName.trim() || null,
            country: form.country.trim() || null,
            favouriteClub: form.favouriteClub.trim() || null,
            favouritePlayer: form.favouritePlayer.trim() || null,
            favouritePosition: form.favouritePosition || null,
          }),
        }
      );

      const text = await response.text();

      let data;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || data?.error || "Could not create account."
        );
      }

      if (!data || typeof data !== "object" || !data.id) {
        throw new Error("The server returned an unexpected signup response.");
      }

      localStorage.setItem("footballHubUser", JSON.stringify(data));
      navigate("/");
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
    <div className="auth-page signup-page">
      <div className="auth-card signup-card">
        <div className="auth-logo">
          <span className="auth-logo-top">FH</span>
          <span className="auth-logo-bottom">FOOTY HUB</span>
        </div>

        <h1>Football Hub</h1>
        <p className="auth-subtitle">Create your account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-section-label">Account details</div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="auth-two-column">
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              min="13"
              max="120"
              required
            />

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Gender (optional)</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="auth-section-label">
            Profile details <span>(optional, can add later)</span>
          </div>

          <div className="auth-two-column">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
          />

          <input
            type="text"
            name="favouriteClub"
            placeholder="Favourite club"
            value={form.favouriteClub}
            onChange={handleChange}
          />

          <div className="auth-two-column">
            <input
              type="text"
              name="favouritePlayer"
              placeholder="Favourite player"
              value={form.favouritePlayer}
              onChange={handleChange}
            />

            <select
              name="favouritePosition"
              value={form.favouritePosition}
              onChange={handleChange}
            >
              <option value="">Favourite position</option>
              {POSITIONS.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;