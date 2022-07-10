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

export default function Home() {
  const [libraries, setLibraries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios('/api/libraries');
        setLibraries(result.data);
      } catch (err) {
        console.error('try log in ');
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Typography gutterBottom variant="h5" component="div">
        Libraries
      </Typography>
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {(libraries || []).map((library) => {
              const { name, _id, imageUrl } = library;
              return (
                <Grid item xs={12} md={2}>
                  <NavLink
                    to={'library/' + _id}
                    className={'library'}
                    key={_id}
                  >
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={imageUrl}
                        alt={imageUrl}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {name}
                          <NavLink
                            to={'library/edit/' + _id}
                            className={'library-new'}
                          >
                            <Button>edit</Button>
                          </NavLink>
                        </Typography>
                      </CardContent>
                    </Card>
                  </NavLink>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </div>
      <div>
        <NavLink to={'library/new'} className={'library-new'}>
          <Button>Create new</Button>
        </NavLink>
      </div>
    </>
  );
}
