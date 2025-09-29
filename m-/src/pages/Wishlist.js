import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function Wishlist() {
  const token = sessionStorage.getItem("token");
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setError("Not authorized. Please log in.");
      setLoading(false);
      return;
    }
    try {
      // This endpoint should return the user's profile, including the populated wishlist
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Ensure the wishlist data is an array before setting it
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err.response || err);
      setError("Failed to fetch your wishlist.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading your wishlist...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={containerStyle}>
      <h2>My Wishlist</h2>
      {wishlist.length > 0 ? (
        wishlist.map((movie) => (
          <div key={movie._id} style={movieCardStyle}>
            <h3>{movie.title}</h3>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p>{movie.description}</p>
          </div>
        ))
      ) : (
        <p>Your wishlist is empty. Add some movies!</p>
      )}
    </div>
  );
}

// Styling
const containerStyle = {
  maxWidth: "800px",
  margin: "20px auto",
  padding: "20px",
};

const movieCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
};
