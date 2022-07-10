import React, { useState, useEffect } from 'react';
import './Book.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';

const scale = 0.1;
const fontScale = scale * 0.7;

function Book() {
  let { id } = useParams();
  const [book, setBook] = useState(null);
  const [userLibraries, setUserLibraries] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await axios('/api/book/' + id);
      const libraries = await axios('/api/libraries');

      setBook(result.data);
      setUserLibraries(libraries.data);
    }
    fetchData();
  }, []);

  const handleChange = (event) => {
    setBook({
      ...book,
      library: event.target.value,
    });
  };

  const updateBookInput = (key) => (event) => {
    setBook({
      ...book,
      [key]: event.target.value,
    });
  };

  if (!book) return <div>loading</div>;
  const { storage, ocr, library, isbn } = book;
  return (
    <div>
      book {id} {isbn}
      <div key={book._id}>
        <h3>{storage.name}</h3>
        <div>
          editing {editing}
          <div
            style={{
              height: 4000 * scale,
              width: 1800 * scale,
              backgroundImage: 'url(' + storage.mediaLink + ')',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              margin: 'auto',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          >
            {ocr.slice(1).map((thisOcr) => {
              book[editing] = book[editing] || '';
              return (
                <div
                  onClick={() => {
                    if (!editing) {
                      return;
                    }
                    setBook({
                      ...book,
                      [editing]: (book[editing] += ' ' + thisOcr.description),
                    });
                  }}
                  style={{
                    border: '3px solid rgba(255,255,255,.2)',
                    background: 'rgba(0,0,0,.7)',
                    position: 'absolute',
                    display: 'flex',
                    color: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize:
                      (Math.max.apply(
                        this,
                        thisOcr.boundingPoly.vertices.map((item) => item.y)
                      ) -
                        Math.min.apply(
                          this,
                          thisOcr.boundingPoly.vertices.map((item) => item.y)
                        )) *
                      fontScale,
                    top:
                      Math.min.apply(
                        this,
                        thisOcr.boundingPoly.vertices.map((item) => item.y)
                      ) * scale,
                    left:
                      Math.min.apply(
                        this,
                        thisOcr.boundingPoly.vertices.map((item) => item.x)
                      ) * scale,
                    width:
                      (Math.max.apply(
                        this,
                        thisOcr.boundingPoly.vertices.map((item) => item.x)
                      ) -
                        Math.min.apply(
                          this,
                          thisOcr.boundingPoly.vertices.map((item) => item.x)
                        )) *
                      scale,

                    height:
                      (Math.max.apply(
                        this,
                        thisOcr.boundingPoly.vertices.map((item) => item.y)
                      ) -
                        Math.min.apply(
                          this,
                          thisOcr.boundingPoly.vertices.map((item) => item.y)
                        )) *
                      scale,
                  }}
                >
                  {thisOcr.description}
                </div>
              );
            })}
          </div>
        </div>
        <div>{ocr[0].description}</div>
      </div>
      <div>
        <div>
          title
          <input
            onChange={updateBookInput('title')}
            type="text"
            value={book.title || storage.name}
          />
          <button
            onClick={() => {
              setEditing('title');
            }}
          >
            add from image
          </button>
        </div>
        <div>
          author
          <input
            onChange={updateBookInput('author')}
            type="text"
            value={book.author}
          />
          <button
            onClick={() => {
              setEditing('author');
            }}
          >
            add from image
          </button>
        </div>
        <div>
          ISBN
          <TextField
            onChange={updateBookInput('isbn')}
            type="text"
            value={isbn}
          />
          <Button
            onClick={async () => {
              try {
                const results = await axios(
                  'https://www.googleapis.com/books/v1/volumes?q=isbn:' +
                    book.isbn
                );
                const {
                  title,
                  authors,
                  publishedDate,
                } = results.data.items[0].volumeInfo;
                setBook({
                  ...book,
                  title,
                  author: authors.join(''),
                  year: publishedDate,
                });
              } catch (error) {
                console.log(error);
              }
            }}
          >
            read ISBN
          </Button>
        </div>
        <div>
          year
          <input
            onChange={updateBookInput('year')}
            type="text"
            value={book.year}
          />
        </div>
        <div>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="library">Library</InputLabel>
              <Select
                labelId="library"
                id="library"
                value={library}
                label="Library"
                onChange={handleChange}
              >
                {(userLibraries || []).map((userLibrary) => (
                  <MenuItem value={userLibrary._id}>
                    {userLibrary.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <Button
          onClick={async () => {
            const result = await axios.patch('/api/book/' + id, book);
          }}
        >
          update
        </Button>
      </div>
    </div>
  );
}

export default Book;
