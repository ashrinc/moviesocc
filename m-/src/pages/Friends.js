import { useEffect, useState } from "react";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFriends = async () => {
      const res = await fetch("http://localhost:5000/api/friends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFriends(data);
    };
    fetchFriends();
  }, [token]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>My Friends</h2>
      {friends.map((f) => (
        <div key={f._id} style={card}>
          <h3>{f.username}</h3>
          <p>{f.email}</p>
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
