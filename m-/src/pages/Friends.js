import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function Friends() {
  const token = sessionStorage.getItem("token");
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetches the user's list of friends
  const fetchFriends = useCallback(async () => {
    if (!token) {
      setError("Not authorized. Please log in.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get("http://localhost:5000/api/friends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(res.data || []);
    } catch (err) {
      setError("Failed to fetch friends list.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  // Fetches the selected friend's wishlist
  const viewWishlist = async (friendId) => {
    try {
      // This is the new backend endpoint we will need to create
      const res = await axios.get(`http://localhost:5000/api/friends/${friendId}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedFriend(friends.find(f => f._id === friendId));
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      alert("Could not fetch this friend's wishlist.");
      console.error(err);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading friends...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={containerStyle}>
      <h2>My Friends</h2>
      {friends.length > 0 ? (
        friends.map((friend) => (
          <div key={friend._id} style={friendItemStyle}>
            <span>{friend.username}</span>
            <button onClick={() => viewWishlist(friend._id)} style={buttonStyle}>
              View Wishlist
            </button>
          </div>
        ))
      ) : (
        <p>You haven't added any friends yet.</p>
      )}

      {/* Modal-like view for the selected friend's wishlist */}
      {selectedFriend && (
        <div style={wishlistContainerStyle}>
          <h3>{selectedFriend.username}'s Wishlist</h3>
          <button onClick={() => setSelectedFriend(null)} style={{...buttonStyle, backgroundColor: '#6c757d'}}>Close</button>
          {wishlist.length > 0 ? (
            wishlist.map((movie) => (
              <div key={movie._id} style={movieCardStyle}>
                <h4>{movie.title}</h4>
                <p>{movie.description}</p>
              </div>
            ))
          ) : (
            <p>{selectedFriend.username}'s wishlist is empty.</p>
          )}
        </div>
      )}
    </div>
  );
}

// Styling
const containerStyle = { maxWidth: "700px", margin: "20px auto", padding: "20px" };
const friendItemStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", borderBottom: "1px solid #eee" };
const buttonStyle = { padding: "8px 12px", cursor: "pointer", border: "none", borderRadius: "4px", backgroundColor: "#007BFF", color: "white" };
const wishlistContainerStyle = { marginTop: "30px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" };
const movieCardStyle = { borderBottom: "1px solid #ddd", paddingBottom: "10px", marginBottom: "10px" };
