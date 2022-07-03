import React, { useState, useEffect } from 'react';
import './LogIn.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

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

  const handleSubmit = async () => {
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
    <Box component="form" noValidate autoComplete="off">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          id="standard-basic"
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          variant="standard"
        />
        <br />
        <TextField
          id="standard-basic"
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          variant="standard"
        />
        <br />
        <br />
        <Button
          variant="contained"
          onClick={() => {
            handleSubmit();
          }}
        >
          Login
        </Button>
        <br />
        <br />
        <Link
          href="#"
          onClick={(event) => {
            event.preventDefault();
            window.location.href = '/signup';
          }}
        >
          sign up?
        </Link>

        <h2> {result && result}</h2>
      </form>
    </Box>
  );
}

export default LogIn;
