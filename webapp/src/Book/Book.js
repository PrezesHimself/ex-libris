import React, { useState, useEffect } from 'react';
import './Book.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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
          <img src={storage.mediaLink} style={{ maxHeight: '80vh' }} />
        </div>
        <div>{ocr[0].description}</div>
      </div>
    </div>
  );
}

export default Book;
