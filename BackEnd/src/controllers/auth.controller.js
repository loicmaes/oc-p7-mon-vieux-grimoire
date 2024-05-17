const {register, login} = require("../functions/auth.function");
module.exports = (app) => {
  // ACTION: check the email usage, create and store a user and create an authentication token.
  app.post('/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    await register(res, email, password);
  });
  // ACTION: verify credentials and create an authentication token.
  app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    await login(res, email, password);
  });
}
