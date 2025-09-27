import { useState } from "react";
import { Link, Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FriendRequests from "./pages/FriendRequests";
import Friends from "./pages/Friends";
import Login from "./pages/Login";
import Movies from "./pages/Movies";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Wishlist from "./pages/Wishlist";

function App() {
  // Use state to manage login status, initializing from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // This function will be called by the Login component on success
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1 style={{ color: "blue", fontSize: "2.5rem", fontWeight: "bold", textShadow: "0 0 10px #00f, 0 0 20px #0ff" }}>
          Movie Socials ✨
        </h1>
      </div>

      <Routes>
        <Route path="/" element={!isLoggedIn ? <Home /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={<Signup />} />
        {/* Pass the handleLoginSuccess function as a prop to Login */}
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/friend-requests" element={<FriendRequests />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

function Home() {
  // ... Home component remains the same
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Link to="/login">
        <button style={buttonStyle}>Login</button>
      </Link>
      <Link to="/signup">
        <button style={{ ...buttonStyle, marginLeft: "20px" }}>Signup</button>
      </Link>
    </div>
  );
}

const buttonStyle = {
  // ... buttonStyle remains the same
  padding: "10px 20px",
  fontSize: "1.2rem",
  cursor: "pointer",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#007BFF",
  color: "white",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};

export default App;