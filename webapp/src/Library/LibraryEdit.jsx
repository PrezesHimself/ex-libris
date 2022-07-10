import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function LibraryEdit({ isNew }) {
  let { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    if (isNew) return;

    async function fetchData() {
      const { data } = await axios('/api/libraries/' + id);
      setName(data.name);
      setImageUrl(data.imageUrl);
    }
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (isNew) {
      await axios.post('/api/libraries/new', {
        name,
        imageUrl,
      });
      navigate('..', { replace: true });
    } else {
      await axios.patch('/api/libraries/edit/' + id, {
        name,
        imageUrl,
      });
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <h1>{isNew ? 'New Library' : 'Edit Library'}</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          id="standard-basic"
          onChange={(event) => setName(event.target.value)}
          label="Name"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          value={name}
        />
        <br />
        <TextField
          id="standard-basic"
          onChange={(event) => setImageUrl(event.target.value)}
          label="Image"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          value={imageUrl}
        />
        <br />
        <br />
        <Button
          variant="contained"
          onClick={() => {
            handleSubmit();
          }}
        >
          save
        </Button>
        <br />
      </form>
    </Box>
  );
}

export default LibraryEdit;
