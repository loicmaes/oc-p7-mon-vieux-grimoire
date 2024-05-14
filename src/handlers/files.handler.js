const fs = require('fs');

function recoverFiles (path, children = false) {
  const files = [];

  fs.readdirSync(path).forEach(file => {
    if (fs.lstatSync(`${path}/${file}`).isDirectory() && children) recoverFiles(`${path}/${file}`, true).forEach(files.push);
    else if (file.endsWith('.js')) files.push(`${path}/${file}`);
  });

  return files;
}

module.exports = {
  recoverFiles
}
