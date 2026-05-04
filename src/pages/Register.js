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
    <div className="auth-container">
      <form onSubmit={register} className="auth-form">
        <h2>Register</h2>

        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Register</button>

        <p onClick={() => history.push("/login")}>
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}
