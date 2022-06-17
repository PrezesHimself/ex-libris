const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const { readText } = require('../utils/readText')


router.use(fileUpload())
// middleware that is specific to this router
router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

router.post('/upload', async (req, res) => {
    const photo = req.files.photo;
    const uploadPath = __dirname + '/upload/' + photo.name;
    await photo.mv(uploadPath);

    const result = await readText(uploadPath);
    res.send(result);
});

router.get('/about', (req, res) => {
    res.send('About api')
});

module.exports = router;