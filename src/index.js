require('dotenv').config();
const express = require('express');
const app = express();
const api = require('./api');
const path = require('path');
const port = process.env.PORT || 3001;
const fallback = require('express-history-api-fallback');
const bodyParser = require('body-parser');

const cookieSession = require('cookie-session');

require('./db/index');

const root = path.resolve('public');
app.use(express.json());
app.use(express.static(root));
app.use(
  bodyParser.json({
    limit: '50mb',
  })
);

app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true,
  })
);

app.use(
  cookieSession({
    name: 'bezkoder-session',
    secret: process.env.COOKIE_SECRET, // should use as secret environment variable
    httpOnly: true,
  })
);

app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

app.use('/api', api);

app.use(fallback('index.html', { root: root }));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
