const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const title = req.body.title;
    const extension = path.extname(file.originalname);
    const finalName = `${title}${extension}`;
    cb(null, finalName);
  },
});

const upload = multer({ storage });

module.exports = upload;
