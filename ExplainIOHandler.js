const yauzl = require('yauzl-promise');
const fs = require("fs");
const PNG = require("pngjs").PNG;
const path = require("path");
const { promisify } = require('util');
const { pipeline } = require('stream/promises');

async function unzip(pathIn, pathOut) {
  const zip = await yauzl.open(pathIn);

  try {
    await fs.promises.mkdir(pathOut, { recursive: true });

    for await (const entry of zip) {
      if (entry.filename.endsWith('/')) {
        await fs.promises.mkdir(`${pathOut}/${entry.filename}`, { recursive: true });
      } else {
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(`${pathOut}/${entry.filename}`);
        await pipeline(readStream, writeStream);
      }
    }
  } finally {
    await zip.close();
  }
}

const readdir = promisify(fs.readdir);

async function readDir(directoryPath) {
  try {
    const files = await readdir(directoryPath);
    const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png');
    const filePaths = pngFiles.map(file => path.join(directoryPath, file));
    return Promise.resolve(filePaths);
  } catch (error) {
    return Promise.reject(error);
  }
}

function grayscale(pathIn, pathOut) {
  fs.promises.mkdir(pathOut, { recursive: true })
    .then(() => fs.promises.readdir(pathIn))
    .then((files) => {
      files.forEach((file) => {
        if (file.endsWith('.png')) {
          const filePathIn = `${pathIn}/${file}`;
          const filePathOut = `${pathOut}/${file}`;

          fs.createReadStream(filePathIn)
            .pipe(new PNG({ filterType: 4 }))
            .on("parsed", function () {
              for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                  var idx = (this.width * y + x) << 2;
                  var local_variable = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
                  this.data[idx] = local_variable;
                  this.data[idx + 1] = local_variable;
                  this.data[idx + 2] = local_variable;
                }
              }
              this.pack().pipe(fs.createWriteStream(filePathOut));
            })
            .on('error', (err) => console.log(`Error processing file ${filePathIn}: ${err}`));
        }
      });
    })
    .catch(err => console.log(err));
}

grayscale('B:/Programming/Lab6/starter 6 2/unzipped', 'B:/Programming/Lab6/starter 6 2/output');

module.exports = {
  unzip,
  readDir,
  grayscale
};
