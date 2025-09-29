import axios from "axios";
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token]);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Profile</h2>
      <p><b>Username:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>

      <h3>Friends</h3>
      <ul>
        {user.friends?.length
          ? user.friends.map(f => <li key={f._id}>{f.name}</li>)
          : <p>No friends yet</p>}
      </ul>

      <h3>Wishlist</h3>
      <ul>
        {user.wishlist?.length
          ? user.wishlist.map(m => <li key={m._id}>{m.title} (Rating: {m.rating || "N/A"})</li>)
          : <p>Wishlist empty</p>}
      </ul>
    </div>
  );
}
