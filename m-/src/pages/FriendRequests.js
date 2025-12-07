import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function FriendRequests() {
  // FIX: Use sessionStorage to be consistent with the rest of the app
  const token = sessionStorage.getItem("token");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetches pending friend requests from the backend
  const fetchRequests = useCallback(async () => {
    try {
      // The correct endpoint to get pending requests
      const res = await axios.get("https://moviesocc.onrender.com/api/friends/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data || []);
    } catch (err) {
      setError("Failed to fetch friend requests.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token, fetchRequests]);

  // Handles accepting a friend request
  const handleRequest = async (fromId, action) => {
    try {
      // Dynamically use the correct endpoint for accept or reject
      await axios.put(`https://moviesocc.onrender.com/api/friends/${action}-request/${fromId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh the list after an action is taken
      fetchRequests();
    } catch (err) {
      console.error(`Error ${action}ing request:`, err.response?.data || err.message);
      alert(`Could not ${action} the request. Please try again.`);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading requests...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={containerStyle}>
      <h2>Friend Requests</h2>
      {requests.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {requests.map((req) => (
            <li key={req.from._id} style={requestItemStyle}>
              <span>{req.from.username} ({req.from.email})</span>
              <div>
                <button onClick={() => handleRequest(req.from._id, 'accept')} style={buttonStyle}>Accept</button>
                <button onClick={() => handleRequest(req.from._id, 'reject')} style={{...buttonStyle, backgroundColor: '#dc3545', marginLeft: '10px'}}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no pending friend requests.</p>
      )}
    </div>
  );
}

// Styling
const containerStyle = { maxWidth: "600px", margin: "20px auto", padding: "20px", textAlign: "center" };
const requestItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '10px' };
const buttonStyle = { padding: '8px 12px', cursor: 'pointer', border: 'none', borderRadius: '5px', backgroundColor: '#28a745', color: 'white' };
