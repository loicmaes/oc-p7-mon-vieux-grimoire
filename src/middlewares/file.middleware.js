module.exports = async (req, res, next) => {
  // TODO: save file and update field to an uri
  if (req.body.image) delete req.body.image;
  req.body.imageUrl = 'https://www.maesloic.fr/public/assets/images/unsplash.com.jpeg';
  next();
}
