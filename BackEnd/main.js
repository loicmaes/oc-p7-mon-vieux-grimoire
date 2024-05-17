require('dotenv').config();
const path = require('path');
const {recoverFiles} = require("./src/handlers/files.handler");
const express = require('express');
const cors = require('cors');

const app = express();
// Apply global middlewares
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Apply a global prefix to express api
const router = express.Router();

// Try a database connection
require('./src/database')(process.env.DATABASE_URL ?? 'mongodb://localhost:27017')
    .then(_ => {
      console.log('---');

      // Load database models
      const modelsPaths = recoverFiles('./src/database/models', true);
      modelsPaths.length ? modelsPaths.forEach(path => {
        console.log(`[LOAD - Models] Loading "${path.substring(2)}"`);
        require(path);
      }) : console.log('[LOAD - Models] No models found!');

      console.log('---');

      // Load controllers (routes registering)
      const ctrlPaths = recoverFiles('./src/controllers', true);
      ctrlPaths.length ? ctrlPaths.forEach(path => {
        console.log(`[LOAD - Controller] Loading "${path.substring(2)}"`);
        require(path)(router);
      }) : console.log('[LOAD - Controllers] No controllers found!');

      app.use('/api', router);

      console.log('---');

      // Start server on specific port
      const port = parseInt(process.env.API_PORT ?? '3000');
      app.listen(port, () => {
        console.log(`[API] Listening on http://localhost:${port}/`);
      });
    }).catch(console.error);
