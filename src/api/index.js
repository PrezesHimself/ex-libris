const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const { readText } = require('../utils/readText');
const { uploadFile } = require('../utils/upload');
const { mongoose } = require('../db/index');
const ObjectId = require('mongodb').ObjectId;
const { User, Role, Library } = require('../db/models');
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

router.get('/books/:libraryId', [authJwt.verifyToken], async (req, res) => {
  const books = await getBooksCollection()
    .find({
      library: ObjectId(req.params.libraryId),
    })
    .toArray();
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

router.get('/libraries', async (req, res) => {
  const library = await Library.find();
  res.send(library);
});

router.get('/libraries/:libraryId', async (req, res) => {
  const library = await Library.findOne({
    _id: req.params.libraryId,
  });
  res.send(library);
});

router.post('/libraries/new', async (req, res) => {
  const { body } = req;
  await new Library(body).save();
  res.send(body);
});

router.patch('/libraries/edit/:libraryId', async (req, res) => {
  const { body } = req;
  const { _id, ...omitted } = body;
  const library = await Library.findOneAndUpdate(
    {
      _id: req.params.libraryId,
    },
    omitted
  );

  res.send({ ...library, ...omitted });
});

router.use('/auth', authRoutes);

router.patch('/book/:bookId', async (req, res) => {
  const { body } = req;
  const { _id, ...omitted } = body;
  const book = await getBooksCollection().updateOne(
    {
      _id: new ObjectId(req.params.bookId),
    },
    {
      $set: {
        ...omitted,
        library: ObjectId(omitted.library),
      },
    }
  );
  res.send(book);
});

module.exports = router;
