import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';
import Book from './Book/Book';
import { NavLink } from 'react-router-dom';

function Home() {
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
        <form
          action="api/auth/signin"
          method="post"
          enctype="multipart/form-data"
        >
          <label for="username">
            <b>Username</b>
          </label>
          <input
            type="text"
            placeholder="Enter Username"
            name="username"
            required
          ></input>

          <label for="password">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            required
          ></input>
          <button type="login"> login </button>
        </form>
      </div>
      <div>
        <form
          action="api/auth/signout"
          method="post"
          enctype="multipart/form-data"
        >
          <button type="login"> logout </button>
        </form>
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
      <div style={{ padding: 10, margin: 'auto' }}>
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
              <NavLink
                to={'book/' + book._id}
                className={'book'}
                key={book._id}
              >
                <img className={'book__image'} src={storage.mediaLink} />
                <div className={'book__description'}>
                  <h3>title: {title || storage.name}</h3>
                  <h3>author: {author}</h3>
                  <h3>isbn: {isbn}</h3>
                  <h3>year: {year}</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: book.ocr[0].description.replace(
                        new RegExp(`(${search})`, 'ig'),
                        '<strong style="background: yellow">$1</strong>'
                      ),
                    }}
                  />
                </div>
              </NavLink>
            );
          })}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">Ex-librix</header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<Book />} />
      </Routes>
    </div>
  );
}

export default App;
