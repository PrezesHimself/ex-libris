import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import Book from './Book/Book';
import BookCard from './BookCard/BookCard';
import LogIn from './LogIn/LogIn';
import SignUp from './SignUp/SignUp';
import Header from './Header/Header';
import { NavLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

function setUser(user) {
  sessionStorage.setItem('user', JSON.stringify(user));
  window.location.href = '/';
}

function getUser() {
  const userString = sessionStorage.getItem('user');
  const user = JSON.parse(userString);
  return user;
}

function Home({ setUser }) {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios('/api/books');
        setBooks(result.data);
      } catch (err) {
        setError('try log in ');
      }
    }
    fetchData();
  }, []);
  return (
    <div>
      <div>
        <form action="/api/upload" method="post" enctype="multipart/form-data">
          <input type="file" accept="image/*" name="photo" />
          <input type="submit" value="upload" />
        </form>
      </div>
      Search:
      <input
        onChange={(event) => {
          setSearch(event.target.value);
        }}
      />
      <div> {error && error}</div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {(books || [])
            .filter(
              (book) =>
                !search ||
                book.ocr[0].description
                  .toUpperCase()
                  .includes(search.toUpperCase())
            )
            .map((book) => {
              const { storage, title, author, isbn, year } = book;
              return (
                <Grid item xs={12} md={2}>
                  <NavLink
                    to={'book/' + book._id}
                    className={'book'}
                    key={book._id}
                  >
                    <BookCard
                      imageUrl={storage.mediaLink}
                      title={title || storage.name}
                      author={author}
                    />
                  </NavLink>
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </div>
  );
}

function App() {
  const user = getUser();

  if (!user?.loggedIn) {
    return (
      <div className="App">
        <Header user={user} setUser={setUser} />
        <Container>
          <Routes>
            <Route path="/login" element={<LogIn setUser={setUser} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<LogIn setUser={setUser} />} />
          </Routes>
        </Container>
      </div>
    );
  }

  return (
    <div className="App">
      <Header user={user} setUser={setUser} />
      <Container>
        <Routes>
          <Route path="/" element={<Home setUser={setUser} />} />
          <Route path="/book/:id" element={<Book />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
