require('dotenv').config();
const express = require('express');
const app = express();
const api = require('./api');
const path = require('path');
const port = process.env.PORT || 3001;
require('./db/index');

app.use(express.static(path.join(__dirname, 'webapp', 'public')));
app.get('/', (req, res) => {
  res.sendFile('webapp/public/index.html', { root: __dirname });
});

app.use('/api', api);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
