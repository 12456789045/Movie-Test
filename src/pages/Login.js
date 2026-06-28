import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/";
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url('/movies-background.png')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <form onSubmit={login} className="auth-form">
        <div className="auth-logo-card">
          <img src="/mic-logo.png" alt="MIC Logo" className="auth-logo" />
        </div>
        <h2>Login</h2>
        <p className="auth-subtitle">
          Welcome back. Enter your login name and password.
        </p>

        {error && (
          <div style={{ color: "#ff4d4d", marginBottom: "15px" }}>{error}</div>
        )}

        <input
          type="email"
          placeholder="Login Name"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p onClick={() => history.push("/register")}>Create Account</p>
      </form>
    </div>
  );
}
