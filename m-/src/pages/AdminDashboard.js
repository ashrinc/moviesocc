import { useCallback, useEffect, useState } from "react";

export default function AdminDashboard({ handleLogout }) { // Pass handleLogout for consistency
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [desc, setDesc] = useState("");
  // FIX: Reading token from sessionStorage to match the login process
  const token = sessionStorage.getItem("token");

  const fetchMovies = useCallback(async () => {
    if (!token) return; // Don't fetch if there's no token
    try {
      const res = await fetch("http://localhost:5000/api/movies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMovies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const addMovie = async () => {
    if (!title || !genre || !desc) return;
    try {
      const res = await fetch("http://localhost:5000/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, genre, description: desc, releaseYear: new Date().getFullYear() }),
      });
      if (res.ok) {
        fetchMovies();
        setTitle("");
        setGenre("");
        setDesc("");
      } else {
        const errorData = await res.json();
        console.error("Failed to add movie:", errorData.message);
        alert(`Error: ${errorData.message}`); // Show error to admin
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMovies((prevMovies) => prevMovies.filter((m) => m._id !== id));
      } else {
        const errorData = await res.json();
        console.error("Failed to delete movie:", errorData.message);
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout} style={{...buttonStyle, backgroundColor: '#6c757d'}}>Logout</button>

      <div style={{ margin: "30px 0" }}>
        <h3>Add Movie</h3>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
        <input placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} style={inputStyle} />
        <input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} style={inputStyle} />
        <button onClick={addMovie} style={buttonStyle}>Add Movie</button>
      </div>

      <h3>All Movies</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {movies.length > 0 ? movies.map((m) => (
          <li key={m._id} style={listItemStyle}>
            <b>{m.title}</b> - {m.genre} <br />
            {m.description} <br />
            <i style={{ fontSize: "0.8em", color: "#666" }}>By: {m.createdBy?.username || "admin"}</i>
            <button onClick={() => deleteMovie(m._id)} style={deleteButtonStyle}>Delete</button>
          </li>
        )) : <p>No movies found. Add one above!</p>}
      </ul>
    </div>
  );
}

// Some basic styling to make it look cleaner
const inputStyle = { margin: '5px', padding: '8px', width: '200px', borderRadius: '4px', border: '1px solid #ccc' };
const buttonStyle = { margin: '5px', padding: '8px 12px', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: 'white' };
const deleteButtonStyle = { ...buttonStyle, background: '#dc3545', marginLeft: '10px' };
const listItemStyle = { border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px auto', maxWidth: '500px' };
