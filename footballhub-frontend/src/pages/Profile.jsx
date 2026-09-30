import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("footballHubUser") || "null"
  );

  function logout() {
    localStorage.removeItem("footballHubUser");
    navigate("/login");
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <h1>{user.username}</h1>
        <p>{user.email}</p>

        <div className="profile-info">
          <div>
            <span>Username</span>
            <strong>{user.username}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
        </div>

        <button onClick={() => navigate("/")}>
          Back to Football Hub
        </button>

        <button className="logout-button" onClick={logout}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Profile;