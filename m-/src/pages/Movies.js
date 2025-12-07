import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function Movies() {
  const token = sessionStorage.getItem("token");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for the rating modal
  const [ratingMovie, setRatingMovie] = useState(null);
  const [currentRating, setCurrentRating] = useState(0);
  const [review, setReview] = useState("");

  const fetchMovies = useCallback(async () => {
    try {
      const res = await axios.get("https://moviesocc.onrender.com/api/movies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies(res.data || []);
    } catch (err) {
      setError("Failed to fetch movies. Please try again later.");
      console.error("Fetch Movies Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchMovies();
  }, [token, fetchMovies]);

  const addToWishlist = async (movieId) => {
    try {
      await axios.post(`https://moviesocc.onrender.com/api/wishlist/${movieId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Added to wishlist!");
    } catch (err) {
      console.error("Wishlist Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error adding to wishlist");
    }
  };

  const submitRating = async (e) => {
    e.preventDefault();
    if (currentRating === 0) {
      alert("Please select a star rating.");
      return;
    }
    try {
      // ✅ CORRECTED URL: The movie ID comes before "/rate"
      await axios.post(
        `https://moviesocc.onrender.com/api/ratings/${ratingMovie._id}/rate`,
        { rating: currentRating, review: review },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rating submitted successfully!");
      setRatingMovie(null);
      setCurrentRating(0);
      setReview("");
      fetchMovies(); // Refresh movies to show new average rating
    } catch (err) {
      // This is the error you were seeing in the console
      console.error("Error submitting rating:", err);
      alert(err.response?.data?.message || "Error submitting rating.");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading movies...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={containerStyle}>
      <h2>Browse Movies</h2>
      {movies.map((movie) => (
        <div key={movie._id} style={movieCardStyle}>
          <h3>{movie.title} ({movie.releaseYear})</h3>
          <p>{movie.description}</p>
          <p style={{ fontStyle: "italic", color: "#555" }}>Genre: {movie.genre}</p>
          <p>
            {movie.avgRating
              ? `Average Rating: ${movie.avgRating.toFixed(1)} ⭐`
              : "Be the first to rate this movie!"}
          </p>
          <div>
            <button onClick={() => addToWishlist(movie._id)} style={buttonStyle}>Add to Wishlist</button>
            <button onClick={() => setRatingMovie(movie)} style={{ ...buttonStyle, marginLeft: '10px', backgroundColor: '#28a745' }}>Rate Movie</button>
          </div>
        </div>
      ))}

      {ratingMovie && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h4>Rate: {ratingMovie.title}</h4>
            <form onSubmit={submitRating}>
              <div style={{ marginBottom: "15px" }}>
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <span key={starValue} onClick={() => setCurrentRating(starValue)} style={{ cursor: 'pointer', fontSize: '2rem', color: starValue <= currentRating ? '#ffc107' : '#e4e5e9' }}>
                      ★
                    </span>
                  );
                })}
              </div>
              <textarea
                placeholder="Write an optional review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                style={{ width: '95%', padding: '10px', minHeight: '80px', marginBottom: '15px' }}
              />
              <div>
                <button type="submit" style={buttonStyle}>Submit</button>
                <button type="button" onClick={() => setRatingMovie(null)} style={{ ...buttonStyle, marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Styling
const containerStyle = { maxWidth: "800px", margin: "20px auto", padding: "20px" };
const movieCardStyle = { boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", padding: "20px", marginBottom: "20px" };
const buttonStyle = { padding: "10px 15px", cursor: "pointer", border: "none", borderRadius: "5px", backgroundColor: "#007BFF", color: "white", fontSize: "16px" };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '500px' };

