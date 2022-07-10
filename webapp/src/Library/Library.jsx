import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

export default function Library() {
  let { id } = useParams();
  const [library, setLibrary] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios('/api/libraries/' + id);
      const books = await axios('/api/books/' + id);
      setLibrary(result.data);
      setBooks(books.data);
    }
    fetchData();
  }, []);

  if (!library)
    return (
      <Typography gutterBottom variant="h5" component="div">
        Loading
      </Typography>
    );
  const { name } = library;
  return (
    <>
      <Typography gutterBottom variant="h5" component="div">
        Library {name}
      </Typography>
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {books.map((book) => {
              const { name, _id, storage } = book;
              return (
                <Grid item xs={12} md={2}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={storage.mediaLink}
                      alt={storage.mediaLink}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {name}
                        <NavLink
                          to={'/book/edit/' + _id}
                          className={'edit book'}
                        >
                          <Button>edit</Button>
                        </NavLink>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </div>
      <div>
        <Button>Add book</Button>
      </div>
    </>
  );
}
