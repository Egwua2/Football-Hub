import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import SquadBuilder from "./pages/SquadBuilder";
import SquadBattle from "./pages/SquadBattle";
import FootballImposter from "./pages/FootballImposter";
import FootballAlphabet from "./pages/FootballAlphabet";
import FootballWhoAmI from "./pages/FootballWhoAmI";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("footballHubUser");
  const token = localStorage.getItem("footballHubToken");

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AuthRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    function handleExpiredSession() {
      navigate("/login", { replace: true });
    }

    window.addEventListener("footballHub:authExpired", handleExpiredSession);

    return () => {
      window.removeEventListener("footballHub:authExpired", handleExpiredSession);
    };
  }, [navigate]);

  return null;
}

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("footballHubTheme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("footballHubTheme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <BrowserRouter>
      <AuthRedirectHandler />

      <div className="app-wrapper">
        <div className="app-content">
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/squad-builder"
              element={
                <ProtectedRoute>
                  <SquadBuilder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/squad-battle"
              element={
                <ProtectedRoute>
                  <SquadBattle />
                </ProtectedRoute>
              }
            />

            <Route
              path="/football-imposter"
              element={
                <ProtectedRoute>
                  <FootballImposter />
                </ProtectedRoute>
              }
            />

            <Route
              path="/football-alphabet"
              element={
                <ProtectedRoute>
                  <FootballAlphabet />
                </ProtectedRoute>
              }
            />

            <Route
              path="/football-who-am-i"
              element={
                <ProtectedRoute>
                  <FootballWhoAmI />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <footer className="site-footer">
          Made by <strong>ΞGW∪Λ2📈💎</strong>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
