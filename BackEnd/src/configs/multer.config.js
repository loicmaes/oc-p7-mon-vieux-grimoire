const multer = require('multer');

const MIME_TYPE = require('./enums/mimeType');

const storage = multer.memoryStorage({
  fileFilter: (req, file, callback) => {
    if (MIME_TYPE[file.mimetype]) return callback(null, true);
    callback(new Error('Only images are allowed!'));
  }
});

module.exports = multer({storage}).single('image');
