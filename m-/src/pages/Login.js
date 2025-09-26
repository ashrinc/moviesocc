import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", backgroundColor: "#000", color: "#fff", minHeight: "100vh", paddingTop: "50px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ display: "inline-block", textAlign: "left" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "8px", width: "250px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "8px", width: "250px" }}
          />
        </div>
        <button type="submit" style={buttonStyle}>Login</button>
      </form>

      <div style={{ marginTop: "20px" }}>
        <Link to="/">
          <button style={backBtnStyle}>Back</button>
        </Link>
      </div>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "1rem",
  cursor: "pointer",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#007BFF",
  color: "white",
  marginTop: "10px"
};

const backBtnStyle = {
  padding: "8px 15px",
  fontSize: "0.9rem",
  cursor: "pointer",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#6c757d",
  color: "white",
};
