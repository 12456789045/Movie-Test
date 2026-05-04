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
    <div className="auth-container">
      <form onSubmit={login} className="auth-form">
        <h2>Login</h2>

        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}

        <input
          type="email"
          placeholder="Email"
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
