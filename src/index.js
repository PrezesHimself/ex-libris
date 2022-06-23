require('dotenv').config();
const express = require('express');
const app = express();
const api = require('./api');
const path = require('path');
const port = process.env.PORT || 3001;
require('./db/index');

app.use(express.static(path.resolve('public')));
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

app.use('/api', api);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
