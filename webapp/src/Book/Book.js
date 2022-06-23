import React, { useState, useEffect } from 'react';
import './Book.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const scale = 0.1;
const fontScale = scale * 0.7;

function Book() {
  let { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await axios('/api/book/' + id);

      setBook(result.data);
    }
    fetchData();
  }, []);

  if (!book) return <div>loading</div>;
  const { storage, ocr } = book;
  return (
    <div>
      book {id}
      <div key={book._id}>
        <h3>{storage.name}</h3>
        <div>
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
              return (
                <div
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
    </div>
  );
}

export default Book;
