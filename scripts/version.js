const fs = require('fs');

const versionInfo = {
  commit: process.argv[2],
  time: process.argv[3],
};

fs.writeFile('dist/build_info.json', JSON.stringify(versionInfo),
  (err) => { if (err) throw err; });
