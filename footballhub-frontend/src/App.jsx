import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import SquadBuilder from "./pages/SquadBuilder";
import SquadBattle from "./pages/SquadBattle";
import FootballImposter from "./pages/FootballImposter";
import FootballAlphabet from "./pages/FootballAlphabet";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("footballHubUser");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

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
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;