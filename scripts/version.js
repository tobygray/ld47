console.log("Hello");

let fs = require('fs');

var versionInfo = {
	"commit": process.argv[2],
	"time": process.argv[3],
};

fs.writeFile("build_info.json", JSON.stringify(versionInfo),
	     (err) => { if (err) throw err; });
