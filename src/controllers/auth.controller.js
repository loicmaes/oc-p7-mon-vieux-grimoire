const {register, login} = require("../functions/auth.function");
module.exports = (app) => {
  app.post('/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    await register(res, email, password);
  });

  app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    await login(res, email, password);
  });
}
