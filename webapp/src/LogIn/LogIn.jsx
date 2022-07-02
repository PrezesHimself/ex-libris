import React, { useState, useEffect } from 'react';
import './LogIn.css';

async function loginUser(credentials) {
  return fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })
    .then(async (data) => {
      const res = await data.json();
      return { ...res, loggedIn: data.ok };
    })
    .catch(async (data) => {
      const res = await data.json();
      return res;
    });
}

function LogIn({ setUser }) {
  const [result, setResult] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = await loginUser({
      email,
      password,
    });

    if (user?.loggedIn) {
      setUser(user);
    } else {
      setResult(user?.message || 'ups!');
    }
  };
  return (
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Email</p>
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
        <div>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              window.location.href = '/signup';
            }}
          >
            sign up?
          </a>
        </div>

        <h2> {result && result}</h2>
      </form>
    </div>
  );
}

export default LogIn;
