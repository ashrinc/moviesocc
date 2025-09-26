import { useEffect, useState } from "react";

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await fetch("http://localhost:5000/api/friends/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data);
    };
    fetchRequests();
  }, [token]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Friend Requests</h2>
      {requests.map((r) => (
        <div key={r._id} style={card}>
          <h3>{r.from.username}</h3>
          <p>{r.from.email}</p>
          <p>Status: {r.status}</p>
        </div>
      ))}
    </div>
  );
}

const card = {
  border: "1px solid #ccc",
  borderRadius: "6px",
  padding: "10px",
  margin: "10px auto",
  width: "60%",
};
