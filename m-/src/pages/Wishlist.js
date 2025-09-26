import { useEffect, useState } from "react";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWishlist = async () => {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWishlist(data);
    };
    fetchWishlist();
  }, [token]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>My Wishlist</h2>
      {wishlist.map((m) => (
        <div key={m._id} style={card}>
          <h3>{m.title}</h3>
          <p>{m.description}</p>
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
