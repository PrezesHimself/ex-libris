const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const { readText } = require("../utils/readText");
const { uploadFile } = require("../utils/upload");
const findISBN = require("../utils/isbn");
const { client } = require("../db/index");

const getBooksCollection = () => {
  return client.db("ex-libris").collection("books");
};

router.use(fileUpload());
// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

router.post("/upload", async (req, res) => {
  const photo = req.files.photo;
  const uploadPath = __dirname + "/upload/" + photo.name;
  await photo.mv(uploadPath);
  const storage = await uploadFile(uploadPath);
  const result = await readText(uploadPath);
  const isbn = findISBN(result);
  if (isbn.length) {
    console.log(isbn);
  }
  await getBooksCollection().insertOne({
    ocr: result,
    isbn: isbn,
    ...storage,
  });
  //res.send(result);
  res.redirect("back");
});

router.get("/books", async (req, res) => {
  const books = await getBooksCollection().find({}).toArray();
  res.send(books);
});

module.exports = router;
