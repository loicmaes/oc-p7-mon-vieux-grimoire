const mongoose = require('mongoose');

async function load (connectionPath) {
  try {
    console.log(`[Mongoose] Connecting to "${connectionPath}"...`);
    await mongoose.connect(connectionPath);
    console.log(`[Mongoose] Connected!`);
  } catch (e) {
    console.log(e);
  }
}

module.exports = load;
