import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // FIX: Using sessionStorage to ensure user is logged out when tab is closed.
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("role"); // "user" or "admin"

  const handleLogout = async () => {
    try {
      // Optional but recommended: Call the backend logout endpoint.
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error communicating with backend on logout:", error);
    } finally {
      // FIX: Clearing sessionStorage instead of localStorage.
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("role");
      navigate("/"); // Redirect to the homepage
    }
  };

  const handleBack = () => {
    navigate(-1); // Go to the previous page
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Welcome {username} to your Dashboard 🎥</h2>

      <div style={{ margin: "20px" }}>
        <button onClick={handleBack} style={buttonStyle}>⬅ Back</button>
        <button onClick={handleLogout} style={buttonStyle}>Logout</button>
      </div>

      <nav style={{ marginTop: "20px" }}>
        <Link to="/movies"><button style={buttonStyle}>Movies</button></Link>
        <Link to="/wishlist"><button style={buttonStyle}>Wishlist</button></Link>
        {/* Added the "Find Users" button here */}
        <Link to="/users"><button style={buttonStyle}>Find Users</button></Link>
        <Link to="/friends"><button style={buttonStyle}>Friends</button></Link>
        <Link to="/friend-requests"><button style={buttonStyle}>Friend Requests</button></Link>
        <Link to="/profile"><button style={buttonStyle}>Profile</button></Link>

        {/* Conditionally render the "Add Movie" button only if the user is an admin */}
        {role === "admin" && (
          <Link to="/movies/add"><button style={buttonStyle}>Add Movie</button></Link>
        )}
      </nav>
    </div>
  );
}

// Consolidated and cleaned up button styles
const buttonStyle = {
  margin: "10px",
  padding: "10px 20px",
  fontSize: "1rem",
  cursor: "pointer",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#007BFF",
  color: "white",
};

export default Dashboard;