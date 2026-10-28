import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

const POSITIONS = [
  "GK", "CB", "LB", "RB", "LWB", "RWB",
  "CDM", "CM", "CAM", "LM", "RM",
  "LW", "RW", "CF", "ST",
];

function buildFormFromUser(user) {
  return {
    age: user?.age ?? "",
    gender: user?.gender || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    country: user?.country || "",
    favouriteClub: user?.favouriteClub || "",
    favouritePlayer: user?.favouritePlayer || "",
    favouritePosition: user?.favouritePosition || "",
    profilePicture: user?.profilePicture || "",
  };
}

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("footballHubUser") || "null")
  );

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(buildFormFromUser(user));
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE_URL}/users/${user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load profile.");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setForm(buildFormFromUser(data));
        localStorage.setItem("footballHubUser", JSON.stringify(data));
      })
      .catch(() => {});
  }, []);

  function logout() {
    localStorage.removeItem("footballHubUser");
    navigate("/login");
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function startEditing() {
    setForm(buildFormFromUser(user));
    setEditError("");
    setMessage("");
    setEditing(true);
  }

  function cancelEditing() {
    setForm(buildFormFromUser(user));
    setEditError("");
    setEditing(false);
  }

  async function saveProfile(e) {
    e.preventDefault();
    setEditError("");
    setSaving(true);

    try {
      const age = form.age === "" ? null : Number(form.age);

      if (form.age !== "" && (Number.isNaN(age) || age < 13 || age > 120)) {
        throw new Error("Age must be between 13 and 120.");
      }

      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age,
          gender: form.gender || null,
          firstName: form.firstName.trim() || null,
          lastName: form.lastName.trim() || null,
          country: form.country.trim() || null,
          favouriteClub: form.favouriteClub.trim() || null,
          favouritePlayer: form.favouritePlayer.trim() || null,
          favouritePosition: form.favouritePosition || null,
          profilePicture: form.profilePicture.trim() || null,
        }),
      });

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
            : data?.message || data?.error || "Could not update profile."
        );
      }

      setUser(data);
      setForm(buildFormFromUser(data));
      localStorage.setItem("footballHubUser", JSON.stringify(data));
      setMessage("Profile updated ✓");
      setEditing(false);
    } catch (err) {
      setEditError(
        err.message === "Failed to fetch"
          ? "Cannot reach the backend. Check that the server is running."
          : err.message
      );
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return null;
  }

  const displayName =
    user.firstName || user.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : user.username;

  const value = (item) => item || "Not added";

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" />
          ) : (
            user.username?.charAt(0).toUpperCase()
          )}
        </div>

        <span className="profile-kicker">FOOTBALL HUB PROFILE</span>

        <h1>{displayName}</h1>
        <p>@{user.username}</p>

        {message && !editing && (
          <div className="profile-message">{message}</div>
        )}

        {!editing ? (
          <>
            <div className="profile-info">
              <div>
                <span>Username</span>
                <strong>{value(user.username)}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{value(user.email)}</strong>
              </div>

              <div>
                <span>Age</span>
                <strong>{value(user.age)}</strong>
              </div>

              <div>
                <span>Gender</span>
                <strong>{value(user.gender)}</strong>
              </div>

              <div>
                <span>Country</span>
                <strong>{value(user.country)}</strong>
              </div>

              <div>
                <span>Favourite club</span>
                <strong>{value(user.favouriteClub)}</strong>
              </div>

              <div>
                <span>Favourite player</span>
                <strong>{value(user.favouritePlayer)}</strong>
              </div>

              <div>
                <span>Favourite position</span>
                <strong>{value(user.favouritePosition)}</strong>
              </div>
            </div>

            <button onClick={startEditing}>Edit Profile</button>

            <button onClick={() => navigate("/")}>Back to Football Hub</button>

            <button className="logout-button" onClick={logout}>
              Log Out
            </button>
          </>
        ) : (
          <form className="profile-edit-form" onSubmit={saveProfile}>
            {editError && <div className="auth-error">{editError}</div>}

            <div className="profile-section-title">Basic info</div>

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              min="13"
              max="120"
            />

            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>

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

            <input
              type="text"
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
            />

            <div className="profile-section-title">Football</div>

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
              {POSITIONS.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>

            <div className="profile-section-title">Profile picture</div>

            <input
              type="text"
              name="profilePicture"
              placeholder="Image URL"
              value={form.profilePicture}
              onChange={handleChange}
            />

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="profile-cancel-button"
              onClick={cancelEditing}
              disabled={saving}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;