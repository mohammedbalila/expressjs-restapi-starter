const path = require('path');
const multer = require('multer');

/**
 * @description a file upload service
 * you can find more at https://www.npmjs.com/package/multer
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../media'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
module.exports = upload;
