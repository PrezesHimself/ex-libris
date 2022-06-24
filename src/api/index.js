const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const { readText } = require('../utils/readText');
const { uploadFile } = require('../utils/upload');
const { client } = require('../db/index');
const ObjectId = require('mongodb').ObjectId;

const getBooksCollection = () => {
  return client.db('ex-libris').collection('books');
};

router.use(fileUpload());
// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

router.post('/upload', async (req, res) => {
  const photo = req.files.photo;
  const uploadPath = __dirname + '/upload/' + photo.name;
  await photo.mv(uploadPath);
  const storage = await uploadFile(uploadPath);
  const result = await readText(uploadPath);

  await getBooksCollection().insertOne({
    ocr: result,
    ...storage,
  });
  res.send(result);
});

router.get('/books', async (req, res) => {
  const books = await getBooksCollection().find({}).toArray();
  res.send(books);
});

router.get('/book/:bookId', async (req, res) => {
  const book = await getBooksCollection().findOne({
    _id: new ObjectId(req.params.bookId),
  });
  res.send(book);
});

router.patch('/book/:bookId', async (req, res) => {
  const {body} = req;
  var { _id, ...omitted } = body;
  const book = await getBooksCollection().updateOne({
    _id: new ObjectId(req.params.bookId)
  }, {
    $set: omitted
  });
  res.send(book);
});

module.exports = router;
