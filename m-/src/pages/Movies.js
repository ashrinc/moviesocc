import { useEffect, useState } from "react";

function Movies() {
  const [movies, setMovies] = useState([]); // make sure it's an array
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/movies");
        const data = await res.json();

        // Ensure backend returned an array
        if (!Array.isArray(data)) {
          console.error("Movies response:", data);
          setError("Failed to fetch movies. Invalid response from server.");
          return;
        }

        setMovies(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching movies.");
      }
    };

    fetchMovies();
  }, []);

  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>All Movies 🎬</h2>
      {movies.length === 0 ? (
        <p>No movies available</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {movies.map((movie) => (
            <li key={movie._id} style={{ margin: "10px 0" }}>
              <strong>{movie.title}</strong> ({movie.releaseYear}) - {movie.genre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Movies;
