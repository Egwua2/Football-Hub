import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("footballHubUser") || "null"
  );

  function logout() {
    localStorage.removeItem("footballHubUser");
    setProfileOpen(false);
    navigate("/login");
  }

  return (
    <main className="home-page">

      <header className="home-header">

        <div className="profile-menu">
          <button
            className="profile-trigger"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <span className="profile-trigger-avatar">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </span>

            <span className="profile-trigger-name">
              {user?.username || "User"}
            </span>

            <span className="profile-arrow">
              {profileOpen ? "▲" : "▼"}
            </span>
          </button>

          {profileOpen && (
            <div className="profile-dropdown">

              <div className="profile-dropdown-user">
                <div className="profile-dropdown-avatar">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>

                <div>
                  <strong>{user?.username || "User"}</strong>
                  <span>{user?.email || ""}</span>
                </div>
              </div>

              <div className="profile-dropdown-divider" />

              <Link
                to="/profile"
                className="profile-dropdown-item"
                onClick={() => setProfileOpen(false)}
              >
                <span>👤</span>
                Profile
              </Link>

              <button
                className="profile-dropdown-item logout-menu-item"
                onClick={logout}
              >
                <span>🚪</span>
                Log Out
              </button>

            </div>
          )}
        </div>

      </header>

      <section className="hero">
        <div className="hero-content">

          <span className="hero-badge">FOOTBALL HUB</span>

          <h1>
            Build. Battle.
            <span> Play.</span>
          </h1>

          <p>
            Create your dream squad, challenge your friends, prove your
            football knowledge and enjoy football games built around the
            way you play.
          </p>

          <div className="hero-buttons">

            <Link to="/squad-builder" className="primary-button">
              Build Your Squad
            </Link>

            <Link to="/squad-battle" className="secondary-button">
              Squad Battle
            </Link>

            <Link to="/football-imposter" className="secondary-button">
              Football Imposter
            </Link>

            <Link to="/football-alphabet" className="secondary-button">
              Football Alphabet
            </Link>

            <Link to="/football-who-am-i" className="secondary-button">
              Football Who Am I
            </Link>

          </div>

        </div>

        <div className="hero-mark" aria-hidden="true">
          <span className="hero-mark-top">FH</span>
          <span className="hero-mark-bottom">FOOTY HUB</span>
        </div>

      </section>

      <section className="features">

        <div className="section-heading">
          <span>WHAT'S INSIDE</span>
          <h2>Your Football Playground</h2>
        </div>

        <div className="feature-grid">

          <Link to="/squad-builder" className="feature-card">
            <div className="feature-icon">🏟️</div>
            <h3>Squad Builder</h3>
            <p>
              Build your perfect XI with different formations and players.
            </p>
            <span>Build Squad →</span>
          </Link>

          <Link to="/squad-battle" className="feature-card">
            <div className="feature-icon">⚔️</div>
            <h3>Squad Battle</h3>
            <p>
              Build squads against other players and decide the winner.
            </p>
            <span>Enter Battle →</span>
          </Link>

          <Link to="/football-imposter" className="feature-card">
            <div className="feature-icon">🕵️</div>
            <h3>Football Imposter</h3>
            <p>
              Find the imposter before they figure out the secret footballer.
            </p>
            <span>Play Imposter →</span>
          </Link>

          <Link to="/football-alphabet" className="feature-card">
            <div className="feature-icon">🔤</div>
            <h3>Football Alphabet</h3>
            <p>
              Race the clock and name footballers for every letter.
            </p>
            <span>Play Alphabet →</span>
          </Link>

          <Link to="/football-who-am-i" className="feature-card">
            <div className="feature-icon">❓</div>
            <h3>Football Who Am I</h3>
            <p>
              Guess the mystery footballer using clues before the others do.
            </p>
            <span>Play Who Am I →</span>
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Home;