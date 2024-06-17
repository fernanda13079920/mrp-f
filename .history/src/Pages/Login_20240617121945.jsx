import React, { useState, useContext } from "react";
import { ThemeContext } from "./App";
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { theme } = useContext(ThemeContext);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthenticated(true);
        console.log('User ID:', data.data.id);
        console.log('Role ID:', data.data.rol_id);
        console.log('Persona ID:', data.data.persona_id);
        console.log('Username:', data.data.username);
      } else {
        setMessage('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ background: theme.bgtotal, color: theme.text, padding: "20px", borderRadius: "8px" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", margin: "10px 0", padding: "10px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", margin: "10px 0", padding: "10px" }}
      />
      <button onClick={handleLogin} style={{ padding: "10px 20px" }}>Login</button>
    </div>
  );
};

export default Login;