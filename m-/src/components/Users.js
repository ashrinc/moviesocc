import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function Users() {
  // FIX: Get the token from sessionStorage to match the rest of the app
  const token = sessionStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setError("Not authorized. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get("https://moviesocc.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users. The backend might be down.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const sendRequest = async (id) => {
    try {
      // NOTE: This route is different from your friends route. Ensure it's correct.
      await axios.post(`https://moviesocc.onrender.com/api/friends/send-request/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Friend request sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending request");
    }
  };

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <h2>Find Users</h2>
      <input
        type="text"
        placeholder="Search by username..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={inputStyle}
      />
      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(u => (
              <li key={u._id} style={listItemStyle}>
                <span>{u.username} ({u.email})</span>
                <button onClick={() => sendRequest(u._id)} style={buttonStyle}>
                  Add Friend
                </button>
              </li>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </ul>
      )}
    </div>
  );
}

// Styling
const containerStyle = {
  textAlign: "center",
  maxWidth: "600px",
  margin: "20px auto",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
};

const inputStyle = {
  width: "80%",
  padding: "10px",
  marginBottom: "20px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "1rem"
};

const listItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px",
  borderBottom: "1px solid #eee",
};

const buttonStyle = {
  padding: "8px 12px",
  cursor: "pointer",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#28a745",
  color: "white",
};
