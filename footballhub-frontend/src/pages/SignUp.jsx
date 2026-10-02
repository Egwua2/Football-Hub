import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    age: "",
    gender: "",
    firstName: "",
    lastName: "",
    country: "",
    favouriteClub: "",
    favouritePlayer: "",
    favouritePosition: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e) {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.age || Number(form.age) < 1 || Number(form.age) > 120) {
      setError("Enter a valid age.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://football-hub-production-6005.up.railway.app/api/users/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            email: form.email,
            age: form.age,
            gender: form.gender,
            firstName: form.firstName,
            lastName: form.lastName,
            country: form.country,
            favouriteClub: form.favouriteClub,
            favouritePlayer: form.favouritePlayer,
            favouritePosition: form.favouritePosition,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not create account.");
      }

      localStorage.setItem("footballHubUser", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
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

          <input
            type="number"
            name="age"
            placeholder="Age"
            min="1"
            max="120"
            value={form.age}
            onChange={handleChange}
            required
          />

          <div className="auth-section-label">
            About you <span>Optional</span>
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

          <div className="auth-two-column">
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>

            <input
              type="text"
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="favouriteClub"
            placeholder="Favourite club"
            value={form.favouriteClub}
            onChange={handleChange}
          />

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
            <option value="GK">GK</option>
            <option value="Defender">Defender</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Winger">Winger</option>
            <option value="Forward">Forward</option>
          </select>

          <div className="auth-section-label">Security</div>

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