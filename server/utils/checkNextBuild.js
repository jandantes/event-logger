const fs = require('fs');
const path = require('path');

const checkNextBuild = (req, res) => {
  const BUILD_ID = fs.readFileSync(path.join(__dirname, '../../.next/BUILD_ID'), 'utf8').trim();
  const file = req.params[0];
  // Check Build Hash
  if (file.search(`${BUILD_ID}/`) === -1) {
    const url = `/_next/${BUILD_ID}${file.slice(file.indexOf('/'))}`;
    res.redirect(301, url);
  }
  return 'valid';
};

module.exports = checkNextBuild;
