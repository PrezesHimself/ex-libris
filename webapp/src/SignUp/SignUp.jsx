import React, { useState, useEffect } from 'react';
import './SignUp.css';

async function signUp(credentials) {
  return fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

function LogIn() {
  const [result, setResult] = useState();
  const [password, setPassword] = useState();
  const [username, setUserName] = useState();
  const [email, setEmail] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await signUp({
        email,
        username,
        password,
      });
      setResult(result.message);
    } catch (err) {
      setResult(err.message);
    }
  };
  return (
    <div className="signup-wrapper">
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </label>
        <label>
          <p>email</p>
          <input type="email" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
        <div>{result && result}</div>
      </form>
    </div>
  );
}

export default LogIn;
