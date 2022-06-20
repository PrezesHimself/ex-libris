import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      const result = await axios('/api/books');

      setBooks(result.data);
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <form action="/api/upload" method="post" enctype="multipart/form-data">
          <input type="file" accept="image/*" name="photo" />
          <input type="submit" value="upload" />
        </form>
        Search:
        <input
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
        <div>
          {(books || [])
            .filter(
              (book) =>
                !search ||
                book.ocr[0].description
                  .toUpperCase()
                  .includes(search.toUpperCase())
            )
            .map((book) => {
              const { storage } = book;
              return (
                <div key={book._id}>
                  <h3>{storage.name}</h3>
                  <img src={storage.mediaLink} height={100} />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: book.ocr[0].description.replace(
                        new RegExp(`(${search})`, 'ig'),
                        '<strong>$1</strong>'
                      ),
                    }}
                  />
                </div>
              );
            })}
        </div>
      </header>
    </div>
  );
}

export default App;
