import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const register = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });

      alert("Registered successfully");
      history.push("/login");
    } catch {
      alert("Registration failed");
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
      <form onSubmit={register} className="auth-form">
        <div className="auth-logo-card">
          <img src="/mic-logo.png" alt="MIC Logo" className="auth-logo" />
        </div>
        <h2>Register</h2>
        <p className="auth-subtitle">
          Create your account and start saving your favorite movies.
        </p>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <button type="submit">Register</button>

        <p onClick={() => history.push("/login")}>
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}
