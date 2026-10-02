import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("footballHubUser") || "null")
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetch(`https://football-hub-production-6005.up.railway.app/api/users/${user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load profile.");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        localStorage.setItem("footballHubUser", JSON.stringify(data));
      })
      .catch(() => {});
  }, []);

  function logout() {
    localStorage.removeItem("footballHubUser");
    navigate("/login");
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

        <button onClick={() => navigate("/")}>Back to Football Hub</button>

        <button className="logout-button" onClick={logout}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Profile;