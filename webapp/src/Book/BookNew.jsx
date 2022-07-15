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
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const scale = 0.1;
const fontScale = scale * 0.7;

function NewBook() {
  let { libraryId } = useParams();
  const [userLibraries, setUserLibraries] = useState(null);
  const [book, setBook] = useState({
    library: libraryId,
  });
  const [coverPhoto, setCoverPhoto] = useState(null);

  async function handleTakePhoto(dataUri) {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    const result = await axios.post(
      '/api/uploadPhoto',
      {
        dataUri,
      },
      config
    );
    setCoverPhoto(result.data.storage.mediaLink);
    setBook({
      ...book,
      ocr: result.data.ocr,
      storage: result.data.storage,
    });
  }

  const handleChange = (event) => {
    setBook({
      ...book,
      library: event.target.value,
    });
  };

  useEffect(async () => {
    const libraries = await axios('/api/libraries');

    setUserLibraries(libraries.data);
  }, []);

  const { storage = {}, ocr = [[]], library, isbn } = book;
  return (
    <div>
      <div> </div>
      {!coverPhoto ? (
        <Camera
          onTakePhoto={(dataUri) => {
            handleTakePhoto(dataUri);
          }}
        />
      ) : (
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
      )}
      book {isbn}
      <div key={book._id}>
        <h3>{storage.name}</h3>
        <div>{ocr[0].description}</div>
      </div>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="library">Library</InputLabel>
          <Select
            labelId="library"
            id="library"
            value={libraryId}
            label="Library"
            onChange={handleChange}
          >
            {(userLibraries || []).map((userLibrary) => (
              <MenuItem value={userLibrary._id}>{userLibrary.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <div>
        <Button
          onClick={async () => {
            const result = await axios.post('/api/book/new', book);
            console.log(result);
          }}
        >
          Add book
        </Button>
      </div>
    </div>
  );
}

export default NewBook;
