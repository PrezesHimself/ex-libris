const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const { readText } = require('../utils/readText');
const { uploadFile } = require('../utils/upload');
const { mongoose } = require('../db/index');
const ObjectId = require('mongodb').ObjectId;
const { User, Role } = require('../db/models');
const authRoutes = require('./auth.routes');
const { authJwt } = require('../middleware/index');

const getBooksCollection = () => {
  return mongoose.connection.getClient().db('ex-libris').collection('books');
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

router.get('/books', [authJwt.verifyToken], async (req, res) => {
  const books = await getBooksCollection().find({}).toArray();
  res.send(books);
});

router.get('/book/:bookId', [authJwt.verifyToken], async (req, res) => {
  const book = await getBooksCollection().findOne({
    _id: new ObjectId(req.params.bookId),
  });
  res.send(book);
});

router.get('/users', [authJwt.verifyToken], async (req, res) => {
  await new User({ name: 'test' }).save();
  const users = await User.find();
  res.send(users);
});

router.get('/roles', async (req, res) => {
  const roles = await Role.find();
  res.send(roles);
});

router.use('/auth', authRoutes);

router.patch('/book/:bookId', async (req, res) => {
  const { body } = req;
  var { _id, ...omitted } = body;
  const book = await getBooksCollection().updateOne(
    {
      _id: new ObjectId(req.params.bookId),
    },
    {
      $set: omitted,
    }
  );
  res.send(book);
});

module.exports = router;
