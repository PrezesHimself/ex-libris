const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const router = express.Router();
const api = require('./api');
const port = process.env.PORT || 3001;

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
    res.sendFile('webapp/public/index.html', {root: __dirname })
});

app.use('/api', api);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));