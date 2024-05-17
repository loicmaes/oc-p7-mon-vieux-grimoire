const sharp = require('sharp');

module.exports = async (req, res, next) => {
  try {
    if (!req.file) next();

    const { buffer, originalname } = req.file;
    const filename = originalname.split(' ').join('_');
    const filenameArray = filename.split('.');
    filenameArray.pop();
    const filenameWithoutExtension = filenameArray.join('.');
    const filePath = `${filenameWithoutExtension}_${Date.now()}.webp`;

    const path = `images/${filePath}`;

    await sharp(buffer)
        .resize(1024)
        .webp({
          quality: 90,
        })
        .toFile(`./${path}`);
    req.body.imageUrl = `${req.protocol}://${req.get('host')}/${path}` ?? undefined;

    next();
  } catch (e) {
    return res.status(500).json({
      message: 'Something went wrong!',
      error: e,
    });
  }
}
