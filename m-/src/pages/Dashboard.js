import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role"); // "user" or "admin"

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/"); // redirect to home
  };

  const handleBack = () => {
    navigate(-1); // go back
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Welcome {username} to your Dashboard 🎥</h2>

      <div style={{ margin: "20px" }}>
        <button onClick={handleBack} style={blueBtn}>⬅ Back</button>
        <button onClick={handleLogout} style={blueBtn}>Logout</button>
      </div>

      <nav style={{ marginTop: "20px" }}>
        <Link to="/movies"><button style={blueBtn}>Movies</button></Link>
        <Link to="/wishlist"><button style={blueBtn}>Wishlist</button></Link>
        <Link to="/friends"><button style={blueBtn}>Friends</button></Link>
        <Link to="/friend-requests"><button style={blueBtn}>Friend Requests</button></Link>
        <Link to="/profile"><button style={blueBtn}>Profile</button></Link>

        {role === "admin" && (
          <Link to="/movies/add"><button style={blueBtn}>Add Movie</button></Link>
        )}
      </nav>
    </div>
  );
}

const blueBtn = {
  margin: "10px",
  padding: "10px 15px",
  borderRadius: "6px",
  border: "none",
  background: "#007BFF",
  color: "white",
  cursor: "pointer",
};

export default Dashboard;
