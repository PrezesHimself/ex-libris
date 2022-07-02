import React, { useState, useEffect } from 'react';
import './Book.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const scale = 0.1;
const fontScale = scale * 0.7;

function Book() {
  let { id } = useParams();
  const [book, setBook] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await axios('/api/book/' + id);

      setBook(result.data);
    }
    fetchData();
  }, []);

  const updateBookInput = (key) => (event) => {
    setBook({
      ...book,
      [key]: event.target.value,
    });
  };

  if (!book) return <div>loading</div>;
  const { storage, ocr } = book;
  return (
    <div>
      book {id}
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
          <input
            onChange={updateBookInput('isbn')}
            type="text"
            value={book.isbn}
          />
        </div>
        <div>
          year
          <input
            onChange={updateBookInput('year')}
            type="text"
            value={book.year}
          />
        </div>
        <button
          onClick={async () => {
            const result = await axios.patch('/api/book/' + id, book);
          }}
        >
          update
        </button>
      </div>
    </div>
  );
}

export default Book;
