import { useState } from "react"; // FIX: Removed unused useEffect
import { Link, Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Users from "./components/Users";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import FriendRequests from "./pages/FriendRequests";
import Friends from "./pages/Friends";
import Login from "./pages/Login";
import Movies from "./pages/Movies";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Wishlist from "./pages/Wishlist";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const [userRole, setUserRole] = useState(sessionStorage.getItem("role") || null);

  const handleLoginSuccess = (role = "user") => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    // The Dashboard component handles clearing sessionStorage
  };

  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1 style={{ color: "blue", fontSize: "2.5rem", fontWeight: "bold", textShadow: "0 0 10px #00f, 0 0 20px #0ff" }}>
          Movie Socials ✨
        </h1>
      </div>

      <Routes>
        {/* Public */}
        <Route path="/" element={!isLoggedIn ? <Home /> : <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/dashboard'} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

        {/* User */}
        <Route path="/dashboard" element={isLoggedIn && userRole === "user" ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/movies" element={isLoggedIn ? <Movies /> : <Navigate to="/login" />} />
        <Route path="/wishlist" element={isLoggedIn ? <Wishlist /> : <Navigate to="/login" />} />
        <Route path="/friends" element={isLoggedIn ? <Friends /> : <Navigate to="/login" />} />
        <Route path="/friend-requests" element={isLoggedIn ? <FriendRequests /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/users" element={isLoggedIn && userRole === "user" ? <Users token={sessionStorage.getItem("token")} /> : <Navigate to="/login" />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/admin/dashboard" element={isLoggedIn && userRole === "admin" ? <AdminDashboard handleLogout={handleLogout} /> : <Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "1.2rem",
    cursor: "pointer",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#007BFF",
    color: "white",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Link to="/login">
        <button style={buttonStyle}>Login</button>
      </Link>
      <Link to="/signup">
        <button style={{ ...buttonStyle, marginLeft: "20px" }}>Signup</button>
      </Link>
      <Link to="/admin/login">
        <button style={{ ...buttonStyle, marginLeft: "20px", backgroundColor: "darkred" }}>Admin</button>
      </Link>
    </div>
  );
}

export default App;

